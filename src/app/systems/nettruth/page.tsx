import type { Metadata } from "next";
import { SystemHeader } from "../system-header";
import { SystemFooter } from "../system-footer";
import { QuickCheck } from "./quickcheck";
import "./quickcheck.css";

export const metadata: Metadata = {
  title: "NetTruth | Network Speed, Latency, Jitter & Diagnostics",
  description: "Run a live network check. Measure download, upload, latency and jitter, inspect delay under load, and export evidence for a network diagnostic.",
  alternates: { canonical: "/systems/nettruth" },
  openGraph: { title: "NetTruth Network Check | Elevate360 Systems", description: "Live measurements. Clear findings. Evidence you can keep.", url: "/systems/nettruth" },
  twitter: { card: "summary_large_image", title: "NetTruth Network Check", description: "Measure connection quality and understand what to investigate next." },
};

export default function NetTruthPage() {
  let nodeOrigin: string | null = null;
  if (process.env.NETTRUTH_NODE_ORIGIN) {
    const url = new URL(process.env.NETTRUTH_NODE_ORIGIN);
    if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error("NETTRUTH_NODE_ORIGIN must be a bare HTTPS origin.");
    nodeOrigin = url.origin;
  }
  return <main className="nt-page min-h-screen bg-[#020817] text-white">
    <a href="#network-check" className="nt-skip">Skip to network test</a>
    <SystemHeader />
    <QuickCheck config={{ nodeOrigin, nodeName: process.env.NETTRUTH_NODE_NAME || "NetTruth measurement node" }} />
    <SystemFooter />
  </main>;
}
