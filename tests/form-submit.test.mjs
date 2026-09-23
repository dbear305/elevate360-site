import test from "node:test";
import assert from "node:assert/strict";
import { classifyProviderFailure, FormSubmissionError, safeSubmissionDiagnostic } from "../src/lib/form-submit.ts";

test("provider failures become controlled diagnostic categories, never echoed content", () => {
  for (const [message, expected] of [
    ["Please activate your form at private@example.test", "activation_required"],
    ["FormSubmit will not work in pages browsed as HTML files", "invalid_origin"],
    ["CAPTCHA verification failed", "captcha_or_blocked"],
    ["This request is blocked", "captcha_or_blocked"],
    ["Unexpected rejection for Customer Name private@example.test", "rejected_unknown"],
  ]) {
    const reason = classifyProviderFailure({ message });
    assert.equal(reason, expected);
    const diagnostic = safeSubmissionDiagnostic(new FormSubmissionError("provider_rejected", 200, reason));
    assert.equal(diagnostic.includes("private@example.test"), false);
    assert.equal(diagnostic.includes("Customer Name"), false);
  }
});

test("HTTP failure and invalid JSON stay distinguishable", () => {
  assert.equal(safeSubmissionDiagnostic(new FormSubmissionError("http_error", 403, "captcha_or_blocked")), "HTTP 403; http_error; captcha_or_blocked");
  assert.equal(safeSubmissionDiagnostic(new FormSubmissionError("invalid_json", 200)), "HTTP 200; invalid_json");
});

test("timeouts and unreadable network responses never expose raw exception text", () => {
  const timeout = new Error("sensitive endpoint");
  timeout.name = "AbortError";
  assert.match(safeSubmissionDiagnostic(timeout), /^timeout;/);
  assert.match(safeSubmissionDiagnostic(new TypeError("sensitive endpoint")), /^network_error;/);
  assert.equal(safeSubmissionDiagnostic(new Error("private@example.test")), "client_error; no confirmed acceptance");
});

test("unrecognized provider bodies cannot be rendered as diagnostic text", () => {
  for (const result of [null, "<script>bad</script>", {}, { message: { email: "private@example.test" } }]) {
    assert.equal(classifyProviderFailure(result), "rejected_unknown");
  }
});
