# Stalled London Uncovered

LOVABLE PROMPT: STALLED LONDON — WINNING HACKATHON PRODUCT

House London #0 / Data Track / £150 Prize

🎯 THE BRIEF

Build "Stalled London" — an interactive data storytelling platform that answers the question: "Where are the homes London was promised, and why aren't they being built?"

This is NOT a toy dashboard. It is a narrative data investigation designed for policy campaigners, local councillors, journalists, and housing advocates. The goal is to make the gap between "planning permission granted" and "homes actually delivered" visceral, actionable, and impossible to ignore.

You already have:

index.html — the page structure and content

styles.css — the complete design system (Space Grotesk + DM Mono, editorial palette)

app.js — the demo data table with filtering/sorting/case-study selection

london-boroughs-map.svg — an interactive SVG map of all 33 London boroughs with data-borough attributes and heatmap CSS classes

Preserve the existing design system exactly. Do not change fonts, colors, or the editorial layout. Extend it.

🏆 WINNING STRATEGY

The winning product will tell a three-act data story:

THE PROBLEM (Demand vs Supply Mismatch) — Where is housing need greatest? Where is supply failing?

THE BARRIER (Planning Outcomes) — Can we predict or explain why some applications succeed and others stall?

THE EVIDENCE (Stalled Sites Register) — Which specific, named schemes have permission but no recorded start?

