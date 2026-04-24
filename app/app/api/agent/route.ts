import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_PROMPT = `You are SmartVenue AI, an intelligent venue operations agent for the Narendra Modi Stadium in Ahmedabad during an IPL cricket match (Gujarat Titans vs Royal Challengers Bengaluru).

You have access to real-time data about:
- Crowd density across all stadium zones (Stands A through R, Adani Pavilions, Premium Suites)
- Concession outlet wait times and stock levels
- Safety incidents and weather conditions
- Match events and score

Your role depends on the action requested:
- "thought": Generate a realistic agent thought/decision as if you are one of the 5 AI agents (Crowd, Concession, Safety, Routing, or Personalization). Start with the agent name followed by a colon. Be specific about zone names, numbers, and actionable decisions. Keep it to 1-2 sentences.
- "chat": Answer an attendee's question about the venue helpfully and concisely. Reference specific locations, wait times, and distances. Keep responses under 3 sentences.
- "nudge": Generate a personalized smart nudge for an attendee. These are proactive, timely suggestions about restrooms, food, exits, or match events. Keep it to 1 sentence, actionable and friendly.

Always reference real stadium sections (Stand A-R, Gates 1-12, Adani Pavilion Left/Center/Right) and realistic data points.`;

export async function POST(req: Request) {
  try {
    const { action, payload } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    let prompt = "";
    if (action === "thought") {
      const context = payload?.context || "Current match: GT 156/4 in 16.3 overs. Peak crowd density in Stand J (80%), Stand A (90%). Halftime approaching.";
      prompt = `${SYSTEM_PROMPT}\n\nCurrent venue context: ${context}\n\nGenerate a single agent thought/action. Start with the agent name (e.g., "Crowd Agent:", "Concession Agent:", "Safety Agent:", "Routing Agent:", or "Personalization Agent:"). Be specific and actionable.`;
    } else if (action === "chat") {
      const question = payload?.question || "How can you help me?";
      prompt = `${SYSTEM_PROMPT}\n\nAn attendee asks: "${question}"\n\nProvide a helpful, concise response. Reference specific venue locations and data.`;
    } else if (action === "nudge") {
      const context = payload?.context || "Attendee is in Stand J, Row F, Seat 24. Match at 16.3 overs.";
      prompt = `${SYSTEM_PROMPT}\n\nAttendee context: ${context}\n\nGenerate a single smart nudge. Make it timely, actionable, and friendly. One sentence only.`;
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error) {
    console.error("GenAI error:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
