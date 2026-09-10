const defaultOrigin = "https://measure.elevate360systems.com";

// Public routing settings belong in source so Git previews and CLI builds agree.
// Relay secrets remain on the measurement node and never enter this configuration.
export function getMeasurementConfig(environment: Record<string, string | undefined> = process.env) {
  const url = new URL(environment.NETTRUTH_NODE_ORIGIN || defaultOrigin);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) {
    throw new Error("NETTRUTH_NODE_ORIGIN must be a bare HTTPS origin.");
  }
  return {
    nodeOrigin: url.origin,
    nodeName: environment.NETTRUTH_NODE_NAME || (url.origin === defaultOrigin
      ? "Elevate360 - New York (NYC1)"
      : "NetTruth measurement node"),
  };
}
