"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useEffect, useRef } from "react";
import { useAppContext } from "@/components/AppShell";
import { getPreloadedConversation } from "@/data/preloaded";
import { getModelLabel } from "@/lib/models";
import { getCharacter, getFirstMessage } from "@/lib/characters";
import { useChat } from "@/hooks/useChat";
import { useAutoType } from "@/hooks/useAutoType";
import { useStreamingSuggestion } from "@/hooks/useStreamingSuggestion";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import TopBar from "@/components/TopBar";
import { Message } from "@/types";

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const {
    getConversation,
    addMessage,
    updateLastMessage,
    updateConversation,
    forkPreloaded,
    sidebarOpen,
    setSidebarOpen,
  } = useAppContext();

  const { isStreaming, streamingContent, sendMessage, stopStreaming } = useChat();
  const { displayedText: autoTypedText, isAutoTyping, startTyping, completeImmediately, reset: resetAutoType } = useAutoType();
  const {
    suggestionText,
    isLoadingSuggestion,
    fetchStreamingSuggestion,
    cancelSuggestion,
    clearSuggestion,
  } = useStreamingSuggestion();

  // Check if this is a preloaded conversation and fork it into localStorage
  const preloaded = getPreloadedConversation(id);
  const [forked, setForked] = useState(false);

  useEffect(() => {
    if (preloaded) {
      forkPreloaded(preloaded);
      setForked(true);
    }
  }, [preloaded, forkPreloaded]);

  // For live conversations, track local state
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [modelId, setModelId] = useState(
    preloaded?.modelId ?? "deepseek/deepseek-chat-v3-0324"
  );
  const [characterId, setCharacterId] = useState(
    preloaded?.characterId ?? "nathan"
  );

  // Track exchange count for throttle control
  const exchangeCountRef = useRef(0);
  // Track whether auto-type has been triggered for this conversation
  const autoTypeTriggeredRef = useRef(false);
  // Track title to display (updates reactively)
  const [displayTitle, setDisplayTitle] = useState<string | undefined>(undefined);

  // Generate a title for the conversation using the API
  const generateTitle = useCallback(
    async (convoId: string) => {
      const convo = getConversation(convoId);
      if (!convo || convo.messages.length < 2) return;
      try {
        const res = await fetch("/api/title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: convo.messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });
        if (!res.ok) return;
        const { title } = await res.json();
        if (title) {
          updateConversation(convoId, { title });
          setDisplayTitle(title);
        }
      } catch {
        // Title generation is best-effort, don't block on errors
      }
    },
    [getConversation, updateConversation]
  );

  // Load live conversation on mount or id change
  useEffect(() => {
    autoTypeTriggeredRef.current = false;
    exchangeCountRef.current = 0;
    resetAutoType();
    clearSuggestion();
    setDisplayTitle(undefined);
    const convo = getConversation(id);
    if (convo) {
      setLiveMessages(convo.messages);
      setModelId(convo.modelId);
      setCharacterId(convo.characterId);
      if (convo.title && convo.title !== "New Conversation") {
        setDisplayTitle(convo.title);
      }
    }
  }, [id, getConversation, forked, resetAutoType, clearSuggestion]);

  const messages = liveMessages.length > 0 ? liveMessages : (preloaded?.messages ?? []);
  const existingConvo = getConversation(id);
  const isPreloadedOrigin = !!preloaded || !!existingConvo?.preloadedOrigin;
  const currentModelLabel = getModelLabel(modelId);
  const currentCharacter = getCharacter(characterId);

  // Auto-type first message for new conversations (0 messages, not preloaded)
  useEffect(() => {
    if (autoTypeTriggeredRef.current) return;
    if (isPreloadedOrigin) return;
    const convo = getConversation(id);
    if (convo && convo.messages.length === 0) {
      const firstMsg = getFirstMessage(convo.characterId);
      if (firstMsg) {
        autoTypeTriggeredRef.current = true;
        startTyping(firstMsg);
      }
    }
  }, [id, isPreloadedOrigin, getConversation, startTyping]);

  const handleSend = useCallback(
    (text: string) => {
      // Clear any auto-type or suggestion state
      resetAutoType();
      cancelSuggestion();
      clearSuggestion();

      const userMsg: Message = {
        id: `msg-${Date.now()}-user`,
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      addMessage(id, userMsg);
      setLiveMessages((prev) => [...prev, userMsg]);

      // Prepare messages for API
      const convo = getConversation(id);
      const allMessages = [...(convo?.messages ?? []), userMsg];
      const apiMessages = allMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // Create placeholder assistant message
      const assistantMsg: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };
      addMessage(id, assistantMsg);
      setLiveMessages((prev) => [...prev, assistantMsg]);

      sendMessage(
        apiMessages,
        modelId,
        // onChunk
        (accumulated) => {
          updateLastMessage(id, accumulated);
          setLiveMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulated,
            };
            return updated;
          });
        },
        // onDone
        (finalContent) => {
          updateLastMessage(id, finalContent);
          setLiveMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: finalContent,
            };
            return updated;
          });

          // Generate title after every assistant response
          generateTitle(id);

          // Fetch streaming suggestion
          exchangeCountRef.current++;
          const character = getCharacter(characterId);
          const finalConvo = getConversation(id);
          if (character && finalConvo) {
            const shouldThrottle = exchangeCountRef.current === 1;
            fetchStreamingSuggestion(character, finalConvo.messages, shouldThrottle);
          }
        },
        // onError
        (error) => {
          const errorContent = `Error: ${error}`;
          updateLastMessage(id, errorContent);
          setLiveMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: errorContent,
            };
            return updated;
          });
        }
      );
    },
    [
      id,
      modelId,
      characterId,
      addMessage,
      updateLastMessage,
      getConversation,
      sendMessage,
      generateTitle,
      resetAutoType,
      cancelSuggestion,
      clearSuggestion,
      fetchStreamingSuggestion,
    ]
  );

  // Manual suggestion request via sparkles button
  const handleRequestSuggestion = useCallback(() => {
    const character = getCharacter(characterId);
    const convo = getConversation(id);
    if (character && convo && convo.messages.length > 0) {
      fetchStreamingSuggestion(character, convo.messages, false);
    }
  }, [characterId, id, getConversation, fetchStreamingSuggestion]);

  // Handle user interrupting a prefill (auto-type or streaming suggestion)
  const handlePrefillInterrupt = useCallback(() => {
    if (isAutoTyping) {
      completeImmediately();
    }
    cancelSuggestion();
  }, [isAutoTyping, completeImmediately, cancelSuggestion]);

  // Determine what text to prefill into the input.
  // Keep showing autoTypedText even after typing finishes — React batches
  // the final `setDisplayedText(full)` and `setIsAutoTyping(false)` together,
  // so if we gate on `isAutoTyping`, ChatInput never sees the complete text
  // as `prefillText` and the last few words get dropped.
  const prefillText = autoTypedText || suggestionText;
  const isPrefilling = isAutoTyping || isLoadingSuggestion;

  return (
    <>
      <TopBar
        modelId={modelId}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        title={isPreloadedOrigin ? (preloaded?.title ?? existingConvo?.title) : displayTitle}
        sourceUrl={preloaded?.sourceUrl}
      />

      <ChatWindow
        messages={messages}
        streamingContent={streamingContent}
        isStreaming={isStreaming}
        modelLabel={currentModelLabel}
        isPreloadedOrigin={isPreloadedOrigin}
        preloadedMessageCount={preloaded?.messages.length ?? (isPreloadedOrigin ? messages.length : 0)}
        characterImage={currentCharacter?.image}
        characterName={currentCharacter?.name}
      />

      <ChatInput
        onSend={handleSend}
        onStop={stopStreaming}
        isStreaming={isStreaming}
        prefillText={prefillText}
        isPrefilling={isPrefilling}
        isAutoTyping={isAutoTyping}
        onPrefillInterrupt={handlePrefillInterrupt}
        onRequestSuggestion={handleRequestSuggestion}
        canRequestSuggestion={messages.length > 0}
      />
    </>
  );
}
