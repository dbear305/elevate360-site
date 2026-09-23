export type ProviderFailure = "activation_required" | "invalid_origin" | "captcha_or_blocked" | "rejected_unknown";

// Provider text is used only for classification. It must never be rendered or
// logged because a provider may echo an address or submitted customer details.
export function classifyProviderFailure(result: unknown): ProviderFailure {
  if (!result || typeof result !== "object" || !("message" in result) || typeof result.message !== "string") {
    return "rejected_unknown";
  }
  const message = result.message.toLowerCase().slice(0, 2000);
  if (/activat|confirm.{0,40}(email|form)|verify.{0,40}email/.test(message)) return "activation_required";
  if (/origin|referer|referrer|web server|html files|form url|_url/.test(message)) return "invalid_origin";
  if (/captcha|blocked|blacklist|spam|too many|rate limit|forbidden/.test(message)) return "captcha_or_blocked";
  return "rejected_unknown";
}

export class FormSubmissionError extends Error {
  readonly category: "http_error" | "invalid_json" | "provider_rejected";
  readonly status: number;
  readonly providerReason?: ProviderFailure;

  constructor(category: FormSubmissionError["category"], status: number, providerReason?: ProviderFailure) {
    super(category);
    this.category = category;
    this.status = status;
    this.providerReason = providerReason;
  }
}

export function safeSubmissionDiagnostic(error: unknown): string {
  if (error instanceof FormSubmissionError) {
    return `HTTP ${error.status}; ${error.category}${error.providerReason ? `; ${error.providerReason}` : ""}`;
  }
  if (error instanceof Error && error.name === "AbortError") return "timeout; no confirmed acceptance within 20 seconds";
  if (error instanceof TypeError) return "network_error; no readable provider response";
  return "client_error; no confirmed acceptance";
}
