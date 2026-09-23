// Retain only campaign metadata for this browser tab. Never store form contents.
const storageKey = "e360.lead-attribution.v1";
const testStorageKey = "e360.pipeline-test.v1";
const attributionKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content",
  "gclid", "gbraid", "wbraid",
] as const;

type AttributionKey = typeof attributionKeys[number];
export type LeadAttribution = {
  landing_path: string;
  captured_at: string;
  parameters: Partial<Record<AttributionKey, string>>;
};

let memoryAttribution: LeadAttribution | null = null;
let memoryTest = false;

function clean(value: string | null): string {
  return (value ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 500);
}

export function resolveAttribution(
  href: string,
  previous: LeadAttribution | null,
  now = new Date(),
): LeadAttribution {
  const url = new URL(href);
  const parameters: LeadAttribution["parameters"] = {};
  for (const key of attributionKeys) {
    const value = clean(url.searchParams.get(key));
    if (value) parameters[key] = value;
  }
  // A new tagged visit replaces the entire touch so old click IDs cannot leak
  // into a later campaign. Untagged internal navigation retains the entry.
  if (Object.keys(parameters).length === 0 && previous) return previous;
  return { landing_path: url.pathname, captured_at: now.toISOString(), parameters };
}

function readStoredAttribution(): LeadAttribution | null {
  try {
    const raw = window.sessionStorage.getItem(storageKey);
    if (!raw) return memoryAttribution;
    const candidate: unknown = JSON.parse(raw);
    if (!candidate || typeof candidate !== "object" ||
        !("landing_path" in candidate) || typeof candidate.landing_path !== "string" ||
        !("captured_at" in candidate) || typeof candidate.captured_at !== "string" ||
        !("parameters" in candidate) || !candidate.parameters || typeof candidate.parameters !== "object") {
      return memoryAttribution;
    }
    const parameters: LeadAttribution["parameters"] = {};
    for (const key of attributionKeys) {
      const value = (candidate.parameters as Record<string, unknown>)[key];
      if (typeof value === "string" && clean(value)) parameters[key] = clean(value);
    }
    return {
      landing_path: candidate.landing_path.slice(0, 500),
      captured_at: candidate.captured_at,
      parameters,
    };
  } catch {
    return memoryAttribution;
  }
}

export function captureLeadAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;
  memoryAttribution = resolveAttribution(window.location.href, readStoredAttribution());
  try {
    window.sessionStorage.setItem(storageKey, JSON.stringify(memoryAttribution));
  } catch {
    // Storage restrictions must not prevent an inquiry from being sent.
  }
  return memoryAttribution;
}

export function isPipelineTest(): boolean {
  if (typeof window === "undefined") return false;
  if (new URLSearchParams(window.location.search).get("e360_test") === "1") memoryTest = true;
  try {
    if (memoryTest) window.sessionStorage.setItem(testStorageKey, "1");
    return memoryTest || window.sessionStorage.getItem(testStorageKey) === "1";
  } catch {
    return memoryTest;
  }
}

export function addInquiryMetadata(formData: FormData, inquiryId: string, test: boolean): void {
  const attribution = captureLeadAttribution();
  formData.set("inquiry_id", inquiryId);
  formData.set("submitted_at", new Date().toISOString());
  formData.set("is_test", test ? "yes - internal pipeline test; exclude from leads and revenue" : "no");
  formData.set("form_path", window.location.pathname);
  if (attribution) {
    formData.set("landing_path", attribution.landing_path);
    formData.set("attribution_captured_at", attribution.captured_at);
    for (const [key, value] of Object.entries(attribution.parameters)) formData.set(key, value);
  }
}
