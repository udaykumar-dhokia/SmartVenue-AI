"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Bell, MapPin, Utensils, Droplets, ThermometerSun, Clock } from "lucide-react";
import { callAgent } from "@/lib/genai";

interface Nudge {
  id: number;
  text: string;
  icon: "route" | "food" | "restroom" | "weather" | "time";
  time: string;
}

const ICON_MAP = {
  route: MapPin,
  food: Utensils,
  restroom: Droplets,
  weather: ThermometerSun,
  time: Clock,
};

function classifyNudge(text: string): Nudge["icon"] {
  const lower = text.toLowerCase();
  if (lower.includes("restroom") || lower.includes("bathroom") || lower.includes("hydrat")) return "restroom";
  if (lower.includes("food") || lower.includes("eat") || lower.includes("biryani") || lower.includes("samosa") || lower.includes("drink") || lower.includes("chaat")) return "food";
  if (lower.includes("temp") || lower.includes("heat") || lower.includes("rain") || lower.includes("weather")) return "weather";
  if (lower.includes("halftime") || lower.includes("over") || lower.includes("innings") || lower.includes("timeout")) return "time";
  return "route";
}

export function SmartNudges() {
  const [nudges, setNudges] = useState<Nudge[]>([]);

  const fetchNudge = useCallback(async () => {
    const text = await callAgent("nudge", { context: `Attendee in Stand J, Row F, Seat 24. Match: GT vs RCB. Score: GT 156/4 (16.3 ov). Current time: ${new Date().toLocaleTimeString()}.` });
    const nudge: Nudge = {
      id: Date.now(),
      text,
      icon: classifyNudge(text),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
    setNudges((prev) => [nudge, ...prev.slice(0, 6)]);
  }, []);

  useEffect(() => {
    fetchNudge();
    const i = setInterval(fetchNudge, 18000);
    return () => clearInterval(i);
  }, [fetchNudge]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Bell size={14} className="text-indigo-400" />
        <span className="text-xs font-semibold text-zinc-300">Smart Nudges</span>
        <span className="text-[9px] text-zinc-600">Powered by AI</span>
      </div>
      <AnimatePresence initial={false}>
        {nudges.map((n) => {
          const Icon = ICON_MAP[n.icon];
          return (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              className="rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-3.5 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-lg bg-indigo-500/10 p-1.5 text-indigo-400">
                  <Icon size={13} />
                </div>
                <div className="flex-1">
                  <p className="text-xs leading-relaxed text-zinc-300">{n.text}</p>
                  <p className="mt-1.5 text-[10px] text-zinc-600">{n.time}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {nudges.length === 0 && (
        <div className="text-center text-xs text-zinc-600 py-8">
          <Bell size={20} className="mx-auto mb-2 text-zinc-700" />
          Loading personalized suggestions...
        </div>
      )}
    </motion.div>
  );
}
