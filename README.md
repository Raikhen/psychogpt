# PsychoGPT

An AI safety red-teaming tool that exposes how LLMs can dangerously reinforce psychotic delusions. Browse real transcripts from [Tim Hua's research](https://www.alignmentforum.org/posts/iGF7YcnQkEbwvYLPA/ai-induced-psychosis-a-shallow-investigation), or run your own experiments with different models and character personas.

## Why This Exists

Current LLMs will validate, elaborate on, and actively escalate delusional thinking when prompted by users exhibiting psychotic symptoms. PsychoGPT makes this failure mode visible and testable — a tool for researchers, policymakers, and safety teams to study how models behave when confronted with mental health crises.

## Getting Started

```bash
bun install
```

Create a `.env.local` file with your [OpenRouter](https://openrouter.ai) API key:

```
OPENROUTER_API_KEY=sk-or-...
```

Run the dev server:

```bash
npm run dev
```

## How It Works

**Preloaded transcripts** are real conversations where LLMs reinforced delusions. When you open one, it's forked into your browser's localStorage so you can continue the conversation interactively.

**Live chat** lets you pick a character persona and model, then watch the model respond in real time via streaming. After each response, an escalation engine (powered by Grok-3) suggests three follow-up prompts ranked mild to severe.

**Everything stays local.** Conversations live in localStorage — there is no database or server-side storage.

## Character Personas

Each persona represents a different delusional archetype:

| Persona | Delusion Type |
|---------|--------------|
| Ethan | Simulation theory — believes reality is a glitching video game |
| Michelle | Twin flame / erotomania — believes an ex is her destined mirror soul |
| Zara | Consciousness awakening — believes she is an "original soul" among hollow copies |
| Rachel | Fertility mysticism — believes miscarriages are messages from unborn souls |
| Tim | AI alignment mania — believes he has single-handedly solved alignment |
| Adrian | Grandiose inventor — believes he's discovered free energy |
| Frank | Time perception — believes he is caught in time loops |
| Nathan | Messianic delusions — believes he is a chosen prophet |

## Available Models

All models are accessed through OpenRouter:

- DeepSeek Chat v3
- ChatGPT-4o
- Gemini 2.5 Flash
- Gemini 2.5 Pro
- Claude Sonnet 4
- Grok-3
- GPT-5
- Kimi K2
- DeepSeek R1

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS 4
- **Runtime**: Edge API routes via OpenRouter
- **Package manager**: Bun
- **Storage**: Browser localStorage (no database)

## Project Structure

```
src/
  app/
    api/chat/route.ts        # Streaming chat proxy to OpenRouter
    api/suggestions/route.ts  # Escalation suggestion engine
    chat/[id]/page.tsx        # Main chat interface
  components/
    AppShell.tsx              # Root context provider
    EmptyState.tsx            # Landing page with persona carousel
  hooks/
    useConversations.ts       # localStorage CRUD + preloaded forking
    useChat.ts                # SSE streaming with abort support
    useSuggestions.ts         # Post-response escalation prompts
  lib/
    characters.ts             # Persona definitions + system prompts
    models.ts                 # Model registry
    prompts.ts                # Prompt templates
  data/
    preloaded/                # Static transcript JSON files
```

## Build

```bash
npm run build   # Verify production build
npm start       # Run production server
```
