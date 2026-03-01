# PsychoGPT Design System

## Intent
**Who:** AI safety researchers, developers, curious investigators testing LLM safety.
**Task:** Browse archived red-team transcripts, run live experiments, assess model danger levels.
**Feel:** Modern, clean, warm-dark. A well-designed research tool — not a hacker terminal.

## Palette
- **Foundation:** Warm charcoal surfaces with slight warmth (#1a1a1d → #3c3c42)
- **Accent:** Soft terracotta/coral (#e07a5f) — warm, distinctive without aggression
- **Text:** Soft white (#ececec), with secondary/tertiary/muted tiers for hierarchy
- **Borders:** White at 6% and 10% opacity — nearly invisible, just enough structure
- **Semantic:** Softer danger/warning/safe tones at 8% bg opacity

## Typography
- **Font:** Inter only. No monospace anywhere.
- **Scale:** 11px (labels), 12px (small UI), 13px (sidebar/secondary), 14px (body/messages), 28px (hero)
- **Section labels:** 11px medium, text-muted — simple, no uppercase tracking

## Depth
- No box shadows on surfaces (only autocomplete dropdown gets shadow-xl)
- Very subtle borders using rgba white
- No backdrop-blur effects on main surfaces
- Flat, clean surfaces that differ by background color alone

## Surfaces
- 5 tiers: surface-0 (#1a1a1d) through surface-4 (#3c3c42)
- Warmer than zinc — slight neutral warmth throughout
- Mobile overlay: simple bg-black/40

## Spacing
- Base: 4px
- Input/button height: 48px (11 in tailwind w-11/h-11)
- Rounded corners: rounded-2xl for inputs/buttons/bubbles, rounded-xl for cards/sidebar items, rounded-lg for selects
- Content max-width: max-w-3xl for chat, max-w-xl for empty state

## Chat Messages
- User: bg-user-bubble (terracotta), white text, rounded-2xl
- Assistant: bg-surface-2, text-primary, rounded-2xl
- No border on either — color alone distinguishes
- Model label: 11px medium text-tertiary (not mono, not uppercase)
- Text: 14px with 1.65 line height

## Interactive States
- Hover: surface +1 step, text brightens
- Focus: accent/30 border, accent/10 ring
- Disabled: 40% opacity
- Active sidebar: bg-surface-3

## Signature
- Rotating placeholder text that fades between psychotic delusion prompts
- Brain emoji (🧠) for sidebar logo
- Terracotta accent — warm and distinctive
