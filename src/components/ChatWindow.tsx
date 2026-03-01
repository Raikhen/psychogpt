"use client";

import { useRef, useEffect, useCallback } from "react";
import { Message } from "@/types";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  messages: Message[];
  streamingContent: string;
  isStreaming: boolean;
  modelLabel: string;
  isPreloadedOrigin?: boolean;
  preloadedMessageCount?: number;
  characterImage?: string;
  characterName?: string;
}

const ROBOT_IMAGE = "/robot.webp";

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  modelLabel,
  isPreloadedOrigin,
  preloadedMessageCount = 0,
  characterImage,
  characterName,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUpRef = useRef(false);

  // Detect if user has scrolled away from bottom
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    userScrolledUpRef.current = distanceFromBottom > 80;
  }, []);

  // Reset scroll lock when a new user message is sent (messages array grows)
  const prevMessageCountRef = useRef(messages.length);
  useEffect(() => {
    if (messages.length > prevMessageCountRef.current) {
      userScrolledUpRef.current = false;
    }
    prevMessageCountRef.current = messages.length;
  }, [messages.length]);

  useEffect(() => {
    // Don't auto-scroll preloaded transcripts until the user adds new messages
    if (isPreloadedOrigin && messages.length <= preloadedMessageCount && !isStreaming) return;
    if (userScrolledUpRef.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, isPreloadedOrigin, preloadedMessageCount, isStreaming]);

  return (
    <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
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
              avatarSrc={msg.role === "assistant" ? ROBOT_IMAGE : characterImage}
              characterName={msg.role === "user" ? characterName : undefined}
            />
          ))}

        {isStreaming && streamingContent && (
          <ChatMessage
            role="assistant"
            content={streamingContent}
            modelLabel={modelLabel}
            avatarSrc={ROBOT_IMAGE}
          />
        )}

        {isStreaming && !streamingContent && (
          <div className="flex items-start gap-2.5 justify-start">
            <div className="relative flex flex-col items-center gap-1 flex-shrink-0 w-10">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                <img src={ROBOT_IMAGE} alt="AI" className="object-cover w-full h-full" />
              </div>
              <span className="absolute top-11 right-0 text-[10px] text-text-tertiary text-right leading-tight whitespace-nowrap">
                {modelLabel}
              </span>
            </div>
            <div className="bg-surface-2 rounded-2xl px-4 py-3">
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
