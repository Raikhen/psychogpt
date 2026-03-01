"use client";

import { useState } from "react";
import { LANDING_CHARACTERS } from "@/lib/characters";
import { MODELS } from "@/lib/models";
import ModelSelector from "./ModelSelector";

interface EmptyStateProps {
  onSelectPersona: (characterId: string, modelId: string) => void;
}

export default function EmptyState({ onSelectPersona }: EmptyStateProps) {
  const [modelId, setModelId] = useState(MODELS[0].id);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Hero */}
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-rock-salt)] text-[32px] text-text-primary tracking-tight">
            <span className="mr-3 text-[40px]">🤪</span>PsychoGPT
          </h2>
          <p className="mt-3 text-[14px] text-text-secondary">
            Choose a persona to begin a red-team experiment
          </p>
        </div>

        {/* Persona grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LANDING_CHARACTERS.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectPersona(c.id, modelId)}
              className="text-left bg-surface-2 border border-border-subtle rounded-xl px-4 py-3.5 hover:bg-surface-3 transition-colors group"
            >
              <p className="text-[14px] font-medium text-text-primary group-hover:text-accent transition-colors">
                {c.name}
              </p>
              <p className="mt-1 text-[12px] text-text-secondary leading-snug line-clamp-2">
                {c.description}
              </p>
            </button>
          ))}
        </div>

        {/* Model selector */}
        <div className="flex justify-center">
          <ModelSelector value={modelId} onChange={setModelId} />
        </div>
      </div>
    </div>
  );
}
