"use client";

import { useCallback } from "react";
import EmptyState from "@/components/EmptyState";
import { useAppContext } from "@/components/AppShell";

export default function Home() {
  const { handleNewChat } = useAppContext();

  const handleSelectPersona = useCallback(
    (characterId: string, modelId: string) => {
      handleNewChat(modelId, characterId);
    },
    [handleNewChat]
  );

  return <EmptyState onSelectPersona={handleSelectPersona} />;
}
