import { useMemo, useState } from "react";

import { EvidenceCard } from "@/components/EvidenceCard";
import { boroughNames, fmt, sites, type Site } from "@/lib/metrics";

type SortKey = "homes" | "risk_score" | "years_since" | "affordable";

export function StalledRegister({
  borough,
  onBorough,
}: {
  borough: string | null;
  onBorough: (name: string | null) => void;
}) {
  const [flag, setFlag] = useState("all");
  const [minHomes, setMinHomes] = useState(0);
  const [sort, setSort] = useState<SortKey>("risk_score");
  const [limit, setLimit] = useState(15);
  const [open, setOpen] = useState<Site | null>(null);

  const rows = useMemo(() => {
    return sites
      .filter((s) => (borough ? s.borough === borough : true))
      .filter((s) => (flag === "all" ? true : s.flag === flag))
      .filter((s) => s.homes >= minHomes)
      .sort((a, b) => b[sort] - a[sort]);
  }, [borough, flag, minHomes, sort]);

  const visible = rows.slice(0, limit);
  const totalHomes = rows.reduce((n, s) => n + s.homes, 0);
  const totalAffordable = rows.reduce((n, s) => n + s.affordable, 0);

  return (
    <div id="register">
      <div className="controls">
        <label>
          BOROUGH
          <select
            value={borough ?? ""}
            onChange={(e) => onBorough(e.target.value || null)}
          >
            <option value="">All 33 boroughs</option>
            {boroughNames.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label>
          STATUS
          <select value={flag} onChange={(e) => setFlag(e.target.value)}>
            <option value="all">Any status</option>
            <option value="Permission lapsed">Permission lapsed</option>
            <option value="No recorded start">No recorded start</option>
          </select>
        </label>
        <label>
          MINIMUM SIZE
          <select value={minHomes} onChange={(e) => setMinHomes(Number(e.target.value))}>
            <option value={0}>Any size</option>
            <option value={100}>100+ homes</option>
            <option value={250}>250+ homes</option>
            <option value={500}>500+ homes</option>
          </select>
        </label>
        <label>
          SORT BY
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="risk_score">Stall risk score</option>
            <option value="homes">Homes consented</option>
            <option value="affordable">Affordable homes</option>
            <option value="years_since">Years since permission</option>
          </select>
        </label>
        <output>
          {fmt(rows.length)} SCHEMES · {fmt(totalHomes)} HOMES · {fmt(totalAffordable)}{" "}
          AFFORDABLE
        </output>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>SITE</th>
              <th>BOROUGH</th>
              <th>HOMES</th>
              <th>AFFORDABLE</th>
              <th>PERMISSION</th>
              <th>STATUS</th>
              <th>STALL RISK</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((s) => (
              <tr
                key={s.id}
                onClick={() => setOpen(s)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setOpen(s);
                }}
              >
                <td>
                  {s.name}
                  <small>
                    REF {s.reference}
                    {s.postcode ? ` · ${s.postcode}` : ""}
                  </small>
                </td>
                <td>{s.borough}</td>
                <td>{fmt(s.homes)}</td>
                <td>{fmt(s.affordable)}</td>
                <td>
                  {s.approved_year}
                  <small className="mono"> </small>
                </td>
                <td>
                  <span className={s.flag === "Permission lapsed" ? "flag" : "flag soft"}>
                    {s.flag.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span className="risk-cell">
                    <span className="risk-bar">
                      <i style={{ width: `${s.risk_score}%` }} />
                    </span>
                    {s.risk_score}
                  </span>
                </td>
              </tr>
            ))}
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  No schemes match these filters in the top-200 detailed register.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {limit < rows.length ? (
        <button
          type="button"
          className="outline load-more"
          onClick={() => setLimit((n) => n + 25)}
        >
          SHOW MORE ({fmt(rows.length - limit)} REMAINING)
        </button>
      ) : null}

      {open ? <EvidenceCard site={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}