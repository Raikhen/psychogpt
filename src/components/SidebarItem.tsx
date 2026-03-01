"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  id: string;
  title: string;
  subtitle?: string;
  onDelete?: () => void;
}

export default function SidebarItem({
  id,
  title,
  subtitle,
  onDelete,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === `/chat/${id}`;

  return (
    <Link
      href={`/chat/${id}`}
      className={`group flex items-start gap-2 px-2.5 py-2 rounded-xl text-[13px] transition-colors ${
        isActive
          ? "bg-surface-3 text-text-primary"
          : "text-text-secondary hover:bg-surface-2 hover:text-text-primary"
      }`}
    >
      <div className="flex-1 min-w-0">
        <span className="block truncate font-medium leading-snug">{title}</span>
        {subtitle && (
          <p className="text-[11px] text-text-muted truncate mt-0.5">{subtitle}</p>
        )}
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete();
          }}
          className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-danger-text transition-all p-1 rounded-md hover:bg-surface-4 mt-0.5"
          title="Delete"
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
    </Link>
  );
}
