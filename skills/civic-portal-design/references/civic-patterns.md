# Civic patterns

Content and page patterns for a community-built local government portal in the Philippines. Types for all of these are in [`assets/data/civic.example.ts`](../assets/data/civic.example.ts).

## Facts, sources and dates

- Every factual entry carries a `source: { label, href }`. Label it with the publisher and the page (`"Municipality of X: Municipal Officials"`), not just "Source".
- Each data file exports a `lastChecked` date: the day a volunteer last verified it against the source. Update it whenever a fact changes, and show it in the page's `SourcesNote`.
- Rank sources: official LGU website or Citizen's Charter > provincial or national agency site > the agency's own official Facebook page. Mark Facebook-only entries (`sourceKind: "agency-facebook"`) and say so on the page.
- When something can't be verified, leave it out or show it as unverified. Never fill gaps with a plausible guess. Empty lists (for example barangay officials not yet published) get an empty state that says why.
- Keep printed text as printed. When transcribing a charter, only clean up line wraps, list markers and obvious typos. Omit fields the source leaves blank.
- Self-host official PDFs (the Citizen's Charter) under `public/docs/` and deep-link pages with `#page=N`, so a resident can check the exact page.

## Independence notice

A community-built site must not look like the official one.

- Say "Independent and volunteer-built — not an official government website" in the footer and on the About page, with a link to the official site.
- Never use the LGU seal as the site logo. Use a neutral mark of your own.
- Direct official transactions and announcements to the LGU's own channels.
- Give a contact (volunteer email, GitHub issues) for corrections.

## Emergency hotlines

- Pin the essentials (911, MDRRMO, police) in the top bar's emergency strip on every page, with a link to `/emergency`.
- `/emergency`: one featured `HotlineCard` (911) with `emergency` buttons, then a grid of local hotlines with `outline` call buttons. Each number is a `tel:` link with an `aria-label` that names the agency and the number, `min-h-11`, `tabular-nums`, and `PhoneCallIcon weight="fill"`.
- Store `display` (`"0921 471 6619"`) and `dial` (`"09214716619"`) separately. Label carrier lines (`Smart`, `Globe`).
- Each card ends with its source; Facebook-sourced numbers carry a note.
- Add an offline note: the page works offline once the site is installed. Add a "Report a wrong number" `mailto:` with a prefilled subject and body.

## Services (Citizen's Charter)

The Ease of Doing Business and Efficient Government Service Delivery Act (RA 11032) requires government offices, LGUs included, to publish a Citizen's Charter. It's the most useful source for a services page.

- **Model** each service: name, category, department (joins to an `offices` list), office as printed, classification, transaction types, who may avail, requirements (item, where to secure, optional group heading), steps (client step + agency actions with fee, processing time and person responsible), total time, total fees, notes, charter page number and search keywords.
- **Categories:** about 8–12, named the way residents think (Business and permits, Certificates and IDs, Taxes and payments, Health, Social services, Agriculture, Building and land, Transport, Civil registry, Environment, Facilities). Highlight about six on the homepage.
- **`/services`:** `PageHero`, a search trigger, category chips, a result count and a grid of service cards. Filter state lives in the URL.
- **`/services/:id`:** title and office, then a quick summary (total time, total fees, who may avail), a **Requirements** card (grouped by printed sub-heading; "where to secure" with `BuildingOfficeIcon`), a **Steps** card (numbered `rounded-full bg-primary` markers; agency actions in `rounded-md bg-muted/60` rows with `ReceiptIcon` fee, `ClockIcon` time and `UserIcon` responsible as a `<dl>`), and a sidebar with the office contact card and a `SourceLink` to the charter page. Unknown ids show a 404.
- Requirements and steps use `text-base` reading text: people read them while standing at a counter.
- Show the charter's **performance pledge** and **feedback mechanism** on the services page, as printed in the charter (suggestion box, feedback slips and what they ask, how complaints are handled), each with a link to its charter page.
- **Accuracy feedback** at the end of each service: "Is this information correct?" with thumbs up or down, stored only in `localStorage`. A "no" opens a short form that builds a prefilled `mailto:` or GitHub issue link. Nothing is sent from the page itself, and the page says so.

## Offices

A contact card per office: name, phone (trunk line and local), email when published, address (floor and building). Join services to offices by id. On mobile, phone and email are tappable links.

## Government pages

- `/government` with a pill sub-nav: Leadership, History, Officials, Barangays.
- **Leadership:** mayor and vice mayor, with their charter messages if published.
- **Officials:** executive and Sangguniang members as listed on the LGU's official page, with committee chairmanships if published. Department heads as printed in the charter (OIC where applicable), each linking to their office and services.
- **Barangays:** every barangay with population and the source year (PSA census or CBMS). Leave officials empty until the LGU publishes them.
- Use `Avatar` with initials, never a scraped photo, unless the photo's source and license are known.

## Legislative and transparency

- **Legislative:** what the Sangguniang Bayan does (cite RA 7160, the Local Government Code), how a measure becomes an ordinance, session schedule, and links to published ordinances and resolutions by year.
- **Transparency:** explain Full Disclosure Policy documents (annual budget, SEF, 20% development fund, procurement, trust fund) in plain language and link to the LGU's Full Disclosure page. Link out to the source; don't re-host financial documents.

## Homepage

Typical order: brand hero with the search trigger → popular services (category cards) → at-a-glance stats → weather, sun and moon → leadership → history → visit plan or map → contact. Use the `brand` tone once (the hero counts as brand).

## Language

- Write in plain English at about a grade 8 reading level, with Filipino and the regional language (Ilocano, Cebuano, …) as later locales. Disable a locale with a tooltip until it's ready rather than shipping a partial translation.
- Keep official names as printed ("Sangguniang Bayan", "Mayor's Clearance", "Cedula / Community Tax Certificate") and add the plain-language gloss beside them.
- Use Philippine formats: `₱` before amounts, `(072) 619-4917` landlines, `0917 123 4567` mobiles, Philippine Standard Time.

## Offline and low bandwidth

- Ship as an installable PWA. Precache the app shell, every route chunk and the self-hosted fonts so services and hotlines open offline. Cache large PDFs at runtime on first open.
- Show an offline banner while disconnected.
- Load large data (the charter's service list) as its own lazily imported chunk.
- Keep the Lighthouse performance budget in mind: no hero videos, no carousels, optimized SVG or WebP images.

## 404

A friendly not-found page with search, links to services and emergency hotlines, and a way to report the broken link.
