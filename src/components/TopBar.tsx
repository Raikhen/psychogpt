"use client";

import { Conversation } from "@/types";
import { exportAsMarkdown, downloadFile } from "@/lib/export";

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
  sourceUrl?: string;
  conversation?: Conversation;
}

export default function TopBar({
  onToggleSidebar,
  title,
  sourceUrl,
  conversation,
}: TopBarProps) {
  const handleExport = () => {
    if (!conversation) return;
    const md = exportAsMarkdown(conversation);
    const slug = (conversation.aiTitle ?? conversation.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    downloadFile(md, `${slug}.md`);
  };
  return (
    <div className="border-b border-border-subtle px-4 py-2.5">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
        >
          <svg
            className="w-5 h-5"
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

        {title && (
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-[14px] font-medium text-text-primary truncate">
              {title}
            </h2>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 p-1 rounded-md text-text-tertiary hover:text-accent transition-colors"
                title="View original research"
              >
                <svg
                  className="w-4.5 h-4.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </a>
            )}
          </div>
        )}

        <div className="flex-1" />

        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={handleExport}
            className="shrink-0 p-1 rounded-md text-text-tertiary hover:text-accent transition-colors cursor-pointer"
            title="Export as Markdown"
          >
            <svg
              className="w-4.5 h-4.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
