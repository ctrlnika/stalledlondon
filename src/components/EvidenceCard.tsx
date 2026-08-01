import { useEffect, useState } from "react";

import { boroughs, fmt, type Site } from "@/lib/metrics";

export function EvidenceCard({
  site,
  onClose,
}: {
  site: Site;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const row = boroughs[site.borough];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tenures = Object.entries(site.tenures).sort((a, b) => b[1] - a[1]);

  const summary = [
    `STALLED LONDON — EVIDENCE CARD`,
    `${site.name}, ${site.borough}`,
    `${fmt(site.homes)} homes consented (${fmt(site.affordable)} affordable)`,
    `Permission ${site.reference} decided ${site.decision_date} — ${site.years_since} years ago`,
    `Status: ${site.flag}${site.status ? ` (Datahub status: ${site.status})` : ""}`,
    `Borough Housing Delivery Test 2023: ${row ? `${row.hdt_2023_pct}%` : "n/a"}`,
    `Source: Planning London Datahub (GLA) residential permissions; MHCLG Housing Delivery Test 2023.`,
  ].join("\n");

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Evidence card for ${site.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="evidence">
        <button className="close" type="button" onClick={onClose} aria-label="Close">
          &times;
        </button>
        <p className="eyebrow" style={{ color: "var(--orange)" }}>
          EVIDENCE CARD · {site.borough.toUpperCase()}
        </p>
        <h2>{site.name}</h2>
        <p className="ev-sub">
          {site.street ? `${site.street} · ` : ""}
          {site.postcode ? `${site.postcode} · ` : ""}
          REF {site.reference}
        </p>

        <div className="ev-grid">
          <div>
            <b>{fmt(site.homes)}</b>
            <span>HOMES CONSENTED</span>
          </div>
          <div>
            <b>{fmt(site.affordable)}</b>
            <span>AFFORDABLE HOMES</span>
          </div>
          <div>
            <b>{site.years_since}</b>
            <span>YEARS SINCE PERMISSION</span>
          </div>
        </div>

        <div className="ev-body">
          <p>
            <span className="flag">{site.flag.toUpperCase()}</span>{" "}
            {site.application_type ? (
              <span className="mono" style={{ fontSize: 11 }}>
                {site.application_type.toUpperCase()}
              </span>
            ) : null}
          </p>
          <p>
            Permission was granted on <b>{site.decision_date}</b>
            {site.lapsed_date ? ` and is recorded as lapsed on ${site.lapsed_date}` : ""}.
            The Planning London Datahub holds no commencement date for this scheme, so{" "}
            {fmt(site.homes)} consented homes are not counted as started.
            {row
              ? ` ${site.borough} delivered ${row.hdt_2023_pct}% of its housing requirement in the 2023 Housing Delivery Test.`
              : ""}
          </p>
          {site.description ? (
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              &ldquo;{site.description}&rdquo;
            </p>
          ) : null}

          {tenures.length ? (
            <>
              <p className="mono" style={{ fontSize: 10, marginBottom: 8 }}>
                CONSENTED TENURE MIX
              </p>
              <ul className="ev-tenures">
                {tenures.map(([k, v]) => (
                  <li key={k}>
                    <span>{k}</span>
                    <span>{fmt(v)}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <div className="ev-actions">
          <button
            type="button"
            className="outline"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(summary);
                setCopied(true);
                setTimeout(() => setCopied(false), 2200);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "COPIED TO CLIPBOARD" : "COPY EVIDENCE SUMMARY"}
          </button>
          <a
            className="outline"
            href={`https://planningdata.london.gov.uk/`}
            target="_blank"
            rel="noreferrer"
          >
            OPEN PLANNING LONDON DATAHUB
          </a>
          {site.lat && site.lng ? (
            <a
              className="outline"
              href={`https://www.openstreetmap.org/?mlat=${site.lat}&mlon=${site.lng}#map=17/${site.lat}/${site.lng}`}
              target="_blank"
              rel="noreferrer"
            >
              VIEW LOCATION
            </a>
          ) : null}
        </div>

        <p className="ev-source">
          SOURCE: PLANNING LONDON DATAHUB (GREATER LONDON AUTHORITY), RESIDENTIAL UNITS AND
          APPLICATION RECORDS
          {site.last_updated ? `, RECORD LAST UPDATED ${site.last_updated}` : ""}. BOROUGH
          DELIVERY FIGURES: MHCLG HOUSING DELIVERY TEST 2023 MEASUREMENT. RECORDS ARE
          SELF-REPORTED BY BOROUGHS; A MISSING START DATE IS EVIDENCE OF A REPORTING OR
          DELIVERY GAP, NOT PROOF THE SITE IS EMPTY TODAY.
        </p>
      </div>
    </div>
  );
}