"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, TrendingUp } from "lucide-react";
import type { Review } from "@/lib/review-data";

interface ReviewsPanelProps {
  reviews: Review[];
}

export function ReviewsPanel({ reviews }: ReviewsPanelProps) {
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const sentimentCounts = { positive: reviews.filter((r) => r.rating >= 4).length, neutral: reviews.filter((r) => r.rating === 3).length, negative: reviews.filter((r) => r.rating <= 2).length };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Live Reviews</h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400">{reviews.length}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/40 p-2 text-center">
          <div className="flex items-center justify-center gap-1">
            <Star size={10} fill="#eab308" className="text-yellow-500" />
            <span className="text-sm font-bold text-white tabular-nums">{avgRating.toFixed(1)}</span>
          </div>
          <p className="text-[8px] text-zinc-500 mt-0.5">Avg Rating</p>
        </div>
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/40 p-2 text-center">
          <span className="text-sm font-bold text-emerald-400">{sentimentCounts.positive}</span>
          <p className="text-[8px] text-zinc-500 mt-0.5">Positive</p>
        </div>
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/40 p-2 text-center">
          <span className="text-sm font-bold text-rose-400">{sentimentCounts.negative}</span>
          <p className="text-[8px] text-zinc-500 mt-0.5">Negative</p>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {reviews.slice(0, 6).map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl border border-zinc-800/40 bg-zinc-900/30 p-3"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">{review.author.charAt(0)}</span>
                </div>
                <span className="text-[10px] font-semibold text-zinc-300">{review.author}</span>
              </div>
              <span className="text-[9px] text-zinc-600">{review.timestamp}</span>
            </div>
            <div className="flex items-center gap-0.5 mb-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={10} fill={s <= review.rating ? "#eab308" : "transparent"} className={s <= review.rating ? "text-yellow-500" : "text-zinc-700"} strokeWidth={1.5} />
              ))}
            </div>
            <p className="text-[10px] text-zinc-400 leading-relaxed">{review.text}</p>
            <div className="mt-1.5">
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">{review.zone}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {reviews.length === 0 && (
        <div className="text-center py-4">
          <MessageSquare size={16} className="mx-auto mb-1 text-zinc-700" />
          <p className="text-[10px] text-zinc-600">No reviews yet</p>
        </div>
      )}
    </div>
  );
}
