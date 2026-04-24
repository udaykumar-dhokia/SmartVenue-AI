"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, Package, Wrench, Check, ChevronUp } from "lucide-react";
import type { Alert } from "@/lib/venue-data";

const SEVERITY_STYLES: Record<string, { border: string; icon: typeof AlertTriangle; color: string }> = {
  critical: { border: "border-rose-500/30", icon: ShieldAlert, color: "text-rose-400" },
  warning: { border: "border-amber-500/30", icon: AlertTriangle, color: "text-amber-400" },
  info: { border: "border-sky-500/30", icon: Package, color: "text-sky-400" },
};

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const active = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Active Alerts</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400">{active.length}</span>
      </div>
      <AnimatePresence>
        {active.slice(0, 5).map((alert) => {
          const style = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
          const Icon = style.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-xl border ${style.border} bg-zinc-900/30 p-3`}
            >
              <div className="flex items-start gap-2.5">
                <Icon size={14} className={`mt-0.5 shrink-0 ${style.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-zinc-400">{alert.zone}</span>
                    <span className="text-[10px] text-zinc-600">{alert.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-300 leading-relaxed">{alert.message}</p>
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="mt-2 flex items-center gap-1 text-[10px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <Check size={10} />
                    Acknowledge
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {active.length === 0 && (
        <div className="text-xs text-zinc-600 text-center py-4">All clear. No active alerts.</div>
      )}
    </div>
  );
}
