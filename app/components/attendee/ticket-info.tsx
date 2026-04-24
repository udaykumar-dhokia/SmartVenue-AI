"use client";

import { motion } from "framer-motion";
import { QrCode, MapPin, Calendar, Clock, Ticket } from "lucide-react";
import { ATTENDEE_PROFILE, MATCH_INFO } from "@/lib/venue-data";

export function TicketInfo() {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-4 space-y-4">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ticket size={16} className="text-white/80" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">IPL 2026</span>
            </div>
            <span className="text-[10px] font-mono text-white/50">{ATTENDEE_PROFILE.ticketId.slice(-8)}</span>
          </div>
          <div className="flex items-center justify-between mb-5">
            <div className="text-center">
              <p className="text-2xl font-black text-white">{MATCH_INFO.team1Short}</p>
              <p className="text-[10px] text-white/60">{MATCH_INFO.team1}</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white/40">VS</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-white">{MATCH_INFO.team2Short}</p>
              <p className="text-[10px] text-white/60">{MATCH_INFO.team2}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
            <div>
              <p className="text-[9px] uppercase text-white/40 tracking-wider">Section</p>
              <p className="text-lg font-bold text-white">{ATTENDEE_PROFILE.seat.section}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase text-white/40 tracking-wider">Row</p>
              <p className="text-lg font-bold text-white">{ATTENDEE_PROFILE.seat.row}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase text-white/40 tracking-wider">Seat</p>
              <p className="text-lg font-bold text-white">{ATTENDEE_PROFILE.seat.number}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-4 flex items-center justify-center">
        <div className="text-center">
          <QrCode size={80} className="text-zinc-600 mx-auto mb-2" strokeWidth={1} />
          <p className="text-[10px] text-zinc-500">Scan at gate for entry</p>
        </div>
      </div>

      <div className="space-y-2.5">
        {[
          { icon: MapPin, label: "Venue", value: "Narendra Modi Stadium" },
          { icon: Calendar, label: "Date", value: MATCH_INFO.date },
          { icon: Clock, label: "Time", value: MATCH_INFO.time },
          { icon: MapPin, label: "Gate", value: ATTENDEE_PROFILE.gate },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 rounded-lg border border-zinc-800/40 bg-zinc-900/30 px-4 py-3">
            <item.icon size={14} className="text-zinc-500" />
            <div className="flex-1">
              <span className="text-[10px] text-zinc-500">{item.label}</span>
              <p className="text-xs font-medium text-zinc-300">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
