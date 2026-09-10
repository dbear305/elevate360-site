import deployedNodes from "./nodes.json";
import type { FleetConfig } from "./model";

// Public node inventory shared by the page and its CSP. Add only deployed nodes.
// Secrets remain on each measurement server, never in this registry or build.
export function getMeasurementConfig(environment: Record<string, string | undefined> = process.env): FleetConfig {
  let value: unknown = deployedNodes;
  if (environment.NETTRUTH_NODES && environment.NETTRUTH_NODE_ORIGIN) {
    throw new Error("Configure NETTRUTH_NODES or NETTRUTH_NODE_ORIGIN, not both.");
  }
  if (environment.NETTRUTH_NODES) value = JSON.parse(environment.NETTRUTH_NODES);
  else if (environment.NETTRUTH_NODE_ORIGIN) value = [{
    id: "custom", origin: environment.NETTRUTH_NODE_ORIGIN,
    name: environment.NETTRUTH_NODE_NAME || "NetTruth measurement node",
  }];
  if (!Array.isArray(value) || !value.length || value.length > 8) throw new Error("Configure one to eight measurement nodes.");
  const ids = new Set<string>();
  const origins = new Set<string>();
  const nodes = value.map(entry => {
    if (!entry || typeof entry !== "object" || typeof entry.id !== "string" || !/^[a-z0-9-]{1,48}$/.test(entry.id) || entry.id === "auto" || ids.has(entry.id)) throw new Error("Each node needs a unique id (auto is reserved).");
    if (typeof entry.name !== "string" || !entry.name.trim() || entry.name.length > 100) throw new Error("Each node needs a name of up to 100 characters.");
    if (typeof entry.origin !== "string") throw new Error("Each node needs an HTTPS origin.");
    const url = new URL(entry.origin);
    if (url.protocol !== "https:" || url.origin !== entry.origin || url.username || url.password || origins.has(url.origin)) throw new Error("Each node needs a unique bare HTTPS origin.");
    ids.add(entry.id); origins.add(url.origin);
    return { id: entry.id, name: entry.name.trim(), origin: url.origin };
  });
  return { nodes };
}
