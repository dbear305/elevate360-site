import type { Metadata } from "next";
import Link from "next/link";

const siteUrl = "https://www.elevate360systems.com";

export const metadata: Metadata = {
  title: "Elevate360 Systems LLC | Official Company Information",
  description:
    "Official company information for Elevate360 Systems LLC, a Miami-based Florida company focused on secure infrastructure, custom software, automation, diagnostics, and operational systems.",
  alternates: {
    canonical: "/company",
  },
};

const companyJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteUrl}/#organization`,
  name: "Elevate360 Systems LLC",
  legalName: "Elevate360 Systems LLC",
  alternateName: "Elevate360 Systems",
  url: siteUrl,
  disambiguatingDescription:
    "Independent Florida technology and systems engineering company based in Miami. The official website is elevate360systems.com.",
  identifier: {
    "@type": "PropertyValue",
    propertyID: "Florida Division of Corporations document number",
    value: "L25000400858",
  },
  founder: {
    "@type": "Person",
    name: "Daniel Berriel IV",
    sameAs: ["https://www.linkedin.com/in/daniel-berriel-70ab04385"],
  },
};

export default function CompanyPage() {
  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-300">
          Official Company Identity
        </p>

        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
          Elevate360 Systems LLC
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          Elevate360 Systems LLC is an independent Florida technology and systems
          engineering company based in Miami. The official company website is
          elevate360systems.com.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-semibold">Legal entity</h2>
            <dl className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <div>
                <dt className="font-semibold text-white">Legal name</dt>
                <dd>Elevate360 Systems LLC</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Florida document number</dt>
                <dd>L25000400858</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Location</dt>
                <dd>Miami, Florida, United States</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-lg font-semibold">Official digital identity</h2>
            <dl className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
              <div>
                <dt className="font-semibold text-white">Official website</dt>
                <dd>www.elevate360systems.com</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Official email domain</dt>
                <dd>@elevate360systems.com</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Founder</dt>
                <dd>Daniel Berriel IV</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-sky-400/20 bg-sky-400/[0.08] p-7">
          <h2 className="text-xl font-semibold">No implied affiliation</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            Elevate360 Systems LLC is independent. Businesses, websites, products,
            or services using “Elevate360,” “Elevate 360,” or similar names are
            not affiliated with Elevate360 Systems LLC unless that relationship is
            explicitly stated on this official website.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">What Elevate360 Systems does</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-300">
            Elevate360 Systems designs and builds secure infrastructure, custom
            software, workflow automation, network diagnostics, monitoring, and
            operational systems for real-world environments.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950"
          >
            Main site
          </Link>
          <Link
            href="/systems"
            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold"
          >
            Systems
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(companyJsonLd).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  );
}
