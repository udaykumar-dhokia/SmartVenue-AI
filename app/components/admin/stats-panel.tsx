"use client";

import { motion } from "framer-motion";
import { Clock, ShieldCheck, Zap, Users, TrendingUp, AlertTriangle } from "lucide-react";
import type { VenueZone } from "@/lib/venue-data";

interface StatsPanelProps {
  zones: VenueZone[];
  totalCapacity: number;
  activeAlerts: number;
}

export function StatsPanel({ zones, totalCapacity, activeAlerts }: StatsPanelProps) {
  const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
  const avgWait = zones.reduce((sum, z) => sum + z.avgWaitTime, 0) / zones.length;
  const avgDensity = zones.reduce((sum, z) => sum + z.density, 0) / zones.length;
  const safetyScore = Math.round(100 - avgDensity * 15 - activeAlerts * 3);
  const flowOpt = Math.round((1 - (avgDensity * 0.4 + (avgWait / 20) * 0.3)) * 100);

  const stats = [
    { label: "Attendance", value: totalOccupancy.toLocaleString(), sub: `/ ${totalCapacity.toLocaleString()}`, icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", pct: Math.round((totalOccupancy / totalCapacity) * 100) },
    { label: "Avg Wait Time", value: `${avgWait.toFixed(1)}m`, sub: avgWait < 5 ? "Optimal" : "Elevated", icon: Clock, color: "text-emerald-400", bg: "bg-emerald-500/10", pct: Math.round((1 - avgWait / 20) * 100) },
    { label: "Safety Score", value: `${safetyScore}`, sub: "/100", icon: ShieldCheck, color: "text-sky-400", bg: "bg-sky-500/10", pct: safetyScore },
    { label: "Flow Efficiency", value: `${flowOpt}%`, sub: flowOpt > 80 ? "Healthy" : "Degraded", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", pct: flowOpt },
    { label: "Active Alerts", value: `${activeAlerts}`, sub: activeAlerts === 0 ? "All clear" : "Requires attention", icon: AlertTriangle, color: activeAlerts > 2 ? "text-rose-400" : "text-orange-400", bg: activeAlerts > 2 ? "bg-rose-500/10" : "bg-orange-500/10", pct: Math.max(0, 100 - activeAlerts * 20) },
  ];

  return (
    <div className="grid grid-cols-1 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="group relative overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 hover:border-zinc-700/80 hover:bg-zinc-900/70 transition-all"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`rounded-lg ${s.bg} p-2 ${s.color}`}>
              <s.icon size={16} />
            </div>
            <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">{s.label}</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-bold text-white tabular-nums">{s.value}</span>
            <span className="text-xs text-zinc-500">{s.sub}</span>
          </div>
          <div className="mt-2 h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: s.pct > 70 ? "#22c55e" : s.pct > 40 ? "#eab308" : "#ef4444" }}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
