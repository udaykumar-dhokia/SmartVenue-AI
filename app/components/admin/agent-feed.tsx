"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Brain, Users, Utensils, Shield, MapPin, Sparkles } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { callAgent } from "@/lib/genai";

const AGENT_ICONS: Record<string, { icon: typeof Users; color: string }> = {
  "Crowd Agent": { icon: Users, color: "text-blue-400" },
  "Concession Agent": { icon: Utensils, color: "text-amber-400" },
  "Safety Agent": { icon: Shield, color: "text-rose-400" },
  "Routing Agent": { icon: MapPin, color: "text-emerald-400" },
  "Personalization Agent": { icon: Sparkles, color: "text-violet-400" },
};

interface FeedMessage {
  id: number;
  agentName: string;
  text: string;
  time: string;
  isAI: boolean;
}

function parseAgentName(text: string): { name: string; body: string } {
  const match = text.match(/^(Crowd Agent|Concession Agent|Safety Agent|Routing Agent|Personalization Agent):\s*([\s\S]*)/);
  if (match) return { name: match[1], body: match[2] };
  return { name: "Crowd Agent", body: text };
}

export function AgentFeed() {
  const [messages, setMessages] = useState<FeedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchThought = useCallback(async () => {
    setIsLoading(true);
    const raw = await callAgent("thought", { context: `Match: GT vs RCB. Current score: GT 156/4 (16.3 ov). Peak zones: Stand J (80%), Stand A (90%). Time: ${new Date().toLocaleTimeString()}.` });
    const { name, body } = parseAgentName(raw);
    const msg: FeedMessage = {
      id: Date.now(),
      agentName: name,
      text: body,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      isAI: true,
    };
    setMessages((prev) => [msg, ...prev.slice(0, 8)]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchThought();
    const interval = setInterval(fetchThought, 12000);
    return () => clearInterval(interval);
  }, [fetchThought]);

  return (
    <div className="flex flex-col gap-2.5">
      {isLoading && messages.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-zinc-500 p-3">
          <Brain size={14} className="animate-pulse" />
          <span>Agent orchestration initializing...</span>
        </div>
      )}
      <AnimatePresence initial={false}>
        {messages.map((msg) => {
          const agentConfig = AGENT_ICONS[msg.agentName] || AGENT_ICONS["Crowd Agent"];
          const Icon = agentConfig.icon;
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -16, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, height: 0 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-3.5 backdrop-blur-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg bg-zinc-800/80 p-1.5 ${agentConfig.color}`}>
                  <Icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${agentConfig.color}`}>{msg.agentName}</span>
                    <span className="text-[10px] text-zinc-600 shrink-0">{msg.time}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">{msg.text}</p>
                </div>
              </div>
              {msg.isAI && (
                <div className="absolute top-2 right-2">
                  <Sparkles size={8} className="text-violet-500/40" />
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
