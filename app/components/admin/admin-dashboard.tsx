"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { VENUE_ZONES, CONCESSION_OUTLETS, MATCH_INFO, type VenueZone, type Alert } from "@/lib/venue-data";
import { simulateZoneDensities, simulateConcessions, generateAlert } from "@/lib/simulation";
import type { Review } from "@/lib/review-data";
import { LiveIndicator } from "@/components/shared/live-indicator";
import { StatsPanel } from "./stats-panel";
import { AgentFeed } from "./agent-feed";
import { VenueMap } from "./venue-map";
import { ZoneDetail } from "./zone-detail";
import { AlertsPanel } from "./alerts-panel";
import { ConcessionPanel } from "./concession-panel";
import { SimulationControls } from "./simulation-controls";
import { ReviewsPanel } from "./reviews-panel";
import { useMatchData } from "@/lib/use-match-data";

interface AdminDashboardProps {
  reviews: Review[];
}

export function AdminDashboard({ reviews }: AdminDashboardProps) {
  const [zones, setZones] = useState(VENUE_ZONES);
  const [outlets, setOutlets] = useState(CONCESSION_OUTLETS);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedZone, setSelectedZone] = useState<VenueZone | null>(null);

  // Live Match Data
  const { matchData } = useMatchData();

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runSimulationTick = useCallback(() => {
    setZones((prev) => simulateZoneDensities(prev));
    setOutlets((prev) => simulateConcessions(prev));
  }, []);

  useEffect(() => {
    if (isSimulating) {
      intervalRef.current = setInterval(runSimulationTick, 4000 / simSpeed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isSimulating, simSpeed, runSimulationTick]);

  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const newAlert = generateAlert(zones);
        return [newAlert, ...prev.slice(0, 9)];
      });
    }, 15000 / simSpeed);
    return () => clearInterval(interval);
  }, [zones, isSimulating, simSpeed]);

  const handleZoneSelect = useCallback((zone: VenueZone) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  const handleAcknowledgeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
  }, []);

  // Control Handlers
  const handleToggleSimulation = () => setIsSimulating(!isSimulating);
  const handleSetSpeed = (speed: number) => setSimSpeed(speed);
  
  const handleSetGlobalDensity = (multiplier: number) => {
    setIsSimulating(false);
    setZones((prev) => prev.map(z => {
      const density = Math.max(0.05, Math.min(0.98, z.density * (0.5 + multiplier)));
      return { ...z, density, currentOccupancy: Math.round(density * z.capacity) };
    }));
  };

  const handleOverrideZone = (zoneId: string, density: number) => {
    setIsSimulating(false);
    setZones((prev) => prev.map(z => z.id === zoneId ? { ...z, density, currentOccupancy: Math.round(density * z.capacity) } : z));
  };

  const handleTriggerEvent = (event: string) => {
    setIsSimulating(false);
    if (event === "halftime") {
      setZones(prev => prev.map(z => ({ ...z, density: z.tier === "upper" || z.tier === "lower" ? Math.max(0.1, z.density - 0.4) : Math.min(0.95, z.density + 0.5) })));
    } else if (event === "evacuation") {
      setZones(prev => prev.map(z => ({ ...z, density: Math.max(0.05, z.density - 0.6) })));
    } else if (event === "postmatch") {
      setZones(prev => prev.map(z => ({ ...z, density: Math.max(0.1, z.density - 0.3) })));
    } else if (event === "rain") {
      setZones(prev => prev.map(z => ({ ...z, density: z.tier === "pavilion" || z.tier === "suite" ? Math.min(0.95, z.density + 0.4) : Math.max(0.1, z.density - 0.5) })));
    }
  };

  const handleReset = () => {
    setZones(VENUE_ZONES);
    setIsSimulating(true);
    setSimSpeed(1);
  };

  const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);
  const updatedSelectedZone = selectedZone ? zones.find((z) => z.id === selectedZone.id) || null : null;

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <header className="flex flex-col border-b border-zinc-800/60 bg-zinc-900/40 shrink-0">
        <div className="flex items-center justify-between px-6 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-sm text-white">SV</span>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white">SmartVenue AI</h1>
              <p className="text-[10px] text-zinc-500">{matchData.venue}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-right">
              <p className="text-xs font-bold text-white">{matchData.team1Short} {matchData.score.team1.runs}/{matchData.score.team1.wickets} <span className="text-zinc-500">({matchData.score.team1.overs} ov)</span></p>
              <p className="text-[10px] text-zinc-500">vs {matchData.team2Short} | {matchData.innings}</p>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <LiveIndicator />
            <div className="h-6 w-px bg-zinc-800" />
            <div className="text-right">
              <p className="text-[10px] text-zinc-500">Capacity</p>
              <p className="text-xs font-bold text-white tabular-nums">{zones.reduce((s, z) => s + z.currentOccupancy, 0).toLocaleString()} / {totalCapacity.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <SimulationControls
          isSimulating={isSimulating}
          simSpeed={simSpeed}
          onToggleSimulation={handleToggleSimulation}
          onSetSpeed={handleSetSpeed}
          onSetGlobalDensity={handleSetGlobalDensity}
          onOverrideZone={handleOverrideZone}
          onTriggerEvent={handleTriggerEvent}
          onReset={handleReset}
        />
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 border-r border-zinc-800/40 bg-zinc-950/80 p-4 flex flex-col gap-5 overflow-y-auto scrollbar-thin">
          <StatsPanel zones={zones} totalCapacity={totalCapacity} activeAlerts={alerts.filter((a) => !a.acknowledged).length} />
          <div className="h-px bg-zinc-800/40 shrink-0" />
          <ConcessionPanel outlets={outlets} />
          <div className="h-px bg-zinc-800/40 shrink-0" />
          <ReviewsPanel reviews={reviews} />
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
          <div className="h-px bg-zinc-800/40 shrink-0" />
          <div>
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Agent Feed</h3>
            <AgentFeed />
          </div>
        </aside>
      </div>
    </div>
  );
}
