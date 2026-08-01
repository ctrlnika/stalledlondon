import { useId, useState } from "react";

export type ChartSeries = {
  id: string;
  label: string;
  color: string;
  points: { x: number; y: number }[];
  dashed?: boolean;
};

export function LineChart({
  series,
  yFormat,
  xFormat = (v) => String(v),
  height = 340,
  yLabel,
  zeroBased = true,
}: {
  series: ChartSeries[];
  yFormat: (v: number) => string;
  xFormat?: (v: number) => string;
  height?: number;
  yLabel?: string;
  zeroBased?: boolean;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [hoverX, setHoverX] = useState<number | null>(null);

  const all = series.flatMap((s) => s.points);
  if (all.length === 0) return null;
  const xs = all.map((p) => p.x);
  const ys = all.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const rawMax = Math.max(...ys);
  const rawMin = Math.min(...ys);
  const pad = (rawMax - rawMin) * 0.35 || rawMax * 0.05;
  const minY = zeroBased ? 0 : Math.max(0, rawMin - pad);
  const maxY = zeroBased ? rawMax * 1.06 : rawMax + pad;

  const W = 1000;
  const H = height;
  const padL = 78;
  const padR = 18;
  const padT = 16;
  const padB = 34;

  const sx = (x: number) => padL + ((x - minX) / (maxX - minX)) * (W - padL - padR);
  const sy = (y: number) =>
    H - padB - ((y - minY) / (maxY - minY)) * (H - padT - padB);

  const ticks = 5;
  const yTicks = Array.from(
    { length: ticks + 1 },
    (_, i) => minY + ((maxY - minY) / ticks) * i,
  );
  const xTicks: number[] = [];
  for (let y = Math.ceil(minX / 10) * 10; y <= maxX; y += 10) xTicks.push(y);

  const active = hoverX;

  return (
    <figure className="chart" aria-label={yLabel}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        onMouseLeave={() => setHoverX(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = ((e.clientX - rect.left) / rect.width) * W;
          const raw = minX + ((px - padL) / (W - padL - padR)) * (maxX - minX);
          setHoverX(Math.round(Math.min(maxX, Math.max(minX, raw))));
        }}
      >
        {yTicks.map((t) => (
          <g key={t}>
            <line
              className="grid"
              x1={padL}
              x2={W - padR}
              y1={sy(t)}
              y2={sy(t)}
            />
            <text className="axis" x={padL - 8} y={sy(t) + 4} textAnchor="end">
              {yFormat(t)}
            </text>
          </g>
        ))}
        {xTicks.map((t) => (
          <text key={t} className="axis" x={sx(t)} y={H - 12} textAnchor="middle">
            {xFormat(t)}
          </text>
        ))}
        {series.map((s) => (
          <polyline
            key={s.id}
            className={`chart-line${s.dashed ? " is-dashed" : ""}`}
            stroke={s.color}
            points={s.points.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")}
          />
        ))}
        {active !== null ? (
          <line className="cursor" x1={sx(active)} x2={sx(active)} y1={padT} y2={H - padB} />
        ) : null}
        {active !== null
          ? series.map((s) => {
              const p = s.points.find((q) => q.x === active);
              if (!p) return null;
              return (
                <circle
                  key={`${uid}-${s.id}`}
                  cx={sx(p.x)}
                  cy={sy(p.y)}
                  r={5}
                  fill={s.color}
                  stroke="var(--paper)"
                  strokeWidth={2}
                />
              );
            })
          : null}
      </svg>
      <figcaption>
        <ul className="chart-legend">
          {series.map((s) => (
            <li key={s.id}>
              <i style={{ background: s.color }} />
              {s.label}
              {active !== null
                ? (() => {
                    const p = s.points.find((q) => q.x === active);
                    return p ? <b>{yFormat(p.y)}</b> : null;
                  })()
                : null}
            </li>
          ))}
        </ul>
        <span className="mono chart-readout">
          {active !== null ? xFormat(active) : `${xFormat(minX)}–${xFormat(maxX)}`}
        </span>
      </figcaption>
    </figure>
  );
}