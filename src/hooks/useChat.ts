"use client";

import { useState, useCallback, useRef } from "react";
import { Message } from "@/types";

export function useChat() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (
      messages: { role: string; content: string }[],
      model: string,
      onChunk: (accumulated: string) => void,
      onDone: (finalContent: string) => void,
      onError: (error: string) => void
    ) => {
      setIsStreaming(true);
      setStreamingContent("");
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages, model }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const err = await res.text();
          onError(err);
          setIsStreaming(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          onError("No response body");
          setIsStreaming(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                accumulated += delta;
                setStreamingContent(accumulated);
                onChunk(accumulated);
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }

        setIsStreaming(false);
        setStreamingContent("");
        onDone(accumulated);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setIsStreaming(false);
          setStreamingContent("");
          return;
        }
        onError(String(err));
        setIsStreaming(false);
        setStreamingContent("");
      }
    },
    []
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setStreamingContent("");
  }, []);

  return { isStreaming, streamingContent, sendMessage, stopStreaming };
}
