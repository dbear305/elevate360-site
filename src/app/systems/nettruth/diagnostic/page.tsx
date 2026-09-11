import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/app/contact-form";
import { SystemHeader } from "../../system-header";
import { SystemFooter } from "../../system-footer";

export const metadata: Metadata = {
  title: "Paid Network Diagnostics | NetTruth",
  description: "Network diagnostics for businesses in Florida and North Texas, starting at $750. Guided measurements, documented findings, and a prioritized correction plan within an agreed scope.",
  alternates: { canonical: "/systems/nettruth/diagnostic" },
  openGraph: {
    title: "NetTruth Business Network Diagnostic",
    description: "A defined investigation for recurring connection problems. Starts at $750; scope and price agreed before work begins.",
    url: "/systems/nettruth/diagnostic",
  },
};

const deliverables = [
  { title: "Guided measurements", body: "Reproduce the reported problem where possible. Compare idle and loaded behavior, connection types, and relevant NetTruth results." },
  { title: "Configuration review", body: "Review the router, Wi-Fi, or firewall information relevant to the agreed problem, with your authorization and available access." },
  { title: "Written findings and next steps", body: "Receive the evidence, supported findings, remaining unknowns, and a prioritized correction plan. Review the findings together." },
];

export default function DiagnosticPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <a href="#diagnostic-request" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:p-4 focus:text-slate-950">Skip to diagnostic request</a>
      <SystemHeader />
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
          <Link href="/systems/nettruth" className="text-sky-200 underline underline-offset-4">NetTruth</Link>
          <span aria-hidden="true"> / </span> Business diagnostic
        </nav>

        <section className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px]" aria-labelledby="diagnostic-title">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">Florida &amp; North Texas · Paid service</p>
            <h1 id="diagnostic-title" className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Get a clear next step for a recurring network problem.</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">Dropped calls. Unreliable Wi-Fi. Slowdowns when the connection gets busy. A NetTruth diagnostic turns measurements and authorized configuration review into a documented plan for your business.</p>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-400">Work directly with Elevate360 Systems. We agree the problem, access, time allocation, and deliverables before the investigation starts.</p>
          </div>
          <aside className="rounded-2xl border border-cyan-300/30 bg-[#0a202c] p-7 sm:p-8" aria-label="Diagnostic price and scope">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-cyan-300">Business network diagnostic</p>
            <p className="mt-5 text-sm text-slate-300">Starts at</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight">$750</p>
            <p className="mt-5 text-sm leading-7 text-slate-300">The starting engagement covers one business location and one agreed network problem, investigated remotely. The written quote sets the total price and time allocation.</p>
            <a href="#diagnostic-request" className="mt-7 flex min-h-12 items-center justify-center rounded-lg bg-cyan-200 px-5 py-3 text-center text-sm font-semibold text-slate-950 hover:bg-cyan-100">Request diagnostic scope <span aria-hidden="true" className="ml-3">→</span></a>
            <p className="mt-4 text-xs leading-6 text-slate-400">Send the problem details first. No charge or appointment is created by this form.</p>
          </aside>
        </section>

        <section className="mt-16 border-t border-white/10 pt-10" aria-labelledby="deliverables-title">
          <h2 id="deliverables-title" className="text-2xl font-semibold tracking-tight">What the paid diagnostic includes</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {deliverables.map((item, index) => <article key={item.title} className="rounded-2xl border border-white/10 bg-[#0b1425] p-6">
              <p className="font-mono text-xs text-cyan-300">0{index + 1}</p>
              <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{item.body}</p>
            </article>)}
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-7 text-slate-400">A diagnostic may identify the cause or narrow the investigation. Intermittent faults, unavailable access, or a problem outside the tested environment can leave unanswered questions; those go in the report. Repairs, hardware, on-site visits, additional locations, and ongoing support are quoted separately.</p>
        </section>

        <section className="mt-14 grid gap-8 border-y border-white/10 py-10 md:grid-cols-2" aria-label="Automated testing and regional coverage">
          <div>
            <h2 className="text-xl font-semibold">Where self-service ends</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">The public NetTruth test and JSON export are currently available at no charge. They provide automated measurements and guidance. Personal report review, troubleshooting, configuration review, and recommendations for your business are paid work.</p>
            <Link href="/systems/nettruth" className="mt-4 inline-flex min-h-11 items-center text-sm text-cyan-200 underline underline-offset-4">Run the automated test</Link>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Miami and Dallas measurement nodes</h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">Our current service focus is businesses in Florida and North Texas. People elsewhere can run NetTruth; results describe the route to the selected node. Distance, ISP routing, Wi-Fi, and congestion affect the measurement.</p>
            <p className="mt-3 text-sm leading-7 text-slate-400">Auto compares measured response times. It does not select by driving distance or promise a nearest server. For service outside our focus regions, include your location so we can confirm availability.</p>
          </div>
        </section>

        <section id="diagnostic-request" className="scroll-mt-44 pt-14 sm:scroll-mt-28" aria-labelledby="request-title">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">Start with the business problem</p>
          <h2 id="request-title" className="mt-4 text-3xl font-semibold tracking-tight">Request a paid diagnostic scope.</h2>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">Tell us what is failing and where. We review the request for fit, then agree the scope, schedule, price, and payment terms with you. Technical investigation begins after that agreement.</p>
          <ContactForm intent="diagnostic" />
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-400">This form sends your inquiry through FormSubmit to Elevate360 Systems. You can also <a href="mailto:contact@elevate360systems.com?subject=NetTruth%20paid%20diagnostic%20scope%20request" className="text-cyan-200 underline underline-offset-4">email the details</a> or <a href="tel:+17863127320" className="text-cyan-200 underline underline-offset-4">call 786-312-7320</a>.</p>
        </section>
      </div>
      <SystemFooter />
    </main>
  );
}
