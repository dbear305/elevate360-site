export const metadata = {
  title: "Engineering Consulting for Real-World Systems | Elevate360 Systems",
  description:
    "Engineering consulting focused on real-world systems, cybersecurity, automation, and operational reliability. Built for environments where software must perform under real constraints.",
alternates: {
  canonical: "https://elevate360systems.com/engineering-consulting",
},
  openGraph: {
    title: "Engineering Consulting for Real-World Systems",
    description:
      "Systems engineering and cybersecurity consulting built for real-world operational environments.",
    url: "https://elevate360systems.com/engineering-consulting",
    siteName: "Elevate360 Systems",
    type: "website",
  },
};
export default function EngineeringConsultingPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-20">
      <section className="mt-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl lg:text-6xl">
          Engineering Consulting for Real-World Systems
        </h1>

        <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300">
          Elevate360 Systems provides engineering consulting for real-world environments where reliability,
          security, and operational clarity matter more than demos. We work with operators, founders, and
          technical teams to design, harden, and automate systems that must perform under real constraints.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-slate-50">What we do</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>Systems engineering & architecture</li>
              <li>Secure software & backend engineering</li>
              <li>Workflow automation & operational tooling</li>
              <li>Cybersecurity hardening & infrastructure design</li>
              <li>Applied mathematics, modeling, and diagnostics</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
            <h2 className="text-lg font-semibold text-slate-50">Who it’s for</h2>
            <ul className="mt-3 list-disc pl-5 text-sm text-slate-300 space-y-2">
              <li>Founders scaling systems that can’t break</li>
              <li>Teams inheriting fragile infrastructure</li>
              <li>Operators needing clarity before major builds</li>
              <li>Businesses that value security and long-term reliability</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-slate-50">Start an engagement</h2>
          <p className="mt-3 text-sm text-slate-300">
            If you need clarity, security, or operational reliability, reach out and we’ll define the fastest
            path to a durable solution.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href="mailto:contact@elevate360systems.com"
              className="rounded-full bg-sky-600 px-8 py-3 text-sm font-semibold text-white hover:bg-sky-500 transition"
            >
              Email Elevate360
            </a>
            <a
              href="/#services"
              className="rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-slate-50 transition"
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
