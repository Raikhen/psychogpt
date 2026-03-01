"use client";

import { useState, useCallback, useRef } from "react";

const WORD_DELAY = 25; // ms per word

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
    const text = fullTextRef.current;
    let pos = indexRef.current;
    // Skip to end of next word (advance past whitespace, then past non-whitespace)
    while (pos < text.length && /\s/.test(text[pos])) pos++;
    while (pos < text.length && !/\s/.test(text[pos])) pos++;
    indexRef.current = pos;
    setDisplayedText(text.slice(0, pos));

    if (pos < text.length) {
      timerRef.current = setTimeout(tick, WORD_DELAY);
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
      timerRef.current = setTimeout(tick, WORD_DELAY);
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
