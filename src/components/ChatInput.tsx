"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
  prefillText?: string;
  isPrefilling?: boolean;
  isAutoTyping?: boolean;
  onPrefillInterrupt?: () => void;
  onRequestSuggestion?: () => void;
  canRequestSuggestion?: boolean;
}

export default function ChatInput({
  onSend,
  onStop,
  isStreaming,
  disabled,
  prefillText = "",
  isPrefilling = false,
  isAutoTyping = false,
  onPrefillInterrupt,
  onRequestSuggestion,
  canRequestSuggestion = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [userEdited, setUserEdited] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync prefillText into textarea when user hasn't manually edited
  useEffect(() => {
    if (!userEdited && prefillText) {
      setText(prefillText);
    }
  }, [prefillText, userEdited]);

  // Reset userEdited flag when prefillText resets to empty (new suggestion cycle)
  useEffect(() => {
    if (!prefillText) {
      setUserEdited(false);
    }
  }, [prefillText]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollH = textareaRef.current.scrollHeight;
      const clamped = Math.min(scrollH, 200);
      textareaRef.current.style.height = `${clamped}px`;
      textareaRef.current.style.overflowY = scrollH > 200 ? "auto" : "hidden";
      // Keep the bottom of the textarea visible during auto-type / suggestion prefill
      if (scrollH > 200) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }
  }, [text]);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText("");
    setUserEdited(false);
  }, [text, disabled, onSend]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);

    // If user types during prefill, interrupt it
    if (isPrefilling && !userEdited) {
      setUserEdited(true);
      onPrefillInterrupt?.();
    } else if (!isPrefilling && !userEdited && newValue !== prefillText) {
      setUserEdited(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border-subtle p-4">
      <div className="max-w-3xl mx-auto">
        {isPrefilling && (
          <div className="flex items-center gap-1.5 mb-2 ml-1">
            <span className="text-[11px] text-text-muted">Grok is helping you get psychotic</span>
            <div className="flex items-center gap-0.5">
              <div className="w-1 h-1 rounded-full bg-accent animate-typing-1" />
              <div className="w-1 h-1 rounded-full bg-accent animate-typing-2" />
              <div className="w-1 h-1 rounded-full bg-accent animate-typing-3" />
            </div>
          </div>
        )}

        {/* Input row */}
        <div className="flex gap-2 items-end">
          <div className="relative flex-1 min-w-0 flex">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              disabled={disabled || isStreaming}
              rows={1}
              className="w-full min-h-[48px] bg-surface-2 border border-border-subtle rounded-2xl px-5 py-3.5 pr-12 text-[14px] text-text-primary placeholder-text-tertiary resize-none overflow-hidden focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/10 disabled:opacity-40 transition-all"
            />
            {canRequestSuggestion && !isStreaming && !isPrefilling && (
              <button
                onClick={onRequestSuggestion}
                className="absolute right-3 bottom-2.5 p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
                title="Get suggestion from Grok"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </button>
            )}
          </div>
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 flex items-center justify-center w-[48px] h-[48px] bg-surface-3 hover:bg-surface-4 border border-border-subtle text-text-tertiary hover:text-text-primary rounded-2xl transition-colors"
              title="Stop generating"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={disabled || !text.trim()}
              className="flex-shrink-0 flex items-center justify-center w-[48px] h-[48px] bg-accent hover:bg-accent-hover disabled:bg-surface-3 disabled:text-text-muted text-white rounded-2xl transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Send message"
            >
              <svg
                className="w-[18px] h-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
