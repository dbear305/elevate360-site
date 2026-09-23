import test, { afterEach } from "node:test";
import assert from "node:assert/strict";
import { initializeGoogleAds, trackAcceptedInquiry } from "../src/lib/google-ads.ts";

function browser(href = "https://www.elevate360systems.com/") {
  const scripts = [];
  globalThis.window = { location: new URL(href) };
  globalThis.document = {
    getElementById: id => scripts.find(script => script.id === id),
    createElement: () => ({}),
    head: { appendChild: script => scripts.push(script) },
  };
  return { scripts, commands: () => (window.dataLayer ?? []).map(command => Array.from(command)) };
}

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
});

test("page initialization denies storage and user data before config, and emits no conversion", () => {
  const runtime = browser();
  assert.equal(initializeGoogleAds(false), true);
  assert.equal(runtime.scripts.length, 1);
  assert.equal(runtime.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=AW-17790874444");
  const commands = runtime.commands();
  assert.deepEqual(commands[0], ["consent", "default", {
    ad_storage: "denied", analytics_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  }]);
  const config = commands.find(command => command[0] === "config");
  assert.equal(config[2].send_page_view, false);
  assert.equal(config[2].allow_ad_personalization_signals, false);
  assert.equal(config[2].restricted_data_processing, true);
  assert.equal(commands.some(command => command[0] === "event"), false);
  initializeGoogleAds(false);
  assert.equal(runtime.scripts.length, 1);
});

test("only an accepted non-test inquiry queues the verified event, without revenue or customer fields", () => {
  const runtime = browser();
  assert.equal(trackAcceptedInquiry({ ok: true, result: { success: "true" } }, "inquiry-123", false), true);
  const events = runtime.commands().filter(command => command[0] === "event");
  assert.deepEqual(events, [["event", "conversion", {
    send_to: "AW-17790874444/A7NKCIjtn4IdEMzmrKNC",
    transaction_id: "inquiry-123",
    value: 0,
    currency: "USD",
    allow_ad_personalization_signals: false,
    restricted_data_processing: true,
  }]]);
  assert.equal(trackAcceptedInquiry({ ok: true, result: { success: true } }, "inquiry-123", false), false);
  assert.equal(runtime.commands().filter(command => command[0] === "event").length, 1);
});

test("failure responses, malformed success, and missing inquiry ID never load a tag or convert", () => {
  const runtime = browser();
  for (const response of [
    { ok: false, result: { success: true } },
    { ok: true, result: { success: false } },
    { ok: true, result: { success: "false" } },
    { ok: true, result: { success: 1 } },
    { ok: true, result: null },
    { ok: true, result: {} },
  ]) assert.equal(trackAcceptedInquiry(response, "failed-inquiry", false), false);
  assert.equal(trackAcceptedInquiry({ ok: true, result: { success: true } }, "", false), false);
  assert.deepEqual(runtime.commands(), []);
  assert.equal(runtime.scripts.length, 0);
});

test("internal QA completely skips Google scripts and events even after provider acceptance", () => {
  const runtime = browser("https://www.elevate360systems.com/?e360_test=1");
  assert.equal(initializeGoogleAds(true), false);
  assert.equal(trackAcceptedInquiry({ ok: true, result: { success: true } }, "qa-inquiry", true), false);
  assert.deepEqual(runtime.commands(), []);
  assert.equal(runtime.scripts.length, 0);
});

test("localhost and deployment previews cannot pollute production Ads measurement", () => {
  for (const href of ["http://localhost:3000/", "https://elevate360-preview.vercel.app/"]) {
    const runtime = browser(href);
    assert.equal(trackAcceptedInquiry({ ok: true, result: { success: true } }, "preview-inquiry", false), false);
    assert.deepEqual(runtime.commands(), []);
    assert.equal(runtime.scripts.length, 0);
  }
});

test("blocked measurement cannot turn an accepted inquiry into a submission exception", () => {
  browser();
  window.gtag = () => { throw new Error("analytics blocked"); };
  assert.doesNotThrow(() => {
    assert.equal(trackAcceptedInquiry({ ok: true, result: { success: true } }, "accepted-inquiry", false), false);
  });
});
