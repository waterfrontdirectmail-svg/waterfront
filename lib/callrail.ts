// CallRail API client
// Docs: https://apidocs.callrail.com/

const CALLRAIL_API_BASE = "https://api.callrail.com/v3";

interface CallRailConfig {
  apiKey: string;
  accountId: string;
}

function getConfig(): CallRailConfig {
  return {
    apiKey: process.env.CALLRAIL_API_KEY!,
    accountId: process.env.CALLRAIL_ACCOUNT_ID!,
  };
}

async function callRailFetch(path: string, options: RequestInit = {}) {
  const config = getConfig();
  const res = await fetch(`${CALLRAIL_API_BASE}/a/${config.accountId}${path}`, {
    ...options,
    headers: {
      Authorization: `Token token=${config.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(`CallRail API error: ${res.status}`);
  return res.json();
}

export async function provisionTracker(campaignName: string, destinationNumber: string) {
  return callRailFetch("/trackers", {
    method: "POST",
    body: JSON.stringify({
      name: campaignName,
      type: "source",
      tracking_number: { area_code: "561" },
      destination_number: destinationNumber,
    }),
  });
}

export async function getCalls(trackerId: string) {
  return callRailFetch(`/calls?tracker_id=${trackerId}`);
}

export async function releaseTracker(trackerId: string) {
  return callRailFetch(`/trackers/${trackerId}`, { method: "DELETE" });
}
