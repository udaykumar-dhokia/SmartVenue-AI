import { type VenueZone, type ConcessionOutlet, type Alert, type MatchEvent } from "./venue-data";

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function rf(min: number, max: number) { return min + Math.random() * (max - min); }

export function simulateZoneDensities(zones: VenueZone[]): VenueZone[] {
  return zones.map((z) => {
    const d = clamp(z.density + rf(-0.06, 0.06), 0.05, 0.98);
    return { ...z, density: d, currentOccupancy: Math.round(d * z.capacity), avgWaitTime: Math.round(clamp(z.avgWaitTime + rf(-1, 1), 0.5, 20) * 10) / 10, temperature: Math.round(clamp(z.temperature + rf(-0.3, 0.3), 22, 38) * 10) / 10 };
  });
}

export function simulateConcessions(outlets: ConcessionOutlet[]): ConcessionOutlet[] {
  return outlets.map((o) => {
    const s = Math.floor(rf(1, 8));
    return { ...o, waitTime: Math.round(clamp(o.waitTime + rf(-1.5, 1.5), 1, 20) * 10) / 10, itemsSold: o.itemsSold + s, revenue: o.revenue + s * Math.floor(rf(80, 300)), stockLevel: Math.round(clamp(o.stockLevel + rf(-0.02, 0.01), 0.05, 1) * 100) / 100 };
  });
}

const ALERT_MSGS: Array<{ type: Alert["type"]; severity: Alert["severity"]; msgs: string[] }> = [
  { type: "congestion", severity: "warning", msgs: ["Crowd density approaching threshold in {z}. Recommend opening auxiliary gates.", "Footfall surge at {z}. Pre-positioning staff.", "Exit corridor near {z} slowing. Activating alternate routes."] },
  { type: "safety", severity: "critical", msgs: ["Medical assistance requested near {z}. Dispatching first-aid.", "Unusual crowd movement at {z}. Monitoring closely.", "Temperature alert at {z}. Activating misting systems."] },
  { type: "concession", severity: "info", msgs: ["Stock running low near {z}. Resupply in 8 min.", "Wait time near {z} exceeds 10 min. Redirecting attendees.", "Pre-order surge expected. Alerting kitchen at {z}."] },
  { type: "maintenance", severity: "info", msgs: ["Restroom cleaning at {z} in 5 min.", "Signage malfunction near {z}. Maintenance dispatched.", "Water fountain at {z} non-functional. Repair en route."] },
];

export function generateAlert(zones: VenueZone[]): Alert {
  const t = ALERT_MSGS[Math.floor(Math.random() * ALERT_MSGS.length)];
  const z = zones[Math.floor(Math.random() * zones.length)];
  const m = t.msgs[Math.floor(Math.random() * t.msgs.length)];
  return { id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type: t.type, severity: t.severity, zone: z.name, message: m.replace("{z}", z.name), timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }), acknowledged: false };
}

export function generateMatchEvent(): MatchEvent {
  const evts: Array<{ type: MatchEvent["type"]; d: string[] }> = [
    { type: "boundary", d: ["FOUR! Driven through covers.", "FOUR! Edged past keeper."] },
    { type: "six", d: ["SIX! Massive hit over long-on!", "SIX! Launched into the stands!"] },
    { type: "wicket", d: ["OUT! Caught at mid-off.", "OUT! Bowled through the gate!"] },
    { type: "over", d: ["End of over. 8 runs.", "Maiden over!"] },
    { type: "timeout", d: ["Strategic timeout by GT.", "Strategic timeout by RCB."] },
  ];
  const e = evts[Math.floor(Math.random() * evts.length)];
  return { id: `evt-${Date.now()}`, time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }), type: e.type, description: e.d[Math.floor(Math.random() * e.d.length)] };
}

export function simulateScore(c: { runs: number; wickets: number; overs: string }) {
  const r = [0, 0, 1, 1, 1, 2, 2, 4, 4, 6][Math.floor(Math.random() * 10)];
  const w = Math.random() < 0.03;
  const [wh, dc] = c.overs.split(".").map(Number);
  let nd = (dc || 0) + 1, nw = wh;
  if (nd >= 6) { nd = 0; nw += 1; }
  return { runs: c.runs + r, wickets: w ? Math.min(c.wickets + 1, 10) : c.wickets, overs: `${nw}.${nd}` };
}
