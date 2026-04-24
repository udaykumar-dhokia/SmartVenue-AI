"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Map, Bell, Utensils, Ticket, MessageCircle, Star } from "lucide-react";
import { MATCH_INFO } from "@/lib/venue-data";
import { LiveIndicator } from "@/components/shared/live-indicator";
import { TicketInfo } from "./ticket-info";
import { AttendeeMap } from "./attendee-map";
import { SmartNudges } from "./smart-nudges";
import { PreOrder } from "./pre-order";
import { ChatAssistant } from "./chat-assistant";
import { SubmitReview } from "./submit-review";
import type { Review } from "@/lib/review-data";

import { useMatchData } from "@/lib/use-match-data";

const TABS = [
  { id: "map", label: "Map", icon: Map },
  { id: "nudges", label: "Nudges", icon: Bell },
  { id: "food", label: "Food", icon: Utensils },
  { id: "ticket", label: "Ticket", icon: Ticket },
  { id: "chat", label: "Chat", icon: MessageCircle },
  { id: "review", label: "Review", icon: Star },
] as const;

type TabId = (typeof TABS)[number]["id"];

interface AttendeeWebProps {
  onSubmitReview: (review: Review) => void;
}

export function AttendeeWeb({ onSubmitReview }: AttendeeWebProps) {
  const [activeTab, setActiveTab] = useState<TabId>("map");
  const { matchData } = useMatchData();

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <header className="shrink-0 px-8 py-4 bg-zinc-950 border-b border-zinc-800/40">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LiveIndicator />
              <p className="text-xs text-zinc-500 font-medium">{matchData.venue}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xl font-black text-white">{matchData.team1Short}</span>
              <span className="text-2xl font-black text-indigo-400">{matchData.score.team1.runs}/{matchData.score.team1.wickets}</span>
              <span className="text-xs text-zinc-500">({matchData.score.team1.overs} ov)</span>
              <span className="text-xs text-zinc-600 font-bold ml-2">vs {matchData.team2Short}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-1 bg-zinc-900/50 p-1 rounded-xl border border-zinc-800/40">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-lg transition-colors z-10 ${isActive ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"}`}
                  >
                    <tab.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} />
                    <span className="text-xs font-semibold">{tab.label}</span>
                    {isActive && (
                      <motion.div layoutId="web-tab-indicator" className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-500/20 -z-10" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto h-full flex gap-8">
          <div className="flex-1 min-w-[500px] h-full rounded-3xl border border-zinc-800/40 bg-zinc-900/20 overflow-hidden shadow-2xl relative">
            <div className="absolute top-6 left-6 z-20 w-80">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  {activeTab === "map" && <div className="bg-zinc-950/80 backdrop-blur-xl rounded-2xl p-4 border border-zinc-800/40 shadow-xl"><p className="text-xs font-bold text-white mb-2">Venue Map</p><p className="text-[10px] text-zinc-400">Search for your seat or tap a section to see crowd density and wait times.</p></div>}
                  {activeTab === "nudges" && <div className="bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden max-h-[600px]"><SmartNudges /></div>}
                  {activeTab === "food" && <div className="bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden max-h-[600px] overflow-y-auto"><PreOrder /></div>}
                  {activeTab === "ticket" && <div className="w-80"><TicketInfo /></div>}
                  {activeTab === "chat" && <div className="bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden h-[600px]"><ChatAssistant /></div>}
                  {activeTab === "review" && <div className="bg-zinc-950/90 backdrop-blur-xl rounded-2xl border border-zinc-800/60 shadow-xl overflow-hidden"><SubmitReview onSubmit={onSubmitReview} /></div>}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="w-full h-full flex items-center justify-center p-12">
               <AttendeeMap />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
