import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AffordabilitySim } from "@/components/AffordabilitySim";
import { LineChart } from "@/components/LineChart";
import { SiteFooter } from "@/components/SiteFooter";
import { TopBar } from "@/components/TopBar";
import { gbpShort, meta, series, withPrices } from "@/lib/affordability";
import { fmt, totals } from "@/lib/metrics";

const title = "If the stalled homes were built — prices & affordability | Stalled London";
const description =
  "A transparent scenario for London house prices and affordability if the 100,477 approved-but-unstarted homes were completed, plus 50 years of house prices against average earnings.";

export const Route = createFileRoute("/simulation")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Simulation,
});

type Mode = "real" | "ratio";

function Simulation() {
  const [mode, setMode] = useState<Mode>("real");
  const first = withPrices[0]!;
  const last = withPrices[withPrices.length - 1]!;
  const peak = withPrices.reduce((a, b) =>
    (b.price_real ?? 0) > (a.price_real ?? 0) ? b : a,
  );
  const peakRatio = withPrices.reduce((a, b) => ((b.ratio ?? 0) > (a.ratio ?? 0) ? b : a));
  const earnPeak = series.reduce((a, b) => (b.earn_real > a.earn_real ? b : a));
  return (
    <>
      <TopBar />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">SCENARIO · PRICES &amp; AFFORDABILITY</p>
            <h1>
              WHAT IF THEY
              <br />
              WERE <em>built?</em>
            </h1>
            <p className="intro">
              London has {fmt(totals.homes)} homes with planning permission and no recorded
              construction start. This page does two things: it shows{" "}
              <strong>fifty years of house prices against average pay</strong>, and it lets
              you run a transparent scenario for what completing those consents could do to
              the average London price and to the deposit a buyer needs. Every measured
              input is named; every assumption is a slider you control.
            </p>
          </div>
          <aside className="thesis">
            <span className="pulse" />
            <p>THE ARITHMETIC</p>
            <strong>
              A home cost {first.ratio}× average annual pay in {first.year}. It costs{" "}
              {last.ratio}× today.
            </strong>
            <p className="thesis-foot">
              Sources: Nationwide Building Society house price index (quarterly data
              averaged to annual); ONS NES/ASHE and Average Weekly Earnings.
            </p>
          </aside>
        </section>
        <section className="explorer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE HISTORY · 1975 &ndash; {last.year}</p>
              <h2>
                Fifty years of
                <br />
                <em>affording</em> a home.
              </h2>
            </div>
            <p className="disclaimer">
              House prices are the Nationwide index, quarterly data averaged to give
              approximate annual figures. Real prices are RPI-adjusted; earnings are mean
              gross annual pay for all employees, CPI-adjusted to 2026 prices. {last.year}{" "}
              covers part-year data and 2026 pay is an estimate — both are labelled as such
              in the provenance section below.
            </p>
          </div>
          <div className="chart-tabs">
            <button
              type="button"
              className={mode === "real" ? "is-active" : ""}
              onClick={() => setMode("real")}
            >
              <b>PRICE VS PAY</b>
              <i>both in today&rsquo;s money</i>
            </button>
            <button
              type="button"
              className={mode === "ratio" ? "is-active" : ""}
              onClick={() => setMode("ratio")}
            >
              <b>YEARS OF PAY</b>
              <i>price ÷ annual earnings</i>
            </button>
          </div>
          {mode === "real" ? (
            <LineChart
              series={[
                {
                  id: "price",
                  label: "Average house price (real)",
                  color: "var(--orange)",
                  points: withPrices.map((r) => ({ x: r.year, y: r.price_real! })),
                },
                {
                  id: "earn",
                  label: "Average annual earnings (2026 prices)",
                  color: "#2f4f40",
                  points: series.map((r) => ({ x: r.year, y: r.earn_real })),
                },
              ]}
              yFormat={gbpShort}
              yLabel="Real house prices and real earnings, 1975 onwards"
            />
          ) : (
            <LineChart
              series={[
                {
                  id: "ratio",
                  label: "House price as a multiple of average annual pay",
                  color: "var(--orange)",
                  points: withPrices.map((r) => ({ x: r.year, y: r.ratio! })),
                },
              ]}
              yFormat={(v) => `${v.toFixed(1)}×`}
              yLabel="House price to earnings ratio, 1975 onwards"
            />
          )}
          <div className="metric-strip">
            <article>
              <span>{peakRatio.ratio}×</span>
              <p>
                PEAK PRICE-TO-PAY MULTIPLE, REACHED IN {peakRatio.year} — UP FROM{" "}
                {first.ratio}× IN {first.year}
              </p>
            </article>
            <article>
              <span>{gbpShort(peak.price_real!)}</span>
              <p>
                HIGHEST REAL AVERAGE HOUSE PRICE ON THE NATIONWIDE SERIES, IN {peak.year}
              </p>
            </article>
            <article>
              <span>{gbpShort(earnPeak.earn_real)}</span>
              <p>PEAK REAL AVERAGE ANNUAL PAY, IN {earnPeak.year}</p>
            </article>
            <article>
              <span>{Math.round((peak.price_real! / first.price_real! - 1) * 100)}%</span>
              <p>
                REAL HOUSE PRICE GROWTH FROM {first.year} TO THE {peak.year} PEAK, AFTER
                INFLATION
              </p>
            </article>
          </div>
        </section>
        <section className="explorer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE SIMULATION · {fmt(totals.homes)} HOMES</p>
              <h2>
                Build the backlog,
                <br />
                <em>move</em> the price.
              </h2>
            </div>
            <p className="disclaimer">
              Adding homes to a market lowers prices relative to where they would otherwise
              be. How much depends on how responsive demand is — a contested question, so it
              is left as your assumption rather than presented as a finding. Drag the
              sliders to see the range of outcomes.
            </p>
          </div>
          <AffordabilitySim />
        </section>
        <section className="explorer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PROVENANCE</p>
              <h2>
                Where these
                <br />
                numbers <em>come from</em>.
              </h2>
            </div>
          </div>
          <div className="source-card">
            <b>HOUSE PRICES</b>
            <p>{meta.price_source}.</p>
            <p>
              <a
                href="https://www.nationwidehousepriceindex.co.uk/download-data"
                target="_blank"
                rel="noreferrer"
              >
                nationwidehousepriceindex.co.uk →
              </a>
            </p>
          </div>
          <div className="source-card">
            <b>EARNINGS</b>
            <p>{meta.earnings_source}.</p>
          </div>
          <div className="source-card">
            <b>SIMULATION INPUTS</b>
            <p>{meta.london_price_source}.</p>
            <p>{meta.london_stock_source}.</p>
            <p>
              Stalled homes: Planning London Datahub, {fmt(totals.homes)} consented homes
              with no recorded commencement from 2015&ndash;2021 decisions, retrieved{" "}
              {totals.retrieved}.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}