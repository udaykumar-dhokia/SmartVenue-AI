"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, Zap, ChevronDown, ChevronUp, Gauge, CloudRain, AlertTriangle, Timer, Users } from "lucide-react";
import { VENUE_ZONES, type VenueZone } from "@/lib/venue-data";

interface SimulationControlsProps {
  isSimulating: boolean;
  simSpeed: number;
  onToggleSimulation: () => void;
  onSetSpeed: (speed: number) => void;
  onSetGlobalDensity: (multiplier: number) => void;
  onOverrideZone: (zoneId: string, density: number) => void;
  onTriggerEvent: (event: string) => void;
  onReset: () => void;
}

export function SimulationControls({ isSimulating, simSpeed, onToggleSimulation, onSetSpeed, onSetGlobalDensity, onOverrideZone, onTriggerEvent, onReset }: SimulationControlsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState(VENUE_ZONES[0].id);
  const [zoneDensity, setZoneDensity] = useState(50);
  const [globalDensity, setGlobalDensity] = useState(50);

  const events = [
    { id: "halftime", label: "Halftime Surge", icon: Timer, color: "bg-amber-600 hover:bg-amber-500" },
    { id: "evacuation", label: "Evacuation", icon: AlertTriangle, color: "bg-rose-600 hover:bg-rose-500" },
    { id: "postmatch", label: "Post-Match Exodus", icon: Users, color: "bg-violet-600 hover:bg-violet-500" },
    { id: "rain", label: "Rain Delay", icon: CloudRain, color: "bg-sky-600 hover:bg-sky-500" },
  ];

  return (
    <div className="border-b border-zinc-800/40">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between px-6 py-2 hover:bg-zinc-900/40 transition-colors">
        <div className="flex items-center gap-2">
          <Gauge size={14} className="text-indigo-400" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Simulation Controls</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-[10px] font-semibold ${isSimulating ? "text-emerald-400" : "text-zinc-600"}`}>
            <div className={`h-1.5 w-1.5 rounded-full ${isSimulating ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
            {isSimulating ? `Running ${simSpeed}x` : "Paused"}
          </div>
          {isOpen ? <ChevronUp size={14} className="text-zinc-500" /> : <ChevronDown size={14} className="text-zinc-500" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="px-6 pb-4 space-y-4">
              <div className="flex items-center gap-3">
                <button onClick={onToggleSimulation} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors ${isSimulating ? "bg-amber-600 hover:bg-amber-500" : "bg-emerald-600 hover:bg-emerald-500"}`}>
                  {isSimulating ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Resume</>}
                </button>
                <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold text-zinc-300 transition-colors">
                  <RotateCcw size={12} /> Reset
                </button>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-zinc-500 font-medium">Speed</span>
                  <span className="text-[10px] text-indigo-400 font-bold tabular-nums">{simSpeed}x</span>
                </div>
                <div className="flex gap-1.5">
                  {[0.5, 1, 2, 4].map((s) => (
                    <button key={s} onClick={() => onSetSpeed(s)} className={`flex-1 py-1 rounded text-[10px] font-bold transition-colors ${simSpeed === s ? "bg-indigo-600 text-white" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"}`}>{s}x</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-zinc-500 font-medium">Global Crowd Level</span>
                  <span className="text-[10px] text-zinc-400 font-bold tabular-nums">{globalDensity}%</span>
                </div>
                <input type="range" min="0" max="100" value={globalDensity} onChange={(e) => { const v = Number(e.target.value); setGlobalDensity(v); onSetGlobalDensity(v / 100); }} className="w-full h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-medium block mb-1.5">Zone Override</span>
                <div className="flex gap-2">
                  <select value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)} className="flex-1 bg-zinc-800 border border-zinc-700/40 rounded-lg px-2 py-1.5 text-[10px] text-white focus:outline-none appearance-none">
                    {VENUE_ZONES.map((z) => <option key={z.id} value={z.id}>{z.name}</option>)}
                  </select>
                  <input type="range" min="0" max="100" value={zoneDensity} onChange={(e) => setZoneDensity(Number(e.target.value))} className="w-20 h-1 mt-2 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500" />
                  <button onClick={() => onOverrideZone(selectedZone, zoneDensity / 100)} className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-[10px] font-bold text-white transition-colors shrink-0">Set</button>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-zinc-500 font-medium block mb-1.5">Trigger Event</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {events.map((ev) => (
                    <button key={ev.id} onClick={() => onTriggerEvent(ev.id)} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold text-white transition-colors ${ev.color}`}>
                      <ev.icon size={11} /> {ev.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
