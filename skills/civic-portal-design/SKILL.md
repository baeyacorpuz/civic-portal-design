---
name: civic-portal-design
description: Design system and content patterns for community-built local government portals in the Philippines (municipal, city, provincial or barangay sites in the BetterGov.ph style). Use when building or restyling such a site, or any page of one, including services or Citizen's Charter pages, emergency hotlines, officials, barangays, transparency or legislative pages, homepage sections, or the header, footer and top bar. Also use when someone asks to "use the civic portal design", "match Better Naguilian", rebrand the palette for another town, or check a page against these rules. Covers OKLCH semantic tokens with dark mode, shadcn/ui (Radix) variants, Phosphor icons, layout helpers, source-and-date rules for facts, and WCAG 2.1 AA checks. Stack is React + Tailwind CSS v4 + shadcn/ui, but the rules carry to any stack.
---

# Civic portal design

This design system comes from [Better Naguilian](https://github.com/baeyacorpuz/betternaguilianlu), a volunteer-built portal for Naguilian, La Union. Use it to build a portal that feels like a calm, trustworthy public service rather than a brochure, and that works on a cheap phone on mobile data.

## Principles

1. **Service first.** Every screen helps a resident finish a task: find a service, reach an office, call a hotline, check a source. Decoration never pushes those actions down the page.
2. **Verified and sourced.** Every fact links to where it came from, and every data set records when a volunteer last checked it. If something isn't verified, say so on the page. Never invent a phone number, fee, name or URL. Leave a clearly marked placeholder and tell the user.
3. **One restrained brand color.** The brand hue is for meaningful actions, selected states, focus and at most one brand band per page. Neutral, slightly warm surfaces carry the rest.
4. **Accessible by default.** Visible focus, a skip link, real labels, no meaning carried by color alone, 320px width, 200% zoom, light and dark mode. Long English, Filipino and regional-language labels must wrap, not overflow.
5. **Reuse before you invent.** Extend a CVA variant or a layout helper. Don't copy long class strings or add one-off colors.
6. **Honest about what it is.** A community-built site says it is independent and not an official government website, and links to the official channels.

## Non-negotiable rules

- Components use **semantic utilities only** (`bg-primary`, `text-muted-foreground`, `bg-brand`, `border-border`). No raw hex or `oklch()` in components. The one exception is translucent white on brand surfaces (`bg-white/10`, `border-white/15`, `border-white/30`).
- A new token gets a value in `:root` **and** `.dark`, a mapping in `@theme inline`, and a line in the project's design doc, all in the same change.
- **Radius follows role:** `rounded-xl` for cards, `rounded-md` for controls (buttons, inputs, toggles), `rounded-lg` for icon tiles, `rounded-full` only for chips, eyebrows, avatars and status dots.
- **Elevation has meaning:** cards rest at `border` + `shadow-xs`. Only interactive cards lift on hover. Overlays use `shadow-lg`.
- Use the Button variants **`inverse`** and **`inverse-outline`** on brand surfaces, and **`emergency`** only for tap-to-call hotlines. Emergency and destructive red never appear as decoration.
- Change how a shadcn primitive looks with a CVA variant or tokens, never with overrides at each call site.
- Icons come from **Phosphor**, always imported with the `Icon` suffix. Use `ArrowRightIcon` for in-app navigation and `ArrowUpRightIcon` for anything that opens a source or another site. Decorative icons get `aria-hidden`.
- Factual content gets a **`SourceLink`**, or a **`SourcesNote`** with the date it was checked.
- Copy and URLs live in data files (`src/data/*.ts`), not in components. Placeholder links are `#` until the official URL is confirmed.
- Keep the skip link to `#main` as the first focusable element.

## Starting a new portal

1. Scaffold Vite + React + TypeScript with Tailwind CSS v4 and shadcn/ui (`style: "radix-mira"`, `iconLibrary: "phosphor"`). Use [`assets/components.json`](assets/components.json) as the starting config.
2. Install `@phosphor-icons/react`, `@fontsource-variable/manrope`, `tw-animate-css`, `class-variance-authority` and `radix-ui`.
3. Copy [`assets/index.css`](assets/index.css) to `src/index.css`. Rebrand it for the town by following [references/rebranding.md](references/rebranding.md). Never ship Naguilian green for another town without asking the user.
4. Add the shadcn primitives you need with the shadcn CLI, then replace `button.tsx`, `badge.tsx` and `card.tsx` with the versions in [`assets/components/ui/`](assets/components/ui/). They add the `emergency`, `inverse` and `inverse-outline` variants and the card styling.
5. Copy [`assets/components/site/section.tsx`](assets/components/site/section.tsx) (`Container`, `Section`, `SectionHeading`, `SourceLink`, `PageHero`, `SourcesNote`) and, if the site lists hotlines, [`assets/components/civic/hotline-card.tsx`](assets/components/civic/hotline-card.tsx).
6. Start the data layer from [`assets/data/civic.example.ts`](assets/data/civic.example.ts): typed sources, a `lastChecked` date, hotlines, offices and Citizen's Charter services.
7. Build the shell (top bar, header, skip link, `<main id="main">`, footer) and pages as described in [references/components.md](references/components.md) and [references/civic-patterns.md](references/civic-patterns.md).
8. Set up the checks in [references/accessibility.md](references/accessibility.md) and run [`scripts/check-tokens.mjs`](scripts/check-tokens.mjs).

The asset files import from `@/lib/utils`, `@/components/...` and `@/data/...`. Adjust the paths if the project's aliases differ, and make sure `cn` is exported from `@/lib/utils` (shadcn creates it).

## Building a page or section

- Homepage blocks follow `<Section id tone>` → `<Container>` → `<SectionHeading eyebrow title description>` → content. Alternate `tone="default"` and `tone="muted"`. Use `tone="brand"` (with `SectionHeading invert`) at most once between the hero and the footer.
- Inner pages start with `PageHero` (eyebrow, `h1`, lead paragraph) and end with a `SourcesNote` when they present facts.
- Card grids: `grid gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Check every new screen at 320px, in dark mode, with only the keyboard, and with a long Filipino label.

## Reference files

Read the one you need; they aren't all needed for every task.

| File | Read it when |
| --- | --- |
| [references/foundations.md](references/foundations.md) | Choosing colors, type, spacing, radius, elevation, motion or icons |
| [references/components.md](references/components.md) | Using Button, Card, Badge, layout helpers, the header, top bar, search, or live data cards |
| [references/civic-patterns.md](references/civic-patterns.md) | Building services or Citizen's Charter pages, hotlines, officials, barangays, transparency, legislative, about/independence, feedback or offline support |
| [references/rebranding.md](references/rebranding.md) | Adapting the palette, logo and copy for a different town |
| [references/accessibility.md](references/accessibility.md) | Reviewing a page, or setting up axe, Playwright and Lighthouse checks |

## Reviewing a change

When asked to check a page or diff against this system, go through:

- [ ] Semantic color utilities only; any new token is in `:root`, `.dark`, `@theme inline` and the doc.
- [ ] Radius and shadow match the role.
- [ ] Brand surfaces use `inverse` / `inverse-outline` buttons and `text-brand-foreground` steps.
- [ ] Every fact has a source link and the data set has a checked date.
- [ ] Phosphor icons with the `Icon` suffix; correct arrow direction; decorative icons hidden.
- [ ] Copy and URLs come from data files.
- [ ] Works at 320px, 200% zoom, dark mode and keyboard only; focus ring visible.
- [ ] `node scripts/check-tokens.mjs <src-dir> <css-file>` passes.
