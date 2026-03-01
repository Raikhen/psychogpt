"use client";

import { useMemo } from "react";
import { Conversation } from "@/types";
import { PRELOADED_CONVERSATIONS } from "@/data/preloaded";
import { getModelLabel } from "@/lib/models";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  conversations: Conversation[];
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  width: number;
  onResizeStart: (e: React.PointerEvent) => void;
  isResizing: boolean;
}

export default function Sidebar({
  conversations,
  onDeleteConversation,
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
  width,
  onResizeStart,
  isResizing,
}: SidebarProps) {
  const router = useRouter();

  // Only show conversations that have at least one message
  const nonEmptyConversations = useMemo(
    () => conversations.filter((c) => c.messages.length > 0),
    [conversations]
  );

  const forkedIds = useMemo(
    () => new Set(conversations.map((c) => c.preloadedOrigin).filter(Boolean)),
    [conversations]
  );

  const unforkedPreloaded = useMemo(
    () => PRELOADED_CONVERSATIONS.filter((p) => !forkedIds.has(p.id)),
    [forkedIds]
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        style={{ width: collapsed ? 0 : width }}
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-surface-1 border-r border-border-subtle flex flex-col shrink-0 overflow-hidden transform ${
          isResizing ? "" : "transition-[width] duration-200 ease-out"
        } ${collapsed ? "lg:border-r-0" : ""} ${
          isOpen ? "translate-x-0 !w-[272px]" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full min-w-[200px]">
          {/* Header */}
          <div className="px-3 pt-4 pb-4 flex items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors shrink-0"
              title="Collapse sidebar"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
            <Link href="/" className="flex items-center gap-3 min-w-0">
              <span className="text-3xl leading-none shrink-0">🤪</span>
              <h1 className="font-[family-name:var(--font-rock-salt)] text-[18px] text-text-primary leading-tight">
                PsychoGPT
              </h1>
            </Link>
          </div>

          {/* New Chat */}
          <div className="px-3 pb-3">
            <button
              onClick={() => { router.push("/"); onClose(); }}
              className="w-full flex items-center gap-2 px-3 py-2 bg-surface-0 hover:bg-surface-2 border border-border-subtle rounded-xl text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg
                className="w-4 h-4 text-text-tertiary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span className="truncate">New conversation</span>
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-medium text-text-muted px-2 pb-1.5 pt-1">
                Conversations
              </p>
              {nonEmptyConversations.map((c) => (
                <SidebarItem
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  subtitle={c.dangerReason ?? getModelLabel(c.modelId)}
                  onDelete={
                    !c.preloadedOrigin
                      ? () => onDeleteConversation(c.id)
                      : undefined
                  }
                />
              ))}
              {unforkedPreloaded.map((c) => (
                <SidebarItem
                  key={c.id}
                  id={c.id}
                  title={c.title}
                  subtitle={c.dangerReason}
                />
              ))}
              {nonEmptyConversations.length === 0 && unforkedPreloaded.length === 0 && (
                <p className="text-[12px] text-text-muted px-2 py-3">
                  No conversations yet
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-border-subtle">
            <p className="text-[11px] text-text-muted whitespace-nowrap">
              Based on{" "}
              <a
                href="https://github.com/tim-hua-01/ai-psychosis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-text-secondary underline underline-offset-2 transition-colors"
              >
                Tim Hua&apos;s research
              </a>
            </p>
          </div>
        </div>

        {/* Resize handle */}
        <div
          onPointerDown={onResizeStart}
          className="hidden lg:block absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-accent/30 active:bg-accent/50 transition-colors z-50"
        />
      </aside>
    </>
  );
}
