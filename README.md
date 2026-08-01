# Stalled London

An interactive data storytelling platform that visualises London's stalled housing pipeline and the affordability gap it creates.

Built for the **Lovable Data Freestyle hackathon**, it turns planning and housing data into an explorable story: an interactive borough map, a stalled sites register, and a simulation of what it would mean if London's approved-but-unbuilt homes were actually delivered.

## What it covers

- **Live metrics** — total stalled units, approvals with no construction start, and estimated years of missing supply.
- **Interactive London map** — switch between demand pressure, supply delivery, stalled site counts, and affordability gap layers.
- **Stalled sites register** — browse high-risk sites by borough, age of permission, and size.
- **Affordability simulation** — model how building the ~100,000 approved-but-unstarted homes would affect London prices and buyer affordability.
- **Historical context** — decades of UK house prices vs. earnings, sourced from Nationwide and the ONS.

## Data sources

- UK PlanIt / Planning Data API (gov.uk)
- Planning London Datahub (GLA)
- MHCLG Housing Delivery Test
- Land Registry / HM Revenue and Customs
- ONS Census 2021 and Average Weekly Earnings
- Nationwide Building Society house price index

## Tech stack

- **Framework:** TanStack Start (React 19, SSR/SSG)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Build tool:** Vite 7
- **Data processing:** Python (Python 3, pandas, requests)
- **Deployment:** Cloudflare Workers (edge)

## Development

Requires Node.js and a package manager (`npm` / `bun`):

```sh
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

Open the local dev server at `http://localhost:8080`.

## Build

```sh
bun run build
```

The project is designed to run on the edge as a Cloudflare Worker, with `nodejs_compat` enabled for TanStack Start's server functions.

---

Built with [Lovable](https://lovable.dev).
