import test from "node:test";
import assert from "node:assert/strict";
import { resolveAttribution, captureLeadAttribution, addInquiryMetadata, isPipelineTest } from "../src/lib/lead-attribution.ts";

test("campaign attribution survives an untagged trip to the inquiry form", () => {
  const entry = resolveAttribution("https://www.elevate360systems.com/?utm_source=google&utm_medium=cpc&utm_campaign=123&gclid=click-abc&email=private@example.test", null);
  const inquiry = resolveAttribution("https://www.elevate360systems.com/systems/nettruth/diagnostic", entry);
  assert.deepEqual(inquiry, entry);
  assert.equal(inquiry.landing_path, "/");
  assert.equal(inquiry.parameters.gclid, "click-abc");
  assert.equal("email" in inquiry.parameters, false);
  assert.equal(JSON.stringify(inquiry).includes("private@example.test"), false);
});

test("a later campaign cannot inherit an earlier Google click ID", () => {
  const first = resolveAttribution("https://www.elevate360systems.com/?utm_source=google&gclid=old-click", null);
  const second = resolveAttribution("https://www.elevate360systems.com/?utm_source=partner&utm_campaign=referral", first);
  assert.deepEqual(second.parameters, { utm_source: "partner", utm_campaign: "referral" });
});

test("plain arrivals do not fabricate paid attribution", () => {
  const direct = resolveAttribution("https://www.elevate360systems.com/#contact", null);
  assert.deepEqual(direct.parameters, {});
  assert.equal(direct.landing_path, "/");
});

test("campaign metadata is bounded and strips control characters", () => {
  const attribution = resolveAttribution(`https://www.elevate360systems.com/?utm_source=%0Agoogle%0D&utm_campaign=${"x".repeat(1000)}`, null);
  assert.equal(attribution.parameters.utm_source, "google");
  assert.equal(attribution.parameters.utm_campaign.length, 500);
});

test("accepted inquiry payload can carry attribution and an explicit QA exclusion across pages", () => {
  const values = new Map();
  const location = new URL("https://www.elevate360systems.com/?utm_source=google&utm_medium=cpc&gclid=qa-click&e360_test=1");
  globalThis.window = {
    location,
    sessionStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
    },
  };
  captureLeadAttribution();
  assert.equal(isPipelineTest(), true);
  window.location = new URL("https://www.elevate360systems.com/systems/nettruth/diagnostic");
  const form = new FormData();
  form.set("name", "Internal QA");
  addInquiryMetadata(form, "qa-inquiry-id", isPipelineTest());
  assert.equal(form.get("inquiry_id"), "qa-inquiry-id");
  assert.equal(form.get("landing_path"), "/");
  assert.equal(form.get("form_path"), "/systems/nettruth/diagnostic");
  assert.equal(form.get("gclid"), "qa-click");
  assert.match(form.get("is_test"), /exclude from leads and revenue/);
  assert.equal([...values.values()].some(value => value.includes("Internal QA")), false);
  delete globalThis.window;
});

test("blocked session storage does not block attribution or inquiry creation", () => {
  globalThis.window = {
    location: new URL("https://www.elevate360systems.com/?utm_source=google&wbraid=ios-click"),
    sessionStorage: {
      getItem: () => { throw new Error("blocked"); },
      setItem: () => { throw new Error("blocked"); },
    },
  };
  const form = new FormData();
  assert.doesNotThrow(() => addInquiryMetadata(form, "storage-blocked-id", false));
  assert.equal(form.get("wbraid"), "ios-click");
  assert.equal(form.get("is_test"), "no");
  delete globalThis.window;
});
