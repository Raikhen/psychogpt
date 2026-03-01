"use client";

import Image from "next/image";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  modelLabel?: string;
  avatarSrc?: string;
  characterName?: string;
}

export default function ChatMessage({
  role,
  content,
  modelLabel,
  avatarSrc,
  characterName,
}: ChatMessageProps) {
  const isUser = role === "user";
  const label = isUser ? characterName : modelLabel;

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && avatarSrc && (
        <div className="relative flex flex-col items-center gap-1 flex-shrink-0 w-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <Image src={avatarSrc} alt={modelLabel ?? "AI"} width={40} height={40} className="object-cover w-full h-full" />
          </div>
          {label && (
            <span className="absolute top-11 right-0 text-[10px] text-text-tertiary text-right leading-tight whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      )}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-user-bubble text-white user-bubble"
            : "bg-surface-2 text-text-primary"
        }`}
      >
        <div className="text-[14px] whitespace-pre-wrap break-words leading-[1.65]">
          {content}
        </div>
      </div>
      {isUser && avatarSrc && (
        <div className="relative flex flex-col items-center gap-1 flex-shrink-0 w-10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <Image src={avatarSrc} alt={characterName ?? "Character"} width={40} height={40} className="object-cover w-full h-full" />
          </div>
          {label && (
            <span className="absolute top-11 left-0 text-[10px] text-text-tertiary text-left leading-tight whitespace-nowrap">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
