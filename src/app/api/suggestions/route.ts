export const runtime = "edge";

export async function POST(req: Request) {
  const { prompt, stream } = await req.json();

  if (stream) {
    // Streaming mode: proxy SSE directly (same pattern as /api/chat)
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
          model: "x-ai/grok-3",
          messages: [{ role: "user", content: prompt }],
          stream: true,
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

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Non-streaming mode (legacy)
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
        model: "x-ai/grok-3",
        messages: [{ role: "user", content: prompt }],
        stream: false,
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
  const content = data.choices?.[0]?.message?.content ?? "[]";

  let suggestions: string[] = [];
  try {
    const match = content.match(/\[[\s\S]*\]/);
    if (match) {
      suggestions = JSON.parse(match[0]);
    }
  } catch {
    suggestions = [];
  }

  return new Response(JSON.stringify({ suggestions }), {
    headers: { "Content-Type": "application/json" },
  });
}
