# Stalled London — implementation plan

Port the existing prototype into this React/TanStack app with the design system preserved 1:1, then extend it with the interactive borough map, a live planning feed, and shareable evidence cards.

Guiding rule from your answers: **no invented numbers.** Every displayed metric is traceable to a named source. Layers where I can't verify data get rendered as disabled tabs with an "awaiting data" state rather than plausible-looking fills.

## 1. Design system port (no visual change)

- Move the prototype palette (`--ink`, `--paper`, `--acid`, `--orange`, `--muted`, `--line`) and typography into the app's theme as semantic tokens, so components use tokens not hardcoded colors.
- Load Space Grotesk + DM Mono via a `<link>` in the root route head.
- Rebuild the prototype markup as components: `TopBar`, `Hero`, `MetricStrip`, `Explorer` (controls + table), `EvidenceCard`, `ActionSection`, `MethodDialog`. Sharp borders, no rounded corners, same scale and letter-spacing.
- The whole experience lives at `/` (replacing the placeholder index), plus a `/sources` route for data provenance.

## 2. Data acquisition (done at build time, committed as JSON)

I fetch and verify these before writing any UI numbers:

- **MHCLG Housing Delivery Test (2023 measurement)** — % of target delivered per borough. This is a published, citable figure and becomes the SUPPLY layer.
- **English Indices of Deprivation — Barriers to Housing and Services** — borough-level rank. Becomes the DEMAND layer proxy, labelled honestly as a proxy.
- **UK PlanIt API** — live planning applications for 3 boroughs (Southwark, Newham, Camden), filtered to residential keywords and large app sizes, with permission dates. Becomes the STALLED register and the STALLED layer for those 3 boroughs only.
- **Planning London Datahub** — attempted for residential unit counts (homes/affordable per scheme). If the guest endpoint responds, it powers the AFFORDABLE layer; if not, that layer ships disabled.

Anything a source doesn't give me is shown as `—` with a "no verified data" note, never estimated. Every field carries a `source` and `retrieved` date used in tooltips and the Sources page.

## 3. The interactive map

- SVG inlined as a React component (not `<img>`) so paths are directly manipulable; lazy-mounted below the fold via Intersection Observer given its size.
- Layer tabs: **DEMAND | SUPPLY | STALLED | AFFORDABLE | DELAYS**. Only layers with verified data are enabled; disabled tabs show why on hover.
- Boroughs colored by swapping `heat-0`…`heat-9` classes, driven by quantiles of the real values. Boroughs with no data get a distinct hatched "no data" fill — not heat-0.
- Hover tooltip: borough name, current metric value, source label.
- Click a borough: highlights the path, opens the **borough scorecard** panel, and filters the register below.
- Keyboard-navigable paths with ARIA labels, plus a text-table equivalent of the active layer.

## 4. Register, risk score and evidence cards

- Table columns: SITE / BOROUGH · HOMES · AFFORDABLE · APPROVED · YEARS DELAYED · FLAG · RISK SCORE.
- Risk score computed transparently (years since permission 40%, homes 30%, affordable share 20%, borough HDT 10%) with the formula shown in the Method dialog. Rows lacking inputs show "insufficient data" instead of a score.
- Filters: borough, flag, minimum homes. Sorts: homes, delay, risk, affordable.
- Evidence card per site: **Claim** (hedged wording — "appears to have stalled"), **Evidence** (record reference, permission date, borough HDT, source links), **Ask** (named body + specific action).
- Share button copies a summary plus a deep link.

## 5. Borough scorecard

Panel showing HDT %, stalled site count and homes at stake (3 boroughs only), Barriers-to-Housing rank, and comparison against the London figure — each row labelled with its source and update date, blanks where unverified.

## 6. Narrative and provenance

- Scroll-driven three-act framing around existing sections: The Problem → The Barrier → The Evidence, with the map layer advancing as each act enters view.
- Method dialog extended with the risk formula and hedging policy.
- `/sources` route: every dataset with publisher, last update, known limitations (including the GLA's own "self-reported, not quality-checked" caveat), and a direct link.

## Technical notes

- Deep links via URL search params (`?borough=southwark&site=…`) using TanStack Router `validateSearch`, so state is shareable and SSR-safe.
- PlanIt's ~1 req/min limit is respected during the offline fetch step (sequential, delayed); the app itself reads the committed JSON snapshot, so the demo never depends on a live third-party call. A server function can refresh the snapshot on demand later.
- Number count-up animation on the metric strip, respecting `prefers-reduced-motion`.
- Distinct head metadata for `/` and `/sources`.

## Risk to flag now

If the HDT release or the PlanIt/Datahub endpoints don't return usable data when I fetch them, the honest-numbers constraint means fewer live map layers than the brief lists. I'll report exactly which sources succeeded and ship the rest as disabled layers rather than filling them in.
