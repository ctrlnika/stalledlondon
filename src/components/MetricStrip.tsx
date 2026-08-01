import { fmt, totals } from "@/lib/metrics";

export function MetricStrip() {
  const shortfall = totals.required - totals.delivered;
  const items = [
    {
      value: fmt(totals.homes),
      label: "APPROVED HOMES WITH NO RECORDED CONSTRUCTION START (2015–21 DECISIONS)",
    },
    {
      value: fmt(totals.affordable),
      label: "OF THOSE HOMES WERE CONSENTED AS AFFORDABLE TENURES",
    },
    {
      value: fmt(shortfall),
      label: "HOMES BELOW REQUIREMENT ACROSS LONDON, HOUSING DELIVERY TEST 2020–23",
    },
    {
      value: `${totals.avg_years} YRS`,
      label: "AVERAGE TIME SINCE PERMISSION WAS GRANTED ON A STALLED SCHEME",
    },
  ];

  return (
    <section className="metric-strip">
      {items.map((m) => (
        <article key={m.label}>
          <span>{m.value}</span>
          <p>{m.label}</p>
        </article>
      ))}
    </section>
  );
}