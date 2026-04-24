"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { callAgent } from "@/lib/genai";

interface Message {
  id: number;
  role: "user" | "assistant";
  text: string;
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: "assistant", text: "Hi! I am your SmartVenue AI assistant for today's GT vs RCB match. Ask me about restrooms, food, exits, or anything else about the venue." },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Message = { id: Date.now(), role: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const response = await callAgent("chat", { question: input.trim() });
    const botMsg: Message = { id: Date.now() + 1, role: "assistant", text: response };
    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-zinc-800/40">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <Bot size={14} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold text-white">Venue Assistant</p>
          <p className="text-[9px] text-zinc-500 flex items-center gap-1"><Sparkles size={8} className="text-violet-400" /> Powered by Gemini</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-indigo-600" : "bg-zinc-800"}`}>
                {msg.role === "user" ? <User size={11} className="text-white" /> : <Bot size={11} className="text-zinc-400" />}
              </div>
              <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${msg.role === "user" ? "bg-indigo-600 text-white" : "bg-zinc-800/80 text-zinc-300 border border-zinc-700/40"}`}>
                <p className="text-xs leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex gap-2.5">
            <div className="h-6 w-6 rounded-full bg-zinc-800 flex items-center justify-center"><Bot size={11} className="text-zinc-400" /></div>
            <div className="bg-zinc-800/80 rounded-xl px-4 py-3 border border-zinc-700/40">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-zinc-800/40">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about restrooms, food, exits..."
            className="flex-1 bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
