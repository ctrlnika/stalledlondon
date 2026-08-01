import { fmt, totals } from "@/lib/metrics";

export function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">
          LONDON HOUSING · CONSENTED BUT UNBUILT · DATA TO {totals.retrieved}
        </p>
        <h1>
          PERMISSION
          <br />
          GRANTED.
          <br />
          <em>Nothing built.</em>
        </h1>
        <p className="intro">
          London&rsquo;s housing crisis is not only a planning-permission problem.{" "}
          <strong>{fmt(totals.homes)} homes</strong> approved by London boroughs between
          2015 and 2021 still have no recorded construction start — an average of{" "}
          {totals.avg_years} years after the decision. This platform maps where they are,
          who they were promised to, and which borough they belong to. Every figure is
          traceable to a published government dataset.
        </p>
      </div>
      <aside className="thesis">
        <span className="pulse" />
        <p>THE THESIS</p>
        <strong>
          The pipeline is not empty. It is jammed — and {fmt(totals.affordable)} of the
          jammed homes were the affordable ones.
        </strong>
        <p className="thesis-foot">
          Sources: Planning London Datahub (GLA), MHCLG Housing Delivery Test 2023, MHCLG
          planning performance Table P151a.
        </p>
      </aside>
    </section>
  );
}