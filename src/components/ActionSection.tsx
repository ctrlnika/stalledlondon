import { fmt, totals } from "@/lib/metrics";

export function ActionSection() {
  return (
    <section className="action">
      <p className="eyebrow">WHAT TO DO WITH THIS</p>
      <h2>
        Stop counting permissions.
        <br />
        Start counting <em>starts</em>.
      </h2>
      <div className="action-grid">
        <p>
          <b>01 · FOR BOROUGHS</b>
          Publish a commencement date for every consent. {fmt(totals.homes)} homes are
          invisible in the delivery pipeline because nobody recorded whether they began.
        </p>
        <p>
          <b>02 · FOR THE GLA</b>
          Report lapsed permissions as a delivery metric. {fmt(totals.lapsed_homes)} homes
          expired on paper without appearing in any published shortfall.
        </p>
        <p>
          <b>03 · FOR CAMPAIGNERS</b>
          Use the register. Each evidence card carries the reference, the tenure mix and
          the source dataset, so a stalled site can be raised at a planning committee
          without new research.
        </p>
      </div>
    </section>
  );
}