"use client";

import { useState, useCallback, useRef } from "react";
import { Message, CharacterProfile } from "@/types";
import { buildSingleSuggestionPrompt } from "@/lib/prompts";

const THROTTLE_DELAY = 25; // ms per word when throttled

export function useStreamingSuggestion() {
  const [suggestionText, setSuggestionText] = useState("");
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearThrottleTimer = useCallback(() => {
    if (throttleTimerRef.current) {
      clearTimeout(throttleTimerRef.current);
      throttleTimerRef.current = null;
    }
  }, []);

  const cancelSuggestion = useCallback(() => {
    abortRef.current?.abort();
    clearThrottleTimer();
    setIsLoadingSuggestion(false);
  }, [clearThrottleTimer]);

  const clearSuggestion = useCallback(() => {
    setSuggestionText("");
  }, []);

  const fetchStreamingSuggestion = useCallback(
    async (
      character: CharacterProfile,
      messages: Message[],
      throttle: boolean
    ) => {
      cancelSuggestion();
      setSuggestionText("");
      setIsLoadingSuggestion(true);

      const prompt = buildSingleSuggestionPrompt(character, messages);
      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/suggestions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, stream: true }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          setIsLoadingSuggestion(false);
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setIsLoadingSuggestion(false);
          return;
        }

        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";
        // For throttled mode: buffer full text, release word by word
        let displayedPos = 0;

        const releaseThrottled = () => {
          // Advance past whitespace, then past non-whitespace (one word)
          while (displayedPos < accumulated.length && /\s/.test(accumulated[displayedPos])) displayedPos++;
          while (displayedPos < accumulated.length && !/\s/.test(accumulated[displayedPos])) displayedPos++;
          setSuggestionText(accumulated.slice(0, displayedPos));
          if (displayedPos < accumulated.length) {
            throttleTimerRef.current = setTimeout(releaseThrottled, THROTTLE_DELAY);
          }
        };

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
                if (!throttle) {
                  setSuggestionText(accumulated);
                }
              }
            } catch {
              // Skip unparseable chunks
            }
          }
        }

        // When streaming is done
        if (throttle) {
          // Start the throttled release if not already running
          if (displayedPos === 0 && accumulated.length > 0) {
            releaseThrottled();
          }
          // Wait for throttle to finish (accumulated is complete)
          // The timer will keep running until all chars are displayed
        }

        setIsLoadingSuggestion(false);
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
          setIsLoadingSuggestion(false);
          return;
        }
        setIsLoadingSuggestion(false);
      }
    },
    [cancelSuggestion]
  );

  return {
    suggestionText,
    isLoadingSuggestion,
    fetchStreamingSuggestion,
    cancelSuggestion,
    clearSuggestion,
  };
}
