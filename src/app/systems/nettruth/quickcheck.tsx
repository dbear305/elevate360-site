"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@vercel/analytics";
import { findings, format, metrics, parseLocalReport, percentile, evaluateUseCases, type CheckReport, type FleetConfig, type LocalReport, type TestMode, type TestPhase } from "@/lib/nettruth/model";
import { initialReport, runMeasurement } from "@/lib/nettruth/measurement";
import { selectMeasurementNode } from "@/lib/nettruth/node-selection";
import { Methodology } from "./methodology";

const stages: { id: TestPhase; label: string }[] = [{ id: "latency", label: "Idle latency" }, { id: "download", label: "Download" }, { id: "upload", label: "Upload" }, { id: "packetLoss", label: "Packet loss" }];
const phaseLabel: Record<TestPhase, string> = { selecting: "Checking test servers from your connection", connecting: "Connecting to measurement endpoint", latency: "Measuring response time", download: "Measuring download and loaded latency", upload: "Measuring upload and loaded latency", packetLoss: "Checking the UDP relay", complete: "Test finished" };

function ActionIcon({ stop = false }: { stop?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{stop ? <rect x="6" y="6" width="12" height="12" rx="1" /> : <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>}</svg>;
}

function exportJson(value: unknown, name: string) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function LatencyChart({ report }: { report: CheckReport | null }) {
  const groups = [{ title: "Idle", color: "#67e8f9", data: report?.samples.idle || [] }, { title: "Download load", color: "#a5b4fc", data: report?.samples.downloadLatency || [] }, { title: "Upload load", color: "#fbbf24", data: report?.samples.uploadLatency || [] }];
  const all = groups.flatMap(g => g.data);
  const max = Math.max(20, ...all) * 1.15;
  return <div className="nt-chart">
    <div className="nt-section-head"><h2>Latency under load</h2><span>Lower is better · ms</span></div>
    {!all.length ? <div className="nt-chart-empty"><span className="nt-empty-rule" /><p>Your live latency samples will appear here.</p><span>Watch what happens when the connection gets busy.</span></div> : <svg viewBox="0 0 900 215" role="img" aria-label={`Latency samples: ${groups.map(g => `${g.title} median ${format(percentile(g.data, .5))} milliseconds`).join(", ")}`}>
      {[0, .5, 1].map(t => <g key={t}><line x1="45" x2="888" y1={175 - t * 145} y2={175 - t * 145} stroke="#26344b" strokeDasharray="3 5" /><text x="0" y={180 - t * 145} fill="#94a3b8" fontSize="14">{Math.round(max * t)}</text></g>)}
      {groups.map((g, gi) => <g key={g.title}>
        <text x={55 + gi * 280} y="207" fill={g.color} fontSize="14">{g.title} ({g.data.length})</text>
        {g.data.length > 0 && <polyline points={g.data.map((n, i) => `${55 + gi * 280 + i / Math.max(1, g.data.length - 1) * 255},${175 - n / max * 145}`).join(" ")} stroke={g.color} fill="none" strokeWidth="2.5" strokeLinejoin="round" />}
        {g.data.length === 1 && <circle cx={55 + gi * 280} cy={175 - g.data[0] / max * 145} r="3" fill={g.color} />}
      </g>)}
    </svg>}
    <p className="nt-fine">Each section is a separate sequence of samples, not a continuous time axis.</p>
  </div>;
}

type SavedSummary = { date: string; endpoint: string; connection: string; status: string; download: number | null; upload: number | null; idle: number | null };
const historyKey = "nettruth-summaries-v1";
function readHistory(): SavedSummary[] {
  const value: unknown = JSON.parse(localStorage.getItem(historyKey) || "[]");
  return Array.isArray(value) ? value.filter(x => x && typeof x.date === "string" && Number.isFinite(Date.parse(x.date)) && typeof x.endpoint === "string" && typeof x.connection === "string" && [x.download, x.upload, x.idle].every(n => n === null || (typeof n === "number" && Number.isFinite(n) && n >= 0))).slice(0, 5) : [];
}

export function QuickCheck({ config }: { config: FleetConfig }) {
  const [mode, setMode] = useState<TestMode>("quick");
  const [serverPreference, setServerPreference] = useState("auto");
  const [connection, setConnection] = useState<CheckReport["connection"]>("Unknown");
  const [report, setReport] = useState<CheckReport | null>(null);
  const [phase, setPhase] = useState<TestPhase>("connecting");
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const [tab, setTab] = useState<"findings" | "security" | "method">("findings");
  const [notice, setNotice] = useState("");
  const [local, setLocal] = useState<LocalReport | null>(null);
  const [saved, setSaved] = useState<SavedSummary[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const reportRef = useRef<CheckReport | null>(null);
  const importRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  async function start() {
    if (abortRef.current) return;
    setNotice(""); setRunning(true); setProgress(0); setPhase("selecting");
    const controller = new AbortController(); abortRef.current = controller;
    setReport(null); reportRef.current = null;
    let interruption = "";
    const stopForVisibility = () => { if (document.hidden) { interruption = "The tab moved to the background. The test stopped to avoid distorted results."; controller.abort(); } };
    const stopOffline = () => { interruption = "The browser went offline. Completed samples are still available."; controller.abort(); };
    document.addEventListener("visibilitychange", stopForVisibility);
    window.addEventListener("offline", stopOffline);
    const deadline = setTimeout(() => { interruption = "The test reached its time limit. Try again on a quiet connection."; controller.abort(); }, mode === "quick" ? 90000 : 180000);
    try {
      track("NetTruth Test Started", { mode, endpoint: "owned" });
      const chosen = await selectMeasurementNode(config.nodes, serverPreference, controller.signal);
      controller.signal.throwIfAborted();
      const endpoint = { nodeOrigin: chosen.node.origin, nodeName: chosen.node.name };
      const initial = initialReport(mode, endpoint, connection);
      initial.selection = chosen.selection;
      initial.caveats.push(chosen.selection.mode === "auto"
        ? "Auto selection compares HTTP health response times, not physical distance or maximum throughput. All metrics in this run use the selected endpoint."
        : "The server was selected manually. All metrics in this run use that endpoint.");
      setReport(initial); reportRef.current = initial;
      const result = await runMeasurement(initial, endpoint, controller.signal, state => { setReport(state.report); reportRef.current = state.report; setPhase(state.phase); setProgress(state.progress); });
      if (interruption) result.caveats.push(interruption);
      setReport(result); reportRef.current = result;
      setNotice(interruption || (result.status === "cancelled" ? "Test stopped. The report keeps completed measurements." : ""));
      track("NetTruth Test Finished", { mode, status: result.status, packetLoss: result.loss.status });
    } catch (error) {
      setNotice(interruption || (controller.signal.aborted ? "Test stopped." : error instanceof Error ? error.message : "The test could not finish. Please retry."));
      if (reportRef.current) setReport({ ...reportRef.current, status: controller.signal.aborted ? "cancelled" : "error" });
    } finally {
      clearTimeout(deadline); document.removeEventListener("visibilitychange", stopForVisibility); window.removeEventListener("offline", stopOffline); abortRef.current = null; setRunning(false);
    }
  }

  async function importLocal(file?: File) {
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error("Choose a report smaller than 1 MB.");
      setLocal(parseLocalReport(JSON.parse(await file.text()))); setNotice("Windows report loaded on this device. No upload was made."); setTab("security");
    } catch (e) { setNotice(e instanceof Error ? e.message : "That report could not be read."); }
    if (importRef.current) importRef.current.value = "";
  }

  function saveSummary() {
    if (!report) return;
    const m = metrics(report);
    try {
      const history = [{ date: report.startedAt, endpoint: report.endpoint.origin, connection: report.connection, status: report.status, download: m.download, upload: m.upload, idle: m.idle }, ...readHistory().filter(s => s.date !== report.startedAt)].slice(0, 5);
      localStorage.setItem(historyKey, JSON.stringify(history)); setSaved(history); setNotice("Saved a summary on this device. Export JSON to keep the full evidence.");
    } catch { setNotice("Browser storage is unavailable. Export JSON to save your results instead."); }
  }

  const m = report ? metrics(report) : null;
  const results = report ? findings(report) : [];
  const relevant = results.filter(f => f.tone === "warn");
  const completed = report && !running;
  const measuredCount = m ? [m.download, m.upload, m.idle, m.jitter, m.increase, report?.loss.percent].filter(n => n !== null && n !== undefined).length : 0;
  const emailBody = `I would like to discuss a Network Diagnostic.\n\nProblem / business impact:\n\n${report ? `Test ID: ${report.id}\nEndpoint: ${report.endpoint.name}\nConnection (self-reported): ${report.connection}\nStatus: ${report.status}\nDownload: ${format(m!.download)} Mbps\nUpload: ${format(m!.upload)} Mbps\nIdle latency: ${format(m!.idle)} ms\nPacket loss: ${report.loss.status === "measured" ? format(report.loss.percent, 2) + "%" : "not measured"}\n\nI can attach the exported NetTruth report.\n` : ""}`;

  return <div id="network-check" className="nt-shell">
    <div className="nt-topline"><Link href="/systems">Systems / NetTruth</Link><span className="nt-release">QUICKCHECK · BETA</span></div>
    <div className="nt-title-row"><div><h1>Know your connection.</h1><p>Speed is one number. Get the evidence behind it.</p></div><a href="#diagnostic" className="nt-text-link">Business connection issues? ↗</a></div>
    <section className="nt-console" aria-label="Network test controls and measurements">
      <div className="nt-control-row">
        <div><p className="nt-kicker">NETTRUTH NETWORK CHECK</p><h2>{running ? phaseLabel[phase] : completed ? report.status === "complete" ? "Your connection, measured." : "Partial results are available." : "Run a live connection test."}</h2><p className="nt-muted">{report?.endpoint.name || (serverPreference === "auto" ? "Auto · Select a responsive server when you start" : config.nodes.find(node => node.id === serverPreference)?.name)} <span className="nt-separator">/</span> Operator-owned endpoints</p></div>
        <button className={`nt-run ${running ? "nt-stop" : ""}`} onClick={running ? () => abortRef.current?.abort() : start}>{running ? "Stop test" : report ? "Run again" : "Run free test"}<ActionIcon stop={running} /></button>
      </div>
      <div className="nt-options">
        <fieldset disabled={running}><legend>Test length</legend><label><input type="radio" name="mode" value="quick" checked={mode === "quick"} onChange={() => setMode("quick")} /> Quick</label><label><input type="radio" name="mode" value="extended" checked={mode === "extended"} onChange={() => setMode("extended")} /> Extended</label></fieldset>
        <label className="nt-connection">Connection <select value={connection} disabled={running} onChange={e => setConnection(e.target.value as CheckReport["connection"])}><option>Unknown</option><option>Ethernet</option><option>Wi-Fi</option><option>Cellular</option></select></label>
        <label className="nt-connection">Test server <select value={serverPreference} disabled={running} onChange={e => setServerPreference(e.target.value)}><option value="auto">Auto · Lowest response time</option>{config.nodes.map(node => <option key={node.id} value={node.id}>{node.name}</option>)}</select></label>
        <p className="nt-fine">{mode === "quick" ? "Up to ~100 MB planned payload · 90 s limit" : "Up to ~300 MB planned payload · 180 s limit"}<br />Retries may use additional data. Keep this tab visible.</p>
      </div>
      <div className="nt-server-detail"><p>{config.nodes.length === 1 ? `Test location: ${config.nodes[0].name}.` : `Auto compares ${config.nodes.length} locations before each run. No GPS needed.`}</p>{report?.selection && <details><summary>Server selection for this run · {report.selection.mode === "auto" ? "Automatic" : "Manual"}</summary><ul>{report.selection.probes.map(probe => <li key={probe.nodeId}>{config.nodes.find(node => node.id === probe.nodeId)?.name || probe.nodeId}: {probe.status === "available" ? `${format(probe.medianRttMs)} ms selection probe median` : "Unavailable"}{probe.nodeId === report.selection?.selectedNodeId ? " · Selected" : ""}</li>)}</ul><p>Selection probes include HTTP and browser overhead. They are separate from the measured idle latency below.</p></details>}</div>
      <div className="nt-progress" role="progressbar" aria-label="Test phase progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span style={{ width: `${progress}%` }} /></div>
      <div className="nt-stages">{stages.map(s => <span key={s.id} className={running && phase === s.id ? "nt-stage-active" : ""}>{s.label}</span>)}</div>
      <div className="nt-speeds">{[{ label: "Download", value: m?.download ?? null, icon: "↓", detail: "Receiving data" }, { label: "Upload", value: m?.upload ?? null, icon: "↑", detail: "Sending data" }].map(s => <div key={s.label}><div className="nt-metric-label"><span aria-hidden="true">{s.icon}</span>{s.label}</div><p className="nt-speed-value">{format(s.value)}<span>Mbps</span></p><p className="nt-fine">{s.detail} · 90th percentile</p></div>)}</div>
      <div className="nt-metrics">{[{ label: "Idle latency", value: m?.idle ?? null, unit: "ms", detail: "Median response time" }, { label: "Jitter", value: m?.jitter ?? null, unit: "ms", detail: "Consecutive RTT variation" }, { label: "Added delay under load", value: m?.increase ?? null, unit: "ms", detail: m?.increase === null || !m ? "Needs loaded samples" : "Higher loaded median − idle" }, { label: "Packet loss", value: report?.loss.percent ?? null, unit: "%", detail: report?.loss.status === "measured" ? `${report.loss.lost} / ${report.loss.sent} messages lost` : "Not measured" }].map(s => <div key={s.label}><h3>{s.label}</h3><p>{format(s.value, s.unit === "%" ? 2 : 1)}<span>{s.unit}</span></p><span className="nt-fine">{s.detail}</span></div>)}</div>
      <div className="nt-console-foot"><span>{report ? `${measuredCount}/6 metrics available · ${Math.round(report.elapsedMs / 1000)} seconds` : "No measurements yet"}</span><span>{report ? `Run ${report.id.slice(0, 8)}` : "No account required"}</span></div>
    </section>
    <p className="nt-privacy">Auto sends small health probes to configured test nodes; manual selection probes only your chosen node. Each contacted node sees your public IP. The speed, latency and loss test then uses {report?.endpoint.name || "one selected node"}. Results stay in this page unless you save, export, or send them. Site analytics records page activity and test status, not raw measurements.</p>
    <div role="status" aria-live="polite" className="nt-notice">{notice || (running ? phaseLabel[phase] : "")}</div>
    {report?.errors.length ? <div className="nt-error" role="alert"><strong>Some measurements could not complete.</strong><p>{report.errors.join(" ")}</p><p>Unavailable results are not counted as successful tests.</p></div> : null}
    <div className="nt-analysis-grid"><LatencyChart report={report} /><aside className="nt-summary"><p className="nt-kicker">READING THE RESULT</p><h2>{!report ? "Evidence before conclusions." : running ? "Collecting evidence…" : report.status !== "complete" ? "Partial results. Review the gaps." : relevant.length ? relevant[0].title : "Review the measured coverage."}</h2><p>{!report ? "We look at responsiveness, consistency, and behavior under load. A missing measurement stays unknown." : `${measuredCount} of 6 performance metrics are available. ${relevant.length ? `${relevant.length} finding${relevant.length === 1 ? "" : "s"} to investigate. ` : ""}${report.loss.status !== "measured" ? "Packet loss remains unknown." : "Packet loss covers the tested UDP relay path."}`}</p><dl><div><dt>Idle p95</dt><dd>{format(m?.p95 ?? null)} ms</dd></div><div><dt>Download loaded</dt><dd>{format(m?.down ?? null)} ms</dd></div><div><dt>Upload loaded</dt><dd>{format(m?.up ?? null)} ms</dd></div></dl></aside></div>
    <section className="nt-details">
      <div className="nt-tabs" role="tablist" aria-label="Diagnostic detail">{([{ id: "findings", label: "Findings & next steps" }, { id: "security", label: "Security posture" }, { id: "method", label: "Methodology" }] as const).map(t => <button type="button" key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} tabIndex={tab === t.id ? 0 : -1} onClick={() => setTab(t.id)} onKeyDown={event => { const ids = ["findings", "security", "method"] as const; const index = ids.indexOf(tab); const next = event.key === "ArrowRight" ? ids[(index + 1) % 3] : event.key === "ArrowLeft" ? ids[(index + 2) % 3] : event.key === "Home" ? ids[0] : event.key === "End" ? ids[2] : null; if (next) { event.preventDefault(); setTab(next); document.getElementById(`tab-${next}`)?.focus(); } }}>{t.label}</button>)}</div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} tabIndex={0} className="nt-tab-panel">
        {tab === "findings" && <>{!completed ? <div className="nt-empty"><h2>{running ? "Your findings are taking shape." : "Start with one clean measurement."}</h2><p>Pause large downloads and backups. For the clearest baseline, connect by Ethernet and run the test when nobody else is using the connection.</p></div> : <><div className="nt-findings">{results.map(f => <article key={f.id} className={`nt-finding nt-${f.tone}`}><span className="nt-finding-tag">{f.tone === "warn" ? "Investigate" : f.tone === "good" ? "Observed" : "Coverage"}</span><div><h3>{f.title}</h3><p>{f.evidence}</p><p className="nt-action">{f.action}</p></div></article>)}</div><div className="nt-usecases">{evaluateUseCases(report).map(c => <div key={c.name}><h3>{c.name}</h3><p>{c.verdict}</p><span className="nt-fine">{c.detail}</span></div>)}</div><p className="nt-fine">Guidance is a NetTruth heuristic for this endpoint, not a service guarantee. Missing coverage prevents a positive verdict.</p></>}</>}
        {tab === "security" && <><div className="nt-section-head"><div><p className="nt-kicker">OPTIONAL WINDOWS CHECK</p><h2>Check what the browser cannot see.</h2></div><span className="nt-chip">Runs locally</span></div><p className="nt-body">The browser cannot inspect your router firmware, firewall rules, open ports, or every device on your LAN. The optional Windows collector checks this computer’s firewall profiles, Defender status, SMBv1, RDP authentication, and adapter error counters.</p><div className="nt-security-actions"><a className="nt-button" href="/downloads/NetTruth-Posture.ps1" download>Download Windows collector ↓</a><button className="nt-button nt-secondary" onClick={() => importRef.current?.click()}>Open local JSON report</button><input ref={importRef} type="file" accept=".json,application/json" className="sr-only" aria-label="Open Windows posture report" onChange={e => void importLocal(e.target.files?.[0])} /></div><details className="nt-instructions"><summary>How to run the Windows check</summary><ol><li>Download and review the PowerShell script on a computer you own or administer.</li><li>Open PowerShell in the download folder. Run <code>.\NetTruth-Posture.ps1</code>. Administrator access is optional; unavailable checks are marked unknown. The collector is unsigned; follow your organization’s script policy.</li><li>Open the JSON file it creates using the button above. It stays in your browser and is not uploaded.</li></ol><p>The script reads configuration and writes one report. It does not change settings, scan other hosts, or send network requests. This is a posture snapshot, not a CVE scan or security certification.</p></details>{local ? <><div className="nt-local-heading"><p>Imported snapshot · {new Date(local.collectedAt).toLocaleString()}</p><button onClick={() => setLocal(null)}>Remove report</button></div><p className="nt-fine">Self-reported local evidence, not independently verified. A passed check applies only to that setting at collection time.</p><div className="nt-findings">{local.checks.map(c => <article className={`nt-finding nt-${c.status === "warn" ? "warn" : c.status === "pass" ? "good" : "info"}`} key={c.id}><span className="nt-finding-tag">{c.status === "pass" ? "Observed" : c.status === "warn" ? "Review" : "Unknown"}</span><div><h3>{c.title}</h3><p>{c.evidence}</p><p className="nt-action">{c.action}</p></div></article>)}</div></> : <div className="nt-coverage-grid"><div><strong>Browser performance</strong><span>{report ? `${measuredCount}/6 metrics available` : "Ready to test"}</span></div><div><strong>Computer security posture</strong><span>Requires a local report</span></div><div><strong>Router & LAN vulnerabilities</strong><span>Requires an authorized diagnostic</span></div></div>}</>}
        {tab === "method" && <Methodology />}
      </div>
    </section>
    {completed && <section className="nt-export"><div><h2>Keep the evidence.</h2><p>Export this run before changing your router, service, or equipment.</p></div><div className="nt-export-actions"><button className="nt-button nt-secondary" onClick={() => { exportJson({ ...report, interpretation: findings(report), ...(local ? { localPosture: local } : {}) }, `NetTruth-${report.id.slice(0, 8)}.json`); track("NetTruth Report Exported", { format: "json" }); }}>Export JSON ↓</button><button className="nt-button nt-secondary" onClick={() => window.print()}>Print / Save PDF</button><button className="nt-button nt-secondary" onClick={saveSummary}>Save on this device</button></div></section>}
    <div className="nt-history"><button onClick={() => { try { const h = readHistory(); setSaved(h); if (!h.length) setNotice("No saved summaries on this device yet."); } catch { setNotice("Browser storage is unavailable."); } }}>View saved summaries on this device</button>{saved.length > 0 && <><div className="nt-table-scroll"><table><caption>Up to five saved runs. Compare the same endpoint, connection, and device.</caption><thead><tr><th>Date / endpoint</th><th>Connection</th><th>Down Mbps</th><th>Up Mbps</th><th>Idle ms</th></tr></thead><tbody>{saved.map((s, i) => <tr key={i}><td>{new Date(s.date).toLocaleString()}<br />{s.endpoint}<br />{s.status}</td><td>{s.connection}</td><td>{format(s.download)}</td><td>{format(s.upload)}</td><td>{format(s.idle)}</td></tr>)}</tbody></table></div><button onClick={() => { try { localStorage.removeItem(historyKey); setSaved([]); } catch { setNotice("Browser storage could not be cleared."); } }}>Clear saved summaries</button></>}</div>
    <section id="diagnostic" className="nt-diagnostic"><div><p className="nt-kicker">ELEVATE360 · NETWORK DIAGNOSTIC</p><h2>Turn a recurring problem into a clear next step.</h2><p>For businesses dealing with dropped calls, unreliable connections, or unexplained slowdowns. Review the evidence, agree the scope, and investigate the network.</p><span className="nt-price">Starts at $750 <span>· Scope confirmed before work begins</span></span></div><div><a className="nt-button" href={`mailto:contact@elevate360systems.com?subject=${encodeURIComponent("NetTruth Network Diagnostic Inquiry")}&body=${encodeURIComponent(emailBody)}`} onClick={() => track("NetTruth Diagnostic Inquiry", { hasReport: Boolean(report) })}>Discuss a diagnostic<ActionIcon /></a><Link href="/#contact" className="nt-text-link" onClick={() => track("NetTruth Contact Form Clicked")}>Use the contact form</Link><p className="nt-fine">No automatic payment. You choose whether to send your results.</p></div></section>
    {report && <section className="nt-print-only"><h2>Measurement record</h2><p>{report.id} · {report.startedAt} · {report.endpoint.name} · {report.connection} (self-reported) · Status: {report.status}</p>{findings(report).map(f => <div key={f.id}><h3>{f.title}</h3><p>{f.evidence} {f.action}</p></div>)}{local?.checks.map(c => <div key={c.id}><h3>{c.title} ({c.status})</h3><p>{c.evidence} {c.action}</p></div>)}{report.caveats.map(c => <p key={c}>{c}</p>)}</section>}
  </div>;
}
