"use client";

import { Analytics } from "@vercel/analytics/next";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { captureLeadAttribution, isPipelineTest } from "@/lib/lead-attribution";
import { initializeGoogleAds } from "@/lib/google-ads";

export function LeadAttributionAnalytics() {
  const pathname = usePathname();
  useEffect(() => {
    captureLeadAttribution();
    initializeGoogleAds(isPipelineTest());
  }, [pathname]);

  return <Analytics beforeSend={event => isPipelineTest() ? null : event} />;
}