This combines Brief DB (Where should London actually build?), Brief DD (What does the approvals data say?), and Brief DE (Who's sitting on land?) into one coherent narrative arc.

🎨 DESIGN SYSTEM (PRESERVE EXACTLY)

css

:root {
  --ink: #12231c;
  --paper: #f5f0e5;
  --acid: #ceff48;
  --orange: #ff6942;
  --muted: #66716a;
  --line: #b8b7ac;
}

Headings: Space Grotesk, tight letter-spacing (-0.08em to -0.1em), large scale

Body/UI: Space Grotesk 400-700

Labels/Mono: DM Mono, 10-11px, uppercase labels

Editorial feel: High contrast, newspaper-like, no rounded corners, sharp borders

Accent: Use --acid (#ceff48) for highlights and --orange (#ff6942) for warnings/flags

Responsive: Mobile collapses to single column, table hides some columns

🗺️ THE INTERACTIVE LONDON MAP

The SVG map (london-boroughs-map.svg) is the hero component. It must:

Load inline as an SVG element (not an <img> tag) so JS can manipulate paths directly

Support multiple data layers toggled via a layer selector:

Demand Pressure (from WhereToBuild / Census overcrowding) — heat scale: low (paper) → high (orange)

Supply Delivery (from GLA Datahub / Housing Delivery Test) — heat scale: low delivery (orange) → high delivery (acid green)

Stalled Sites Count (from planning data) — number of flagged sites per borough

Affordable Housing Gap (from GLA affordable housing data)

Planning Delays (from MHCLG P152/P154 timeliness data)

Color dynamically by adding/removing CSS classes like .heat-0 through .heat-9 or .acid-heat-0 through .acid-heat-9 on each borough path

Show a tooltip on hover with borough name + current metric value

Filter the table below when a borough is clicked (highlight that borough in the map, filter sites table)

Animate transitions between layers with CSS transitions on fill and opacity

Map interaction pattern:

JavaScript

// Example: color boroughs by data
boroughPaths.forEach(path => {
  const boroughName = path.dataset.borough;
  const value = data[boroughName]; // 0-9 scale
  path.className.baseVal = `borough heat-${value}`;
});

📊 DATA SOURCES & APIs

PRIMARY APIs (Use these for live data where possible)

1. UK PlanIt API — Planning Applications (London-wide)

The closest thing to a unified London planning feed. Rate-limited to ~1 req/min. Build with caching.

Base URL: https://planit.org.uk/api/

Endpoints:

GET /applics/json?auth={borough}&start_date=2020-01-01&end_date=2026-07-31&pg_sz=100 — applications by borough

GET /applics/json?bbox=-0.51,51.28,0.33,51.70&start_date=2020-01-01&pg_sz=100 — spatial query for London bounding box

GET /areas/json?pg_sz=400 — list of all authorities (find London borough IDs)

Key fields: authority_name, address, postcode, lat, lng, start_date, decided_date, app_state (Permitted/Rejected/Undecided), app_size (Large/Medium/Small), app_type (Full/Outline/Amendment), description, url

Rate limit: ~1 request per minute. Implement request queuing with 65-second delays between boroughs.

Filter for housing: Search description for keywords: "residential", "dwelling", "home", "flat", "apartment", "housing", "affordable", "units"

2. Planning Data API (planning.data.gov.uk) — Constraints & Designations

100+ planning datasets in one schema.

Base URL: https://www.planning.data.gov.uk/

Entity search: GET /entity.json?dataset={dataset-name}&limit=100

Key datasets for housing:

brownfield-land — statutory registers of developable land

green-belt — constraint layer

conservation-area — constraint layer

article-4-direction-area — constraint layer

flood-risk-zone — constraint layer

local-planning-authority — boundary data

Spatial query: GET /entity.json?latitude={lat}&longitude={lon}&dataset=brownfield-land&limit=50

Bulk download: Each dataset page has CSV/GeoJSON/Parquet bulk download links

3. Planning London Datahub API (GLA)

Official London planning data — applications, residential units, decisions.

Base URL: https://planningdata.london.gov.uk/api-guest/

Header required: X-API-AllowRequest: be2rmRnt&

Endpoints (Elasticsearch v7.9):

GET /applications/_search — search all applications

GET /applications/_source/{id} — specific application (id format: {Borough}-{Reference})

GET /residential_units/_search — residential unit details

Query example:

JSON

{
  "query": {
    "bool": {
      "must": [
        { "match": { "application_type": "Full Application" } },
        { "range": { "decision_date": { "gte": "2020-01-01" } } }
      ]
    }
  },
  "size": 100
}

4. HM Land Registry Price Paid Data

SPARQL endpoint: http://landregistry.data.gov.uk/app/ppd/sparql (no auth required)

Bulk CSV: https://www.gov.uk/government/statistical-data-sets/price-paid-data-downloads

Use for: transaction prices, dates, addresses, property types, new-build flags

Link to EPC: Use address matching to join with EPC data for floor area

5. MHCLG Housing Delivery Test

Data: https://www.gov.uk/government/collections/housing-delivery-test

Latest: 2023 measurement published Dec 2024

Format: ODS/PDF with %-delivered-vs-required per borough

Key metric: % of target delivered (95% = action plan, 85% = buffer, 75% = presumption in favour)

6. English Indices of Deprivation 2025

URL: https://deprivation.communities.gov.uk/

Key domain: "Barriers to Housing and Services" (LSOA-level)

Use: As a need-side proxy alongside Census data

Format: Bulk CSV via Local Deprivation Explorer

7. ONS Census 2021

URL: https://www.nomisweb.co.uk/sources/census_2021

Key tables: Household composition, overcrowding, tenure mix, dwelling counts

Geography: LSOA / MSOA / Borough

8. GLA Housing Data

Housing in London report: https://data.london.gov.uk/dataset/housing-london/

Residential starts/completions: https://data.london.gov.uk/dataset/residential-starts-dashboard-240w5 (Power BI — no bulk download, use for reference)

Affordable Housing Programme Outturn: https://data.london.gov.uk/dataset/gla-affordable-housing-programme-outturn-2o8xd (XLSX, quarterly)

Opportunity Areas: https://data.london.gov.uk/dataset/opportunity-areas-epr7z (GeoPackage)

FALLBACK DATA STRATEGY

Since this is a one-day hackathon, do not attempt to fetch all live data in real-time. Instead:

Pre-fetch and cache: Create a data/ folder with JSON files fetched ahead of time or at build time

Use static snapshots: Download CSVs/JSONs from the sources above and commit them to the repo

Mock with real structure: If an API is down, use the real response structure with representative sample data

Focus on one borough for depth: Pick 2-3 boroughs (e.g., Camden, Southwark, Newham) and get complete data for them, rather than thin data for all 33

🏗️ FEATURE REQUIREMENTS

1. Hero Section with Live Metrics

Keep the existing metric strip but make it data-driven

Metrics to show:

Total homes with permission but no start (from planning data)

Total affordable homes at stake (from affordable housing data)

Average years since approval (from decision dates)

Number of stalled sites flagged (count from dataset)

Animate numbers counting up on page load

2. Interactive Borough Map (NEW — replaces/supplements the hero)

Full-width section below hero

Layer selector tabs: DEMAND | SUPPLY | STALLED | AFFORDABLE | DELAYS

Map colors update instantly when layer changes

Legend showing scale

Click a borough → scrolls to table, filters to that borough, highlights map path

3. The Stalled Sites Register (ENHANCE existing)

Keep the existing table but connect to real data

Columns: SITE / BOROUGH | HOMES | AFFORDABLE | APPROVED | YEARS DELAYED | FLAG | RISK SCORE

Risk Score: A computed 0-100 score based on:

Years since approval (weight: 40%)

Homes at stake (weight: 30%)

Affordable homes % (weight: 20%)

Borough HDT performance (weight: 10%)

Sort by: Homes at stake | Longest delay | Risk Score | Affordable homes

Filter by: Borough | Status flag | Minimum homes threshold

4. Evidence Cards (ENHANCE existing)

When a site is selected, show:

The Claim: "X homes, including Y affordable, have had permission since Z but no recorded start"

The Evidence: Pull in surrounding data — nearby transactions, comparable delivery rates, borough HDT score

The Ask: A specific, actionable policy ask (e.g., "The Mayor should publish a transparent pipeline...")

Share button: Generate a tweetable/LinkedIn-able summary with a unique URL hash

5. Borough Scorecard (NEW)

When a borough is selected from the map, show a side panel or modal with:

Housing Delivery Test result (% of target)

Demand-to-supply ratio (from WhereToBuild or Census proxies)

Stalled sites count + total homes at stake

Average planning decision time (P152/P154)

"Barriers to Housing" deprivation rank

Comparison to London average

6. Data Story Narrative (NEW)

Add a scroll-driven narrative section that walks through:

"London needs X homes by Y" (Census + HDT data)

"But permissions are stalling" (Planning data + map visualization)

"Here's where the gap is worst" (Borough scorecards + evidence cards)

"This is what we should do" (Policy asks + shareable outputs)

Use scroll-triggered animations (Intersection Observer) to reveal map layers as user scrolls

7. Method & Data Provenance

Keep the existing Method dialog

Add a "Data Sources" page/section listing every dataset with:

Source name and publisher

Last update date

Known limitations (from the Data Asset Register)

Direct download/API link

💻 TECHNICAL ARCHITECTURE

plain

/index.html          — Main page (preserve existing structure)
/styles.css          — Design system (preserve, add map styles)
/app.js              — Main application logic
/data/
  /planning/         — Cached planning application data
  /demand/           — Census, deprivation, WhereToBuild proxies
  /supply/           — HDT, GLA completions, EPCs
  /constraints/      — Brownfield, green belt, conservation areas
  /boroughs.json     — Aggregated borough-level metrics for the map
/map/
  london-boroughs-map.svg  — Inline SVG (load via fetch + insert into DOM)

Key Technical Decisions:

No framework — Vanilla JS to keep it lightweight and hackathon-fast

DuckDB or SQLite — If doing client-side analysis, use DuckDB-WASM for fast SQL queries on CSV/Parquet

Lazy loading — Fetch borough data only when selected

Service Worker — Cache API responses for offline demo reliability

Hash-based routing — #borough=camden&site=123 for shareable deep links

📋 IMPLEMENTATION PRIORITY (One-Day Hackathon)

MUST HAVE (MVP for judging):

[ ] Load SVG map inline and color it with static borough-level data

[ ] Connect table to at least one real data source (even if just 2-3 boroughs)

[ ] Working evidence cards with real claims/asks

[ ] Layer toggle on map (even if only 2 layers work)

[ ] Responsive design preserved

SHOULD HAVE (Polish):

[ ] All 33 boroughs with real data on map

[ ] Risk score calculation

[ ] Borough scorecard modal

[ ] Shareable URLs

[ ] Scroll narrative

NICE TO HAVE (If time):

[ ] Real-time API fetching with caching

[ ] DuckDB-WASM for client-side querying

[ ] Export to CSV/PNG

[ ] Print stylesheet for PDF reports

🧪 SAMPLE DATA STRUCTURE

Pre-aggregate borough data into data/boroughs.json:

JSON

{
  "Camden": {
    "hdt_2023": 53,
    "demand_pressure": 8.2,
    "stalled_sites": 12,
    "stalled_homes": 2840,
    "stalled_affordable": 890,
    "avg_decision_weeks": 18,
    "barriers_to_housing_rank": 245,
    "price_per_sqm": 8450,
    "empty_homes": 1240
  },
  "Southwark": {
    ...
  }
}

Pre-fetch planning applications into data/planning/:

JSON

[
  {
    "id": "Southwark-22/AP/1234",
    "borough": "Southwark",
    "name": "Elephant & Castle Phase 3",
    "address": "1-10 Elephant Road, London SE1 6PT",
    "homes": 540,
    "affordable": 162,
    "approved": "2022-03-15",
    "status": "No recorded start",
    "lat": 51.4951,
    "lng": -0.1005,
    "description": "Demolition and redevelopment to provide 540 residential units...",
    "risk_score": 87
  }
]

🎤 PITCH NARRATIVE (For Demo)

"London has a housing crisis. But it also has a data crisis — we don't know where the promised homes are.

Stalled London joins planning permissions to delivery records and makes the gap visible.

[SHOW MAP] This map shows where demand outstrips supply 5-to-1.
[TOGGLE LAYER] And this shows where permissions have been granted but construction hasn't started.
[CLICK BOROUGH] In Southwark, 12 major schemes are stalled. This one — 540 homes, 162 affordable — was approved in 2022. No recorded start.
[SHOW EVIDENCE CARD] The evidence card gives you the claim, the data, and the specific policy ask. Share it with a councillor, a journalist, or the Mayor.

This isn't just a map. It's a case for intervention."

⚠️ IMPORTANT NOTES

Data quality: The GLA flags its own Datahub data as "not quality-checked — self-reported by boroughs." Be honest about limitations. Add a "Data Quality" badge to each metric.

Rate limits: UK PlanIt is run by one volunteer. Respect the ~1 req/min limit. Cache everything.

No assertions without evidence: Every claim must be traceable to a dataset. Use "appears to have stalled" not "is stalled."

Accessibility: Ensure map is keyboard-navigable and has ARIA labels. Provide a text-only table view.

Performance: The SVG map is ~570KB. Lazy-load it below the fold. Use loading="lazy" or Intersection Observer.

🔗 QUICK REFERENCE LINKS

Planning Data API docs: https://www.planning.data.gov.uk/docs

UK PlanIt API: https://www.planit.org.uk/api/ (base: https://planit.org.uk/api/)

Planning London Datahub API: https://planningdata.london.gov.uk/api-guest/ (header: X-API-AllowRequest: be2rmRnt&)

Land Registry Price Paid: http://landregistry.data.gov.uk/app/ppd/sparql

Housing Delivery Test: https://www.gov.uk/government/collections/housing-delivery-test

English Indices of Deprivation: https://deprivation.communities.gov.uk/

ONS Census 2021: https://www.nomisweb.co.uk/sources/census_2021

GLA Datastore: https://data.london.gov.uk/

✅ SUCCESS CRITERIA

The product wins if a non-technical person can:

Look at the map and immediately see which boroughs are failing to deliver

Click a borough and understand WHY it's failing (HDT score, delays, stalled sites)

Click a stalled site and get a shareable, evidence-based claim with a policy ask

Trust the data because sources and limitations are transparent

Want to send it to their councillor

Make the cost of delay visible. Make the next step obvious. Key APIs Researched & Documented in the Prompt

The prompt includes exact endpoints, auth headers, and rate-limit guidance for:

UK PlanIt API (planit.org.uk/api/) — the only London-wide planning applications feed; ~1 req/min rate limit with caching strategy

Planning London Datahub API — GLA's official Elasticsearch API with guest access header X-API-AllowRequest: be2rmRnt&

Planning Data API (planning.data.gov.uk) — 100+ datasets (brownfield land, green belt, conservation areas, article 4)

HM Land Registry Price Paid — SPARQL endpoint + bulk CSV downloads

MHCLG Housing Delivery Test — borough-level % delivered vs required

English Indices of Deprivation 2025 — "Barriers to Housing and Services" domain

ONS Census 2021 — overcrowding, tenure, household composition

GLA Datastore — affordable housing outturn, opportunity areas

Why This Wins

The prompt is designed so Lovable produces something that:

Opens with impact — the map immediately shows the crisis geography

Rewards exploration — click any borough for a scorecard; click any site for an evidence card

Is shareable — every stalled site generates a tweetable claim + specific policy ask

Is honest about data quality — limitations are surfaced, not hidden

Works offline — fallback to pre-cached JSON snapshots for demo reliability

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fccf5223-8caf-4d6d-8e63-62f41ae09950).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
