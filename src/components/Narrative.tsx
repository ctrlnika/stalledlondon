import { boroughs, fmt, topBoroughs, totals } from "@/lib/metrics";

export function Narrative() {
  const stalled = topBoroughs((b) => b.stalled_homes, 6);
  const max = stalled[0]?.value ?? 1;
  const worstDelivery = Object.entries(boroughs)
    .sort((a, b) => a[1].hdt_2023_pct - b[1].hdt_2023_pct)
    .slice(0, 3);
  const slowest = Object.entries(boroughs)
    .filter(([, b]) => b.pct_within_13_weeks !== null)
    .sort((a, b) => a[1].pct_within_13_weeks! - b[1].pct_within_13_weeks!)
    .slice(0, 3);
  const affordableShare = Math.round((totals.affordable / totals.homes) * 100);

  return (
    <>
      <section className="case-study">
        <div className="case-label">
          <b>PART ONE</b>
          The pipeline is full of homes nobody is building.
        </div>
        <div className="case-content">
          <p className="case-kicker">CONSENTED, NOT COMMENCED</p>
          <h2>
            {fmt(totals.homes)} homes are stuck between{" "}
            <em style={{ color: "var(--acid)" }}>yes</em> and a building site.
          </h2>
          <div className="case-detail">
            <p className="claim">
              {fmt(totals.schemes)} residential schemes approved by London boroughs from
              2015 to 2021 have no commencement date recorded in the Planning London
              Datahub.
            </p>
            <p>
              <b>{fmt(totals.lapsed_homes)}</b> of those homes sat on permissions the
              boroughs have since recorded as lapsed — consent expired before a spade went
              in. A further <b>{fmt(totals.nostart_homes)}</b> homes hold live permission
              with no start logged. Average age of a stalled permission:{" "}
              <b>{totals.avg_years} years</b>.
            </p>
            <div className="bars">
              {stalled.map((b) => (
                <div className="bar-row" key={b.name}>
                  <span>{b.name.toUpperCase()}</span>
                  <span className="bar-track">
                    <i style={{ width: `${Math.round((b.value / max) * 100)}%` }} />
                  </span>
                  <span>{fmt(b.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="case-study" style={{ background: "#0d1a15" }}>
        <div className="case-label">
          <b>PART TWO</b>
          The affordable homes are the ones that vanish.
        </div>
        <div className="case-content">
          <p className="case-kicker">WHO THE HOMES WERE FOR</p>
          <h2>
            {affordableShare}% of the stalled homes were consented as{" "}
            <em style={{ color: "var(--acid)" }}>affordable</em>.
          </h2>
          <div className="case-detail">
            <p className="claim">
              {fmt(totals.affordable)} affordable homes were negotiated, approved and never
              started.
            </p>
            <p>
              Affordable units are usually the planning gain that justified the density.
              When a scheme stalls, that gain is not deferred — the permission lapses and
              the obligation dies with it. Meanwhile the boroughs furthest from their
              targets in the 2023 Housing Delivery Test were{" "}
              {worstDelivery.map(([n, b], i) => (
                <span key={n}>
                  {i > 0 ? ", " : ""}
                  <b>
                    {n} ({b.hdt_2023_pct}%)
                  </b>
                </span>
              ))}
              . A score below 75% triggers the presumption in favour of sustainable
              development — the government&rsquo;s formal sanction for under-delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="case-study">
        <div className="case-label">
          <b>PART THREE</b>
          Speed is agreed away, not achieved.
        </div>
        <div className="case-content">
          <p className="case-kicker">THE 13-WEEK FICTION</p>
          <h2>
            Major applications are almost never decided in the{" "}
            <em style={{ color: "var(--acid)" }}>statutory time</em>.
          </h2>
          <div className="case-detail">
            <p className="claim">
              Across London, only a fraction of major planning decisions land inside the
              13-week statutory period; the rest run on agreed extensions that count as
              &ldquo;on time&rdquo;.
            </p>
            <p>
              {slowest.map(([n, b], i) => (
                <span key={n}>
                  {i > 0 ? ", " : ""}
                  <b>
                    {n} decided {b.pct_within_13_weeks}% of {fmt(b.major_decisions ?? 0)}{" "}
                    major applications inside 13 weeks
                  </b>
                </span>
              ))}
              {" "}(MHCLG Table P151a, April 2024 &ndash; March 2026). Because performance
              is measured against extensions of time, a borough can report near-perfect
              compliance while applicants wait years. Delay at the front door and stalling
              after consent are the same story told twice.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}