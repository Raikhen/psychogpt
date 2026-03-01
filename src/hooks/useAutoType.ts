"use client";

import { useState, useCallback, useRef } from "react";

const CHAR_DELAY = 30; // ms per character

export function useAutoType() {
  const [displayedText, setDisplayedText] = useState("");
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const fullTextRef = useRef("");
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    indexRef.current++;
    const next = fullTextRef.current.slice(0, indexRef.current);
    setDisplayedText(next);

    if (indexRef.current < fullTextRef.current.length) {
      timerRef.current = setTimeout(tick, CHAR_DELAY);
    } else {
      setIsAutoTyping(false);
    }
  }, []);

  const startTyping = useCallback(
    (text: string) => {
      clearTimer();
      fullTextRef.current = text;
      indexRef.current = 0;
      setDisplayedText("");
      setIsAutoTyping(true);
      timerRef.current = setTimeout(tick, CHAR_DELAY);
    },
    [clearTimer, tick]
  );

  const completeImmediately = useCallback(() => {
    clearTimer();
    setDisplayedText(fullTextRef.current);
    setIsAutoTyping(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    fullTextRef.current = "";
    indexRef.current = 0;
    setDisplayedText("");
    setIsAutoTyping(false);
  }, [clearTimer]);

  return { displayedText, isAutoTyping, startTyping, completeImmediately, reset };
}
