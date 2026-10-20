# Accessibility and quality checks

The target is WCAG 2.1 AA in both light and dark mode.

## Checklist

- Visible `focus-visible` ring on everything interactive, including stretched card links (ring on `after:`) and focusable wrappers around disabled controls.
- Contrast: 4.5:1 for text, 3:1 for large text and control boundaries. Check `muted-foreground` on `muted` / `accent`, and `/70` text on `brand`, in **both** themes.
- Icon-only controls have an `aria-label`. Decorative SVG has `aria-hidden`. The logo image has `alt=""` next to the visible wordmark.
- Tap-to-call and other touch-first actions reach 44px (`size="lg"` + `min-h-11`).
- Text reflows at 320px and at 200% zoom. Long labels wrap instead of truncating, except one-line status strips, which keep the full text available (for example in an `aria-label`).
- One `h1` per page; headings in order; landmarks (`header`, `nav` with labels, `main#main`, `footer`); a skip link first.
- Lists of things are real lists (`ul`/`ol`); key–value facts are `dl`; visually hidden labels (`sr-only`) where an icon stands in for a word.
- Forms have real `<label>`s, error text tied with `aria-describedby`, and never rely on color alone.
- Live data (loading, errors, offline) is announced with `role="status"` or `role="alert"`.
- Anything beyond small hover movements respects `prefers-reduced-motion`.
- Each page sets a descriptive `<title>` ("Business permit · Better Town").

## Automated checks

### axe with Playwright

Run every route in both color schemes and fail on any violation.

```ts
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const ROUTES = ['/', '/services', '/emergency', '/about']
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

for (const theme of ['light', 'dark'] as const) {
  for (const path of ROUTES) {
    test(`${path} has no WCAG A/AA violations (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme })
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
      const results = await new AxeBuilder({ page })
        .withTags(TAGS)
        // third-party embeds such as an OpenStreetMap iframe
        .exclude('iframe[title^="Map"]')
        .analyze()
      expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
    })
  }
}
```

Run the suite on a desktop and a mobile project. Also fail tests on uncaught page errors and console errors.

### Lighthouse CI

`.lighthouserc.json` assertions used by the reference project:

```json
{
  "categories:accessibility": ["error", { "minScore": 0.95 }],
  "categories:best-practices": ["error", { "minScore": 0.9 }],
  "categories:seo": ["warn", { "minScore": 0.9 }],
  "categories:performance": ["warn", { "minScore": 0.8 }]
}
```

### Token check

[`scripts/check-tokens.mjs`](../scripts/check-tokens.mjs) fails when a component uses a raw hex or `oklch()` color, or when a token is missing from `:root`, `.dark` or `@theme inline`:

```sh
node <skill-dir>/scripts/check-tokens.mjs src src/index.css
```

## CI order

lint → typecheck and build → Playwright (axe + page tests) on desktop and mobile → Lighthouse against the built site.
