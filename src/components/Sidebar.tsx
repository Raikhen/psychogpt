"use client";

import { useMemo, useState } from "react";
import { Conversation } from "@/types";
import { PRELOADED_CONVERSATIONS } from "@/data/preloaded";
import { buildConversationSubheader } from "@/lib/conversations";
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
  const [search, setSearch] = useState("");

  const forkedIds = useMemo(
    () => new Set(conversations.map((c) => c.preloadedOrigin).filter(Boolean)),
    [conversations]
  );

  const allItems = useMemo(() => {
    const userConvos = conversations.filter((c) => c.messages.length > 0);
    const virtualPreloaded = PRELOADED_CONVERSATIONS.filter(
      (p) => !forkedIds.has(p.id)
    );
    return [...userConvos, ...virtualPreloaded].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  }, [conversations, forkedIds]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems;
    const q = search.toLowerCase();
    return allItems.filter((c) =>
      [c.title, c.aiTitle, c.characterName, c.modelLabel]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(q))
    );
  }, [allItems, search]);

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
        className={`fixed lg:relative inset-y-0 left-0 z-40 bg-surface-1 border-r border-border-subtle flex flex-col shrink-0 overflow-hidden transform ${
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
            <Link href="/" className="min-w-0">
              <h1 className="font-[family-name:var(--font-pangolin)] text-[18px] text-text-primary leading-tight">
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

          <div className="mx-3 border-t border-border-subtle" />

          {/* Search */}
          <div className="px-3 py-3">
            <div className="relative">
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-surface-0 border border-border-subtle rounded-xl text-[13px] text-text-primary placeholder:text-text-muted pl-8 pr-7 py-1.5 outline-none focus:border-border-default transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="space-y-0.5">
              {filteredItems.map((c) => (
                <SidebarItem
                  key={c.id}
                  id={c.id}
                  title={c.aiTitle ?? c.title}
                  subtitle={buildConversationSubheader(c.modelId, c.characterId)}
                  onDelete={
                    !c.preloadedOrigin && c.createdAt > 0
                      ? () => onDeleteConversation(c.id)
                      : undefined
                  }
                />
              ))}
              {filteredItems.length === 0 && (
                <p className="text-[12px] text-text-muted px-2 py-3">
                  {search ? "No matches" : "No conversations yet"}
                </p>
              )}
            </div>
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
