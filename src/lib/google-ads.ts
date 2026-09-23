// Verified in Google Ads: Elevate360 - Accepted Inquiry (7789344392).
// This event records provider acceptance, never qualification or revenue.
const tagId = "AW-17790874444";
const sendTo = "AW-17790874444/A7NKCIjtn4IdEMzmrKNC";
const productionHosts = new Set(["elevate360systems.com", "www.elevate360systems.com"]);

type AdsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  e360AdsInitialized?: boolean;
  e360AdsInquiryIds?: Set<string>;
};

export function initializeGoogleAds(isTest: boolean): boolean {
  if (isTest || typeof window === "undefined" || !productionHosts.has(window.location.hostname)) return false;
  const runtime = window as AdsWindow;
  if (runtime.e360AdsInitialized) return true;
  try {
    runtime.dataLayer ??= [];
    runtime.gtag ??= function () {
      // Use Google's documented arguments-object queue format.
      // eslint-disable-next-line prefer-rest-params
      runtime.dataLayer?.push(arguments);
    };
    // No consent UI exists on this site. Denied defaults stay denied; Google
    // may send cookieless measurement pings, but no advertising cookies,
    // enhanced-conversion customer data, or personalized remarketing.
    runtime.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    runtime.gtag("set", "allow_ad_personalization_signals", false);
    runtime.gtag("set", "restricted_data_processing", true);
    runtime.gtag("js", new Date());
    runtime.gtag("config", tagId, {
      send_page_view: false,
      allow_ad_personalization_signals: false,
      restricted_data_processing: true,
    });
    if (!document.getElementById("e360-google-ads")) {
      const script = document.createElement("script");
      script.id = "e360-google-ads";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${tagId}`;
      document.head.appendChild(script);
    }
    runtime.e360AdsInitialized = true;
    return true;
  } catch {
    // Measurement must never prevent sending an inquiry.
    return false;
  }
}

export function trackAcceptedInquiry(
  response: { ok: boolean; result: unknown },
  inquiryId: string,
  isTest: boolean,
): boolean {
  const result = response.result;
  if (!response.ok || !result || typeof result !== "object" || !("success" in result) ||
      (result.success !== true && result.success !== "true") || !inquiryId ||
      !initializeGoogleAds(isTest)) return false;
  const runtime = window as AdsWindow;
  runtime.e360AdsInquiryIds ??= new Set();
  if (runtime.e360AdsInquiryIds.has(inquiryId)) return false;
  try {
    runtime.gtag?.("event", "conversion", {
      send_to: sendTo,
      transaction_id: inquiryId,
      value: 0,
      currency: "USD",
      allow_ad_personalization_signals: false,
      restricted_data_processing: true,
    });
    runtime.e360AdsInquiryIds.add(inquiryId);
    return true; // Queued locally; this does not assert Google's receipt.
  } catch {
    return false;
  }
}
