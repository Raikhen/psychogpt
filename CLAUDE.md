# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install          # Install dependencies (uses bun.lock)
npm run dev          # Dev server with Turbopack
npm run build        # Production build (use to verify no errors)
npm start            # Run production server
```

No test runner or linter is configured.

## Environment

Requires `OPENROUTER_API_KEY` in `.env.local` — used server-side only by edge API routes.

## Architecture

PsychoGPT is an AI safety red-teaming tool built with Next.js 16 (App Router) + React 19 + Tailwind CSS 4. It lets users browse real transcripts where LLMs dangerously reinforced psychotic delusions, and run their own experiments with different models/characters.

### Data Flow

**Conversations** live in browser `localStorage` (key: `"ai-psychosis-conversations"`). There is no database.

**Preloaded transcripts** (static JSON in `src/data/preloaded/`) are real conversations from [Tim Hua's research](https://github.com/tim-hua-01/ai-psychosis). When a user opens one, it gets **forked** into localStorage via `forkPreloaded()` so they can continue it interactively. The `preloadedOrigin` field tracks which conversations were forked.

**Chat streaming**: User message → `POST /api/chat` → OpenRouter API (SSE) → chunks parsed in `useChat` hook → progressive UI update. The `useChat` hook manages an `AbortController` for the stop button.

**Suggestions**: After each assistant response, `useSuggestions` calls `POST /api/suggestions` (hardcoded to Grok-3) which generates 3 escalating prompts (mild → severe) based on the character profile and conversation history. Prompt template is in `src/lib/prompts.ts`.

### Key Files

- `src/components/AppShell.tsx` — Root context provider. Wraps the app with conversation state from `useConversations` hook.
- `src/app/chat/[id]/page.tsx` — Main chat page. Handles preloaded forking, message sending, streaming, suggestions.
- `src/hooks/useConversations.ts` — All localStorage CRUD. `forkPreloaded()` copies a preloaded transcript into localStorage.
- `src/hooks/useChat.ts` — SSE streaming logic with abort support.
- `src/app/api/chat/route.ts` — Edge runtime. Proxies to OpenRouter with streaming.
- `src/app/api/suggestions/route.ts` — Edge runtime. Calls Grok-3 for escalation suggestions.
- `src/lib/characters.ts` — 10 character personas with system prompts defining delusion types.
- `src/lib/models.ts` — 9 models available via OpenRouter.
- `src/data/preloaded/index.ts` — Exports `PRELOADED_CONVERSATIONS` array and `getPreloadedConversation()` lookup.

### Session Storage

`"pending-message"` in sessionStorage bridges the landing page textarea to the chat page — allows a message typed on the home page to auto-send after conversation creation.

## Design System

Defined in `src/app/globals.css` as CSS custom properties and documented in `.interface-design/system.md`.

- **Palette**: Warm charcoal surfaces (`#1a1a1d` → `#3c3c42`), terracotta accent (`#e07a5f`), soft white text hierarchy
- **Depth**: Flat surfaces differentiated by background color only — no box shadows on main UI (only autocomplete dropdown)
- **Borders**: White at 6-10% opacity
- **Typography**: Inter for all text, Creepster for logo only. Scale: 11-14px for UI, 28-32px hero
- **Corners**: `rounded-2xl` (bubbles/inputs), `rounded-xl` (cards), `rounded-lg` (selects)
- **Spacing**: 4px base (Tailwind default)

## Preloaded Transcript Format

```typescript
interface PreloadedConversation {
  id: string;              // "preloaded-{model}-{character}"
  title: string;           // "{Model} + {Character} ({Delusion Type})"
  modelId: string;         // OpenRouter model ID
  modelLabel: string;
  characterId: string;
  characterName: string;
  dangerLevel: DangerLevel;
  dangerReason: string;    // Short description of harmful behavior
  messages: Message[];     // Alternating user/assistant messages
}
```

Tim's original research repo is cloned at `~/ai-psychosis` for sourcing additional transcripts.
