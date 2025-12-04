import React from "react";

export default function MatchMetricsPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Page header */}
        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
          MatchMetrics<span className="align-super text-[0.55em]">™</span>
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-300">
          MatchMetrics is a privacy-first, advisory-only engine designed to help
          humans make clearer decisions across relationships, teams, lifestyle,
          and work. It doesn&apos;t judge, label, or diagnose—it highlights
          patterns, alignment, and friction so people can see what&apos;s really
          going on before they commit.
        </p>

        {/* Ethics / privacy block */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-slate-50">
            Privacy-first. Advisory-only. Human-controlled.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            MatchMetrics never attempts clinical, medical, or psychological
            assessment. It works only with the surface-level information the
            user chooses to provide, and it returns patterns—not decisions.
            Every vertical is designed to respect boundaries and keep humans in
            control.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li>• No psychological scoring or diagnosis</li>
            <li>• No protected attributes</li>
            <li>• No hiring decisions or screening</li>
            <li>• No data selling or side-channel sharing</li>
            <li>• Minimal data, local-first designs where possible</li>
            <li>• Insights are advisory-only—humans always decide</li>
          </ul>
        </section>

        {/* Verticals intro */}
        <section className="mt-14">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-50">
            MatchMetrics<span className="align-super text-[0.55em]">™</span>{" "}
            verticals
          </h2>
          <p className="mt-3 max-w-3xl text-sm text-slate-300">
            Each vertical focuses on a specific domain of human decision-making.
            Some operate independently; others work together to provide deeper
            clarity without crossing ethical lines. All of them are advisory,
            not automated judgment.
          </p>
        </section>

        {/* Verticals grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Vertical
            title="MatchMetrics Relationship™"
            desc="Personal relationship advisor. Reads dating profiles, highlights compatibility patterns and behavioral trends, and surfaces alignment signals. Advisory insights only—humans make all decisions."
          />

          <Vertical
            title="MatchMetrics Business™"
            desc="Team alignment & collaboration insight. Not hiring or filtering. Strictly advisory on team-fit patterns, communication style, collaboration patterns, and manager–candidate alignment using non-protected attributes only."
          />

          <Vertical
            title="MatchMetrics Social™"
            desc="Friendship & social-circle alignment. Helps match gym partners, accountability partners, and new city connections. Low-pressure compatibility insights with no judging and no labels."
          />

          <Vertical
            title="MatchMetrics Focus™"
            desc="Decision-clarity engine. Organizes pros/cons, reduces emotional noise, and simplifies complex choices. Offers weighted clarity insights; the human always decides."
          />

          <Vertical
            title="MatchMetrics Insight™"
            desc="Self-awareness & behavioral reflection. Highlights personal tendencies, repeated patterns, and misalignments over time. Non-clinical, non-psychological, advisory-only."
          />

          <Vertical
            title="MatchMetrics Risk™"
            desc="Behavioral volatility & inconsistency insight—not a psychological assessment and not a danger score. Identifies inconsistent patterns, misaligned goals, emotional unpredictability, and potential friction areas. Human interprets; human decides."
          />

          <Vertical
            title="MatchMetrics Analyst™"
            desc="Expert-level advisory dashboard with full pattern breakdown, multi-factor weighted insights, and expanded KPIs. Built for founders, executives, and planners who want deeper clarity with human-controlled decisions."
          />

          <Vertical
            title="MatchMetrics WorkFit™"
            desc="Role & workflow alignment (Business sub-vertical). Not hiring or screening. Offers insight into task preference, workflow style, ideal environments, and manager fit. Optional participation only."
          />

          <Vertical
            title="MatchMetrics TeamFlow™"
            desc="Dynamic team pairing (Business sub-vertical). Pairs people for projects, identifies collaboration synergy, and highlights likely friction points so project managers can assemble balanced teams. Advisory-only."
          />

          <Vertical
            title="MatchMetrics PartnerFit™"
            desc="Business partner alignment for co-founders and long-term partners: vision, work ethic, pace, and communication style. No judgments—just alignment signals."
          />

          <Vertical
            title="MatchMetrics TravelMate™"
            desc="Travel compatibility advisory: preferred pace, structure vs spontaneity, budget alignment, sleep/wake rhythm, and activity fit so people stop getting stuck with mismatched travel partners."
          />

          <Vertical
            title="MatchMetrics RoomMate™"
            desc="Roommate / co-living compatibility using safe, non-private lifestyle signals: cleanliness preference, schedule alignment, noise tolerance, lifestyle mismatch warnings, and communication style."
          />

          <Vertical
            title="MatchMetrics Accountability™"
            desc="Pairs people for gym, recovery, and lifestyle changes based on consistency and preference patterns. Ethically safe, no sensitive health data required. Advisory-only."
          />

          <Vertical
            title="MatchMetrics MentorLink™"
            desc="Mentor–apprentice compatibility advisory: work style, communication, pace, learning preferences, and motivational alignment. Helps reduce mismatch stress."
          />
        </div>

        {/* Closing section */}
        <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-xl font-semibold text-slate-50">
            Built for real people making real decisions.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            MatchMetrics doesn&apos;t try to replace human judgment. It enhances
            it by making patterns visible so people can act with clarity instead
            of confusion. Every vertical respects boundaries, privacy, and human
            autonomy.
          </p>
        </section>
      </div>
    </main>
  );
}

function Vertical({ title, desc }: { title: string; desc: string }) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
      <h3 className="text-sm font-semibold text-slate-50">{title}</h3>
      <p className="mt-2 text-sm text-slate-300">{desc}</p>
    </article>
  );
}
