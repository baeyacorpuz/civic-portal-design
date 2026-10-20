# civic-portal-design

A [Claude Code](https://claude.com/claude-code) plugin with the design system and civic patterns behind [Better Naguilian](https://github.com/baeyacorpuz/betternaguilianlu), a volunteer-built portal for Naguilian, La Union.

Use it to build a community portal for another Philippine town, city, province or barangay that has the same calm, sourced, accessible feel, with your own brand color.

## What's inside

```
skills/civic-portal-design/
├── SKILL.md                    principles, rules, setup and review checklist
├── references/
│   ├── foundations.md          color, type, spacing, shape, elevation, motion, icons
│   ├── components.md           Button, Card, Badge, layout helpers, shell, search, data cards
│   ├── civic-patterns.md       sources, hotlines, Citizen's Charter services, officials, transparency
│   ├── rebranding.md           swapping the brand hue and identity for another town
│   └── accessibility.md        WCAG 2.1 AA checklist, axe + Playwright, Lighthouse
├── assets/
│   ├── index.css               OKLCH tokens (light + dark) for Tailwind CSS v4
│   ├── components.json         shadcn/ui config (radix-mira, Phosphor icons)
│   ├── components/ui/          button, badge, card with the extra variants
│   ├── components/site/        Container, Section, SectionHeading, SourceLink, PageHero, SourcesNote
│   ├── components/civic/       HotlineCard
│   └── data/civic.example.ts   typed data layer: sources, hotlines, offices, charter services
└── scripts/check-tokens.mjs    fails on raw colors in components or missing dark/theme tokens
```

Stack: React, TypeScript, Tailwind CSS v4, shadcn/ui on Radix, Phosphor icons, Manrope. The rules themselves (sourcing, tokens, radius by role, accessibility) apply to any stack.

## Install

In Claude Code:

```
/plugin marketplace add baeyacorpuz/civic-portal-design
/plugin install civic-portal-design@civic-portal-design
```

Then ask for what you need, for example:

- "Start a portal for San Juan, La Union using the civic portal design, in a teal brand color."
- "Build the emergency hotlines page."
- "Add a Citizen's Charter service detail page."
- "Review this page against the civic portal design."

Claude loads the skill when the task matches. You can also copy `skills/civic-portal-design/` into a project's `.claude/skills/` folder to use it without the plugin.

## Check tokens without Claude

```sh
node skills/civic-portal-design/scripts/check-tokens.mjs src src/index.css
```

## Keeping it in sync

Better Naguilian's [`docs/design/design-system.md`](https://github.com/baeyacorpuz/betternaguilianlu/blob/main/docs/design/design-system.md) stays that project's own contract. When a rule or token changes there and it applies to every portal, update this plugin too and bump `version` in `.claude-plugin/plugin.json`.

## Contributing

Issues and pull requests are welcome, especially patterns from other community-built LGU portals.

This plugin is not affiliated with any government office.

## License

[MIT](LICENSE)
