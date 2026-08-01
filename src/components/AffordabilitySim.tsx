import { useMemo, useState } from "react";

import { LineChart } from "@/components/LineChart";
import {
  gbp,
  gbpShort,
  lendMultiple,
  meta,
  savingsRate,
  simulate,
} from "@/lib/affordability";
import { totals } from "@/lib/metrics";

export function AffordabilitySim() {
  const [homes, setHomes] = useState(totals.homes);
  const [elasticity, setElasticity] = useState(2);
  const [income, setIncome] = useState(meta.uk_mean_earnings_2026);

  const r = simulate({ homes, elasticity, income });

  const curve = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 20; i++) {
      const h = (totals.homes / 20) * i;
      pts.push({ x: h, y: simulate({ homes: h, elasticity, income }).newPrice });
    }
    return pts;
  }, [elasticity, income]);

  return (
    <div className="sim">
      <div className="sim-controls">
        <label>
          <span>HOMES ACTUALLY BUILT</span>
          <input
            type="range"
            min={0}
            max={totals.homes}
            step={1000}
            value={homes}
            onChange={(e) => setHomes(Number(e.target.value))}
          />
          <output className="mono">
            {homes.toLocaleString("en-GB")} of {totals.homes.toLocaleString("en-GB")}{" "}
            consented homes
          </output>
        </label>
        <label>
          <span>ASSUMED PRICE RESPONSE</span>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={elasticity}
            onChange={(e) => setElasticity(Number(e.target.value))}
          />
          <output className="mono">
            {elasticity.toFixed(1)}% real price fall per 1% added to the housing stock
          </output>
        </label>
        <label>
          <span>BUYER GROSS INCOME</span>
          <input
            type="range"
            min={20000}
            max={120000}
            step={1000}
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
          />
          <output className="mono">{gbp(income)} per year</output>
        </label>
      </div>

      <div className="sim-out">
        <article>
          <p>STOCK UPLIFT</p>
          <span>+{r.stockUpliftPct.toFixed(2)}%</span>
          <small>
            {homes.toLocaleString("en-GB")} homes against London&rsquo;s{" "}
            {(meta.london_stock / 1e6).toFixed(1)}m dwellings
          </small>
        </article>
        <article>
          <p>MODELLED AVERAGE PRICE</p>
          <span>{gbp(r.newPrice)}</span>
          <small>
            from {gbp(r.basePrice)} &middot; {r.priceChangePct.toFixed(2)}% (
            {gbp(r.priceDrop)} lower)
          </small>
        </article>
        <article>
          <p>PRICE TO INCOME</p>
          <span>{r.newRatio.toFixed(1)}×</span>
          <small>from {r.baseRatio.toFixed(1)}× at {gbp(income)} income</small>
        </article>
        <article>
          <p>DEPOSIT NEEDED</p>
          <span>{gbp(r.newDeposit)}</span>
          <small>
            from {gbp(r.baseDeposit)} at a {lendMultiple}× lending cap &middot;{" "}
            {r.newYearsToSave.toFixed(1)} yrs saving vs {r.baseYearsToSave.toFixed(1)} yrs
          </small>
        </article>
        <article>
          <p>AFFORDABLE HOMES DELIVERED</p>
          <span>{r.affordableHomes.toLocaleString("en-GB")}</span>
          <small>
            at the consented affordable share of the stalled pipeline (
            {totals.affordable.toLocaleString("en-GB")} of{" "}
            {totals.homes.toLocaleString("en-GB")})
          </small>
        </article>
      </div>

      <LineChart
        height={300}
        zeroBased={false}
        series={[
          {
            id: "curve",
            label: "Modelled London average price",
            color: "var(--orange)",
            points: curve,
          },
        ]}
        yFormat={gbpShort}
        xFormat={(v) => `${Math.round(v / 1000)}k homes`}
        yLabel="Modelled London average price against homes built"
      />

      <p className="disclaimer sim-note">
        <b>This is a scenario, not a forecast.</b> Only three inputs are measured: the{" "}
        {totals.homes.toLocaleString("en-GB")} consented homes with no recorded start
        (Planning London Datahub), London&rsquo;s average price of {gbp(meta.london_avg_price)}{" "}
        ({meta.london_price_date}, HM Land Registry UK HPI) and London&rsquo;s dwelling
        stock of {(meta.london_stock / 1e6).toFixed(1)}m (MHCLG via London Assembly
        Research Unit). The price response is <b>your assumption</b>, set with the slider —
        it is not a published figure and the result moves with it. The deposit test assumes
        lending capped at {lendMultiple}× income and saving{" "}
        {Math.round(savingsRate * 100)}% of gross pay, with no interest.
      </p>
    </div>
  );
}