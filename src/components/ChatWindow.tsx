"use client";

import { useRef, useEffect } from "react";
import { Message } from "@/types";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  modelLabel: string;
  isPreloadedOrigin?: boolean;
  preloadedMessageCount?: number;
}

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  modelLabel,
  isPreloadedOrigin,
  preloadedMessageCount = 0,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Don't auto-scroll preloaded transcripts until the user adds new messages
    if (isPreloadedOrigin && messages.length <= preloadedMessageCount && !isStreaming) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isPreloadedOrigin, preloadedMessageCount, isStreaming]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        {messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant")
          .filter((msg, i, arr) => {
            // Skip the last assistant message while streaming — it's shown via streamingContent
            if (!isStreaming) return true;
            const isLast = i === arr.length - 1;
            return !(isLast && msg.role === "assistant");
          })
          .map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role as "user" | "assistant"}
              content={msg.content}
              modelLabel={msg.role === "assistant" ? modelLabel : undefined}
            />
          ))}

        {isStreaming && streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            modelLabel={modelLabel}
          />
        )}

        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="bg-surface-2 rounded-2xl px-4 py-3">
              <div className="text-[11px] font-medium text-text-tertiary mb-2">
                {modelLabel}
              </div>
              <div className="flex gap-1.5 items-center h-4">
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-typing-1" />
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-typing-2" />
                <span className="w-1.5 h-1.5 bg-text-tertiary rounded-full animate-typing-3" />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
