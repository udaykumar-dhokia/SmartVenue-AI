"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { VENUE_ZONES, CONCESSION_OUTLETS, MATCH_INFO, type VenueZone, type Alert } from "@/lib/venue-data";
import { simulateZoneDensities, simulateConcessions, generateAlert, simulateScore } from "@/lib/simulation";
import { LiveIndicator } from "@/components/shared/live-indicator";
import { StatsPanel } from "./stats-panel";
import { AgentFeed } from "./agent-feed";
import { VenueMap } from "./venue-map";
import { ZoneDetail } from "./zone-detail";
import { AlertsPanel } from "./alerts-panel";
import { ConcessionPanel } from "./concession-panel";

export function AdminDashboard() {
  const [zones, setZones] = useState(VENUE_ZONES);
  const [outlets, setOutlets] = useState(CONCESSION_OUTLETS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedZone, setSelectedZone] = useState<VenueZone | null>(null);
  const [score, setScore] = useState(MATCH_INFO.score.team1);

  useEffect(() => {
    const interval = setInterval(() => {
      setZones((prev) => simulateZoneDensities(prev));
      setOutlets((prev) => simulateConcessions(prev));
      setScore((prev) => simulateScore(prev));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const newAlert = generateAlert(zones);
        return [newAlert, ...prev.slice(0, 9)];
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [zones]);

  const handleZoneSelect = useCallback((zone: VenueZone) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  const handleAcknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);

  const updatedSelectedZone = selectedZone ? zones.find((z) => z.id === selectedZone.id) || null : null;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <header className="flex items-center justify-between border-b border-zinc-800/60 bg-zinc-900/40 px-6 py-3 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="font-bold text-sm text-white">SV</span>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">SmartVenue AI</h1>
            <p className="text-[10px] text-zinc-500">Narendra Modi Stadium, Ahmedabad</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{MATCH_INFO.team1Short} {score.runs}/{score.wickets} <span className="text-zinc-500">({score.overs} ov)</span></p>
            <p className="text-[10px] text-zinc-500">vs {MATCH_INFO.team2Short} | {MATCH_INFO.innings}</p>
          </div>
          <div className="h-6 w-px bg-zinc-800" />
          <LiveIndicator />
          <div className="h-6 w-px bg-zinc-800" />
          <div className="text-right">
            <p className="text-[10px] text-zinc-500">Capacity</p>
            <p className="text-xs font-bold text-white tabular-nums">{zones.reduce((s, z) => s + z.currentOccupancy, 0).toLocaleString()} / {totalCapacity.toLocaleString()}</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-zinc-800/40 bg-zinc-950/80 p-4 flex flex-col gap-5 overflow-y-auto scrollbar-thin">
          <StatsPanel zones={zones} totalCapacity={totalCapacity} activeAlerts={alerts.filter((a) => !a.acknowledged).length} />
          <div className="h-px bg-zinc-800/40" />
          <ConcessionPanel outlets={outlets} />
        </aside>

        <section className="relative flex-1 bg-zinc-950 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.04)_0%,transparent_70%)] pointer-events-none" />
          <VenueMap zones={zones} onZoneSelect={handleZoneSelect} selectedZoneId={selectedZone?.id || null} />

          <div className="absolute bottom-6 left-6 bg-zinc-900/80 border border-zinc-800/60 px-4 py-3 rounded-xl backdrop-blur-xl">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Density Scale</p>
            <div className="flex items-center gap-4">
              {[
                { color: "#10b981", label: "Low" },
                { color: "#22c55e", label: "Med" },
                { color: "#eab308", label: "Mod" },
                { color: "#f97316", label: "High" },
                { color: "#ef4444", label: "Crit" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-[10px] text-zinc-500">{l.label}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {updatedSelectedZone && <ZoneDetail zone={updatedSelectedZone} onClose={() => setSelectedZone(null)} />}
          </AnimatePresence>
        </section>

        <aside className="w-72 border-l border-zinc-800/40 bg-zinc-950/80 p-4 flex flex-col gap-5 overflow-y-auto scrollbar-thin">
          <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
          <div className="h-px bg-zinc-800/40" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Agent Feed</h3>
            <AgentFeed />
          </div>
        </aside>
      </div>
    </div>
  );
}
