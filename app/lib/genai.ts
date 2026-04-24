import type { VenueZone } from "./venue-data";

export async function callAgent(action: "thought" | "chat" | "nudge", payload: Record<string, unknown>): Promise<string> {
  try {
    const res = await fetch("/api/agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, payload }),
    });
    if (!res.ok) throw new Error("Agent request failed");
    const data = await res.json();
    return data.text || data.error || "No response from agent.";
  } catch {
    return getFallbackResponse(action, payload);
  }
}

function getFallbackResponse(action: string, payload: Record<string, unknown>): string {
  if (action === "thought") {
    const thoughts = [
      "Crowd Agent: Density spike detected in Stand J Section 3. Recommending gate redistribution to alleviate pressure on east corridor.",
      "Concession Agent: Samosa Junction queue exceeding 14 minutes. Pushing 15% discount notification to nearby Cold Drinks Bar to redistribute foot traffic.",
      "Safety Agent: All zones nominal. Pre-positioning medical staff near Stand A ahead of predicted halftime surge in 12 minutes.",
      "Routing Agent: Optimizing exit routes for Stand P and Q attendees. Gate 7 throughput at 94% capacity, opening Gate 8 auxiliary lane.",
      "Crowd Agent: Stand M showing unusually low occupancy (10%). Investigating potential signage issue directing attendees to wrong entrance.",
      "Concession Agent: Biryani Point stock at 40%. Triggering resupply order. Estimated restock in 15 minutes.",
      "Routing Agent: Wheelchair-accessible route to Stand K updated. Elevator B now operational after brief maintenance.",
      "Safety Agent: Weather API reports temperature drop of 3C in next hour. No action required, monitoring.",
    ];
    return thoughts[Math.floor(Math.random() * thoughts.length)];
  }
  if (action === "chat") {
    const q = (payload.question as string || "").toLowerCase();
    if (q.includes("restroom") || q.includes("bathroom")) return "The nearest restroom to your seat in Stand J is located at the east concourse, about 2 minutes walk. Current wait: approximately 3 minutes. The restroom near Stand K has a shorter queue at 1 minute if you prefer.";
    if (q.includes("food") || q.includes("eat")) return "Based on your location in Stand J, I recommend the Cold Drinks Bar (2 min wait) for beverages or the Chaat Corner near Stand D (3 min wait) for snacks. Avoid Samosa Junction right now as the wait is over 14 minutes.";
    if (q.includes("exit") || q.includes("leave")) return "For the fastest exit after the match, use Gate 4 (your assigned gate). Current estimated post-match exit time: 12 minutes. I will send you a notification 5 minutes before the last over with the optimal exit route.";
    return "I am your SmartVenue AI assistant for today's GT vs RCB match at Narendra Modi Stadium. I can help with finding restrooms, food recommendations, exit routes, seat navigation, and real-time match updates. What would you like to know?";
  }
  if (action === "nudge") {
    const nudges = [
      "Halftime approaching in ~4 overs. Beat the rush and head to the restroom near Stand K now. Current wait: just 1 minute.",
      "Hungry? The Chaat Corner near Stand D has a 3-minute wait. Try the Pani Puri, it is the crowd favorite today!",
      "GT just hit a six! Celebrate with a cold drink from the bar near your stand. Only 2-minute wait.",
      "The exit via Gate 4 currently has no queue. Consider stretching your legs during the strategic timeout.",
      "Temperature is rising to 34C. Stay hydrated! The nearest water fountain is 1 minute from your seat, on the east concourse.",
    ];
    return nudges[Math.floor(Math.random() * nudges.length)];
  }
  return "SmartVenue AI is processing your request.";
}
