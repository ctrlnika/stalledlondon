import { Link } from "@tanstack/react-router";

import { totals } from "@/lib/metrics";

export function SiteFooter() {
  return (
    <footer className="footer">
      <p style={{ margin: 0 }}>
        STALLED LONDON · DATA RETRIEVED {totals.retrieved} · PLANNING LONDON DATAHUB (GLA),
        MHCLG HOUSING DELIVERY TEST 2023, MHCLG TABLE P151A
      </p>
      <p style={{ margin: 0 }}>
        <Link to="/sources">FULL SOURCES &amp; METHOD →</Link>
      </p>
    </footer>
  );
}