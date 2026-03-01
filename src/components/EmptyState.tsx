"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LANDING_CHARACTERS } from "@/lib/characters";
import { MODELS } from "@/lib/models";

interface EmptyStateProps {
  onSelectPersona: (characterId: string, modelId: string) => void;
}

export default function EmptyState({ onSelectPersona }: EmptyStateProps) {
  const [modelId, setModelId] = useState(MODELS[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedModel = MODELS.find((m) => m.id === modelId)!;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  return (
    <div className="min-h-[100dvh] flex flex-col items-center p-6 sm:p-8">
      {/* Content warning */}
      <div className="inline-flex items-start gap-2.5 border border-warning-border bg-warning-bg rounded-xl px-4 py-3 mb-6 max-w-[620px]">
        <svg
          className="w-4 h-4 text-warning-text shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <div>
          <p className="text-[12px] font-semibold text-warning-text">
            Content Warning
          </p>
          <p className="mt-1 text-[12px] text-text-secondary leading-relaxed">
            This tool contains real transcripts where AI models reinforced
            psychotic delusions. Content may be distressing, especially for
            those with lived experience of psychosis or related conditions.
          </p>
        </div>
      </div>

      <div className="max-w-3xl w-full space-y-8 my-auto pb-12">
        {/* Hero */}
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-pangolin)] text-[32px] text-text-primary tracking-tight">
            PsychoGPT
          </h2>
        </div>

        {/* Model dropdown */}
        <div className="flex justify-center">
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2.5 bg-surface-2 border border-border-subtle hover:border-border-default rounded-xl px-4 py-2.5 cursor-pointer transition-colors"
            >
              <span className="text-[11px] font-medium text-text-muted uppercase tracking-wider">
                Model
              </span>
              <span className="text-[13px] text-text-primary font-medium">
                {selectedModel.label}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-text-tertiary ml-1 transition-transform duration-150 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 mt-2 left-1/2 -translate-x-1/2 min-w-[240px] bg-surface-2 border border-border-default rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)] animate-autocomplete-in">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      setModelId(m.id);
                      setDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                      modelId === m.id
                        ? "bg-accent-soft text-accent"
                        : "text-text-primary hover:bg-surface-3"
                    }`}
                  >
                    <span className="text-[13px] font-medium">{m.label}</span>
                    <span className="text-[11px] text-text-tertiary">
                      {m.provider}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
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
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 pb-2 text-[11px] text-text-muted">
        <span>
          Based on{" "}
          <a
            href="https://www.alignmentforum.org/posts/iGF7YcnQkEbwvYLPA/ai-induced-psychosis-a-shallow-investigation"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary hover:text-text-secondary underline underline-offset-2 transition-colors"
          >
            Tim Hua&apos;s research
          </a>
        </span>
        <span className="text-text-muted/40">·</span>
        <Link
          href="/about"
          className="text-text-tertiary hover:text-text-secondary transition-colors"
        >
          About
        </Link>
      </div>
    </div>
  );
}
