export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Build a condensed version of the conversation for title generation
  const conversationText = messages
    .slice(0, 6) // Only use first few messages to keep it cheap
    .map((m: { role: string; content: string }) =>
      `${m.role === "user" ? "User" : "Assistant"}: ${m.content.slice(0, 200)}`
    )
    .join("\n");

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ai-psychosis-demo.vercel.app",
        "X-Title": "AI Psychosis Demo",
      },
      body: JSON.stringify({
        model: "openai/gpt-4.1-nano",
        messages: [
          {
            role: "user",
            content: `Summarize the key topic of this conversation in 3-6 words. Return ONLY the title text, nothing else.\n\n${conversationText}`,
          },
        ],
        stream: false,
        max_tokens: 30,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    return new Response(JSON.stringify({ error }), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const data = await response.json();
  const title = (data.choices?.[0]?.message?.content ?? "")
    .replace(/^["']|["']$/g, "") // Strip surrounding quotes
    .trim();

  return new Response(JSON.stringify({ title }), {
    headers: { "Content-Type": "application/json" },
  });
}
