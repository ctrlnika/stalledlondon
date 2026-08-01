import {
  boroughRank,
  boroughs,
  fmt,
  layers,
  rankedBoroughsCount,
  totals,
} from "@/lib/metrics";

export function BoroughScorecard({
  name,
  onClear,
}: {
  name: string | null;
  onClear: () => void;
}) {
  if (!name) {
    return (
      <aside className="scorecard">
        <header>
          <p>BOROUGH SCORECARD</p>
          <h3>All 33 boroughs</h3>
        </header>
        <div className="score-rows">
          <div className="score-row">
            <span>Approved homes, no recorded start</span>
            <b>{fmt(totals.homes)}</b>
          </div>
          <div className="score-row">
            <span>On permissions now recorded as lapsed</span>
            <b>{fmt(totals.lapsed_homes)}</b>
          </div>
          <div className="score-row">
            <span>Live consents with no start recorded</span>
            <b>{fmt(totals.nostart_homes)}</b>
          </div>
          <div className="score-row">
            <span>Homes required 2020&ndash;23 (HDT)</span>
            <b>{fmt(totals.required)}</b>
          </div>
          <div className="score-row">
            <span>Homes delivered 2020&ndash;23 (HDT)</span>
            <b>{fmt(totals.delivered)}</b>
          </div>
        </div>
        <footer>
          <p className="mono" style={{ margin: 0, fontSize: 10, color: "var(--muted)" }}>
            SELECT A BOROUGH ON THE MAP FOR ITS FULL SCORECARD.
          </p>
        </footer>
      </aside>
    );
  }

  const row = boroughs[name];
  if (!row) return null;
  const shortfall = row.homes_required_2020_23 - row.homes_delivered_2020_23;

  const rows = [
    {
      label: "Approved homes, no recorded start",
      value: fmt(row.stalled_homes),
      note: `${fmt(row.stalled_sites)} schemes`,
    },
    {
      label: "Affordable homes inside those schemes",
      value: fmt(row.stalled_affordable),
      note: row.stalled_homes
        ? `${Math.round((row.stalled_affordable / row.stalled_homes) * 100)}% of stalled homes`
        : null,
    },
    {
      label: "Housing Delivery Test 2023",
      value: `${row.hdt_2023_pct}%`,
      note: row.hdt_consequence,
    },
    {
      label: "Homes required vs delivered, 2020\u201323",
      value: `${fmt(row.homes_delivered_2020_23)}/${fmt(row.homes_required_2020_23)}`,
      note: shortfall > 0 ? `${fmt(shortfall)} short` : "requirement met",
    },
    {
      label: "Major decisions inside 13 weeks",
      value:
        row.pct_within_13_weeks === null ? "n/a" : `${row.pct_within_13_weeks}%`,
      note:
        row.major_decisions === null
          ? null
          : `of ${fmt(row.major_decisions)} major decisions`,
    },
    {
      label: "Permissions recorded as lapsed",
      value: fmt(row.lapsed_homes),
      note: `${fmt(row.lapsed_sites)} schemes`,
    },
  ];

  const stalledLayer = layers.find((l) => l.id === "stalled")!;
  const rank = boroughRank(name, stalledLayer);

  return (
    <aside className="scorecard">
      <header>
        <p>BOROUGH SCORECARD</p>
        <h3>{name}</h3>
      </header>
      <div className="score-rows">
        {rows.map((r) => (
          <div className="score-row" key={r.label}>
            <span>{r.label}</span>
            <b>
              {r.value}
              {r.note ? <small>{r.note.toUpperCase()}</small> : null}
            </b>
          </div>
        ))}
      </div>
      <footer>
        {rank ? (
          <span className="rank-pill">
            RANK {rank}/{rankedBoroughsCount} FOR STALLED HOMES
          </span>
        ) : null}
        <p style={{ marginTop: 14 }}>
          <button type="button" className="outline" onClick={onClear}>
            CLEAR SELECTION
          </button>
        </p>
      </footer>
    </aside>
  );
}