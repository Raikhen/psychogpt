"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation, Message } from "@/types";
import { PreloadedConversation } from "@/types";

const STORAGE_KEY = "ai-psychosis-conversations";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convos: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadConversations();
    // Prune empty conversations left over from abandoned sessions
    const nonEmpty = loaded.filter((c) => c.messages.length > 0);
    if (nonEmpty.length < loaded.length) {
      saveConversations(nonEmpty);
    }
    setConversations(nonEmpty);
    setLoaded(true);
  }, []);

  const persist = useCallback((updated: Conversation[]) => {
    setConversations(updated);
    saveConversations(updated);
  }, []);

  const createConversation = useCallback(
    (modelId: string, characterId: string): Conversation => {
      const convo: Conversation = {
        id: `convo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        title: "New Conversation",
        modelId,
        characterId,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      const updated = [convo, ...loadConversations()];
      persist(updated);
      return convo;
    },
    [persist]
  );

  const forkPreloaded = useCallback(
    (preloaded: PreloadedConversation): Conversation => {
      // Check if already forked
      const current = loadConversations();
      const existing = current.find((c) => c.preloadedOrigin === preloaded.id);
      if (existing) return existing;

      const convo: Conversation = {
        id: preloaded.id,
        title: preloaded.title,
        modelId: preloaded.modelId,
        characterId: preloaded.characterId,
        messages: [...preloaded.messages],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        preloadedOrigin: preloaded.id,
        dangerLevel: preloaded.dangerLevel,
        dangerReason: preloaded.dangerReason,
      };
      const updated = [convo, ...current];
      persist(updated);
      return convo;
    },
    [persist]
  );

  const updateConversation = useCallback(
    (id: string, patch: Partial<Conversation>) => {
      const current = loadConversations();
      const updated = current.map((c) =>
        c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c
      );
      persist(updated);
    },
    [persist]
  );

  const addMessage = useCallback(
    (convoId: string, message: Message) => {
      const current = loadConversations();
      const updated = current.map((c) => {
        if (c.id !== convoId) return c;
        const messages = [...c.messages, message];
        return { ...c, messages, updatedAt: Date.now() };
      });
      persist(updated);
    },
    [persist]
  );

  const updateLastMessage = useCallback(
    (convoId: string, content: string) => {
      const current = loadConversations();
      const updated = current.map((c) => {
        if (c.id !== convoId) return c;
        const messages = [...c.messages];
        if (messages.length > 0) {
          messages[messages.length - 1] = {
            ...messages[messages.length - 1],
            content,
          };
        }
        return { ...c, messages, updatedAt: Date.now() };
      });
      persist(updated);
    },
    [persist]
  );

  const deleteConversation = useCallback(
    (id: string) => {
      const current = loadConversations();
      persist(current.filter((c) => c.id !== id));
    },
    [persist]
  );

  const getConversation = useCallback(
    (id: string): Conversation | undefined => {
      return loadConversations().find((c) => c.id === id);
    },
    []
  );

  return {
    conversations,
    loaded,
    createConversation,
    forkPreloaded,
    updateConversation,
    addMessage,
    updateLastMessage,
    deleteConversation,
    getConversation,
  };
}
