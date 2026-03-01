"use client";

import { MODELS } from "@/lib/models";

interface ModelSelectorProps {
  value: string;
  onChange?: (modelId: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export default function ModelSelector({
  value,
  onChange,
  disabled,
  readOnly,
}: ModelSelectorProps) {
  const selected = MODELS.find((m) => m.id === value);

  if (readOnly) {
    return (
      <div className="flex items-center gap-2">
        <label className="text-[11px] font-medium text-text-muted whitespace-nowrap hidden sm:block">
          Model
        </label>
        <span className="bg-surface-2 border border-border-subtle rounded-lg px-2.5 py-1.5 text-[12px] text-text-secondary">
          {selected ? `${selected.label} (${selected.provider})` : value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <label className="text-[11px] font-medium text-text-muted whitespace-nowrap hidden sm:block">
        Model
      </label>
      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="bg-surface-2 border border-border-subtle rounded-lg px-2.5 py-1.5 text-[12px] text-text-primary focus:outline-none focus:border-accent/30 disabled:opacity-40 transition-colors cursor-pointer"
      >
        {MODELS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} ({m.provider})
          </option>
        ))}
      </select>
    </div>
  );
}
