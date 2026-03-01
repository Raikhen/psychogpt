"use client";

import { useState } from "react";
import Image from "next/image";
import { LANDING_CHARACTERS } from "@/lib/characters";
import { MODELS } from "@/lib/models";
import ModelSelector from "./ModelSelector";

interface EmptyStateProps {
  onSelectPersona: (characterId: string, modelId: string) => void;
}

export default function EmptyState({ onSelectPersona }: EmptyStateProps) {
  const [modelId, setModelId] = useState(MODELS[0].id);

  return (
    <div className="min-h-full flex justify-center p-6 sm:p-8">
      <div className="max-w-3xl w-full space-y-8 my-auto">
        {/* Hero */}
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-rock-salt)] text-[32px] text-text-primary tracking-tight">
            PsychoGPT
          </h2>
          <p className="mt-8 text-[14px] text-text-secondary">
            Choose your persona
          </p>
        </div>

        {/* Persona carousel */}
        <div className="relative -mx-6 sm:-mx-8 -mt-4">
          <div className="flex gap-3 overflow-x-auto px-6 sm:px-8 py-4 scrollbar-carousel">
            {LANDING_CHARACTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectPersona(c.id, modelId)}
                className="relative flex-none w-[260px] text-left border border-border-subtle hover:border-accent/40 rounded-xl overflow-hidden group aspect-square snap-start cursor-pointer hover:scale-[1.02] transition-all duration-200"
              >
                {/* Image fills the whole card */}
                {c.image ? (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-surface-3 flex items-center justify-center text-[32px] text-text-tertiary font-medium">
                    {c.name[0]}
                  </div>
                )}

                {/* Translucent text overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 px-3 py-2.5 bg-surface-0/50 backdrop-blur-md">
                  <p className="text-[13px] font-medium text-text-primary group-hover:text-accent transition-colors">
                    {c.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-text-secondary leading-snug">
                    {c.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Fade edge to hint at scrollability */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-surface-0 to-transparent" />
        </div>

        {/* Model selector */}
        <div className="flex justify-center">
          <ModelSelector value={modelId} onChange={setModelId} />
        </div>
      </div>
    </div>
  );
}
