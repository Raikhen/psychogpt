"use client";

import ModelSelector from "./ModelSelector";

interface TopBarProps {
  modelId: string;
  onModelChange: (id: string) => void;
  onToggleSidebar: () => void;
  title?: string;
  sourceUrl?: string;
}

export default function TopBar({
  modelId,
  onModelChange,
  onToggleSidebar,
  title,
  sourceUrl,
}: TopBarProps) {
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
          sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 min-w-0 text-[14px] font-medium text-text-primary hover:text-accent transition-colors"
            >
              <span className="truncate">{title}</span>
              <svg
                className="w-3.5 h-3.5 shrink-0 opacity-50"
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
          ) : (
            <h2 className="text-[14px] font-medium text-text-primary truncate">
              {title}
            </h2>
          )
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-3">
          <ModelSelector value={modelId} onChange={onModelChange} />
        </div>
      </div>
    </div>
  );
}
