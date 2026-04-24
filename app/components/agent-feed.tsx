"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Users, Utensils, Shield, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const AGENT_TYPES = {
  CROWD: { icon: Users, color: "text-blue-500", label: "Crowd Agent" },
  CONCESSION: { icon: Utensils, color: "text-amber-500", label: "Food & Bev Agent" },
  SAFETY: { icon: Shield, color: "text-rose-500", label: "Safety Agent" },
  ROUTING: { icon: MapPin, color: "text-emerald-500", label: "Routing Agent" },
};

const INITIAL_MESSAGES = [
  {
    id: 1,
    type: "CROWD",
    text: "Bottleneck detected at Sector J-4. Rerouting incoming traffic to Gate K.",
    time: "2m ago",
  },
  {
    id: 2,
    type: "CONCESSION",
    text: "Wait times at Section B exceeding 12m. Applying dynamic 10% discount to Section C outlets.",
    time: "5m ago",
  },
  {
    id: 3,
    type: "SAFETY",
    text: "Anomaly detection: Unusual congregation in North Corridor. Escalating to local staff.",
    time: "8m ago",
  },
];

export function AgentFeed() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const types = Object.keys(AGENT_TYPES);
      const randomType = types[Math.floor(Math.random() * types.length)];
      const newMessage = {
        id: Date.now(),
        type: randomType,
        text: `Automated ${randomType.toLowerCase()} optimization triggered for Zone ${Math.floor(Math.random() * 500)}.`,
        time: "Just now",
      };
      setMessages((prev) => [newMessage, ...prev.slice(0, 5)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const Agent = AGENT_TYPES[msg.type as keyof typeof AGENT_TYPES];
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 rounded-lg bg-zinc-800 p-1.5 ${Agent.color}`}>
                  <Agent.icon size={14} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {Agent.label}
                    </span>
                    <span className="text-[10px] text-zinc-600">{msg.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                    {msg.text}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
