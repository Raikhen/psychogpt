"use client";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  modelLabel?: string;
}

export default function ChatMessage({
  role,
  content,
  modelLabel,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-user-bubble text-white"
            : "bg-surface-2 text-text-primary"
        }`}
      >
        {!isUser && modelLabel && (
          <div className="text-[11px] font-medium text-text-tertiary mb-1">
            {modelLabel}
          </div>
        )}
        <div className="text-[14px] whitespace-pre-wrap break-words leading-[1.65]">
          {content}
        </div>
      </div>
    </div>
  );
}
