import { Link } from "@tanstack/react-router";

import { totals } from "@/lib/metrics";

export function TopBar() {
  return (
    <header className="topbar">
      <Link to="/" className="logo">
        STALLED<span>.</span>LONDON
      </Link>
      <p className="mono" style={{ margin: 0 }}>
        {totals.schemes.toLocaleString("en-GB")} consented schemes · no recorded start
      </p>
      <nav>
        <a href="/#map">Map</a>
        <a href="/#register">Register</a>
        <Link to="/simulation" activeProps={{ className: "is-active" }}>
          Simulation
        </Link>
        <Link to="/sources" activeProps={{ className: "is-active" }}>
          Sources
        </Link>
      </nav>
    </header>
  );
}