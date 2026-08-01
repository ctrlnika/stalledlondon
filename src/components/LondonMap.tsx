import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
  boroughs,
  heatClass,
  layerById,
  layers,
  type LayerId,
} from "@/lib/metrics";
import { BoroughScorecard } from "@/components/BoroughScorecard";

type Geo = {
  viewBox: string;
  boroughs: { name: string; d: string }[];
  labels: { x: number; y: number; dy: number; text: string }[];
};

const normalise = (s: string) => s.replace(/\s*&\s*/g, " and ").trim();

export function LondonMap({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (name: string | null) => void;
}) {
  const [layerId, setLayerId] = useState<LayerId>("stalled");
  const [hovered, setHovered] = useState<string | null>(null);
  const layer = layerById(layerId);

  const { data: geo } = useQuery({
    queryKey: ["london-geo"],
    queryFn: async (): Promise<Geo> => {
      const res = await fetch("/data/london-boroughs.json");
      if (!res.ok) throw new Error("Could not load borough geometry");
      return res.json();
    },
    staleTime: Infinity,
  });

  const labelGroups = new Map<string, { x: number; y: number; parts: typeof geo.labels }>();
  for (const l of geo?.labels ?? []) {
    const key = `${l.x},${l.y}`;
    const g = labelGroups.get(key) ?? { x: l.x, y: l.y, parts: [] };
    g.parts.push(l);
    labelGroups.set(key, g);
  }

  const active = hovered ?? selected;
  const activeRow = active ? boroughs[active] : undefined;
  const activeValue = activeRow ? layer.value(activeRow) : null;

  return (
    <div className="map-layout" id="map">
      <div>
        <div className="layer-selector" role="group" aria-label="Data layer">
          {layers.map((l) => (
            <button
              key={l.id}
              type="button"
              className={l.id === layerId ? "is-active" : undefined}
              aria-pressed={l.id === layerId}
              onClick={() => setLayerId(l.id)}
            >
              <b>{l.label.toUpperCase()}</b>
              <i>{l.unit}</i>
            </button>
          ))}
        </div>

        <div className="map-frame">
          {geo ? (
            <svg
              viewBox={geo.viewBox}
              role="img"
              aria-label={`Map of London boroughs shaded by ${layer.label}`}
              className={layer.ramp}
            >
              <g>
                {geo.boroughs.map((b) => {
                  const heat = heatClass(layer, b.name);
                  return (
                    <path
                      key={b.name}
                      d={b.d}
                      className={[
                        "borough",
                        heat,
                        selected === b.name ? "is-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onMouseEnter={() => setHovered(b.name)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => onSelect(selected === b.name ? null : b.name)}
                    >
                      <title>{`${b.name} — ${
                        boroughs[b.name] && layer.value(boroughs[b.name]!) !== null
                          ? layer.format(layer.value(boroughs[b.name]!)!)
                          : "no data"
                      }`}</title>
                    </path>
                  );
                })}
              </g>
              <g>
                {[...labelGroups.values()].map((g) => {
                  const name = normalise(g.parts.map((p) => p.text).join(" "));
                  const heat = heatClass(layer, name);
                  const dark = heat === "heat-8" || heat === "heat-9";
                  return g.parts.map((p, i) => (
                    <text
                      key={`${g.x}-${g.y}-${i}`}
                      x={p.x}
                      y={p.y}
                      dy={p.dy || undefined}
                      className={dark ? "borough-label on-dark" : "borough-label"}
                    >
                      {p.text}
                    </text>
                  ));
                })}
              </g>
            </svg>
          ) : (
            <div className="map-loading">LOADING BOROUGH GEOMETRY…</div>
          )}
        </div>

        <div className="map-legend">
          <span>{layer.legendLow.toUpperCase()}</span>
          <span className={`swatches ${layer.ramp}`}>
            {Array.from({ length: 10 }, (_, i) => (
              <i key={i} className={`heat-${i}`} style={{ background: "none" }}>
                <svg width="100%" height="100%" className={layer.ramp}>
                  <rect width="100%" height="100%" className={`heat-${i}`} />
                </svg>
              </i>
            ))}
          </span>
          <span>{layer.legendHigh.toUpperCase()}</span>
        </div>
        <p className="disclaimer" style={{ marginTop: 14, maxWidth: "100%" }}>
          {active && activeValue !== null
            ? `${active.toUpperCase()} — ${layer.format(activeValue)} (${layer.unit})`
            : `HOVER A BOROUGH TO READ ITS VALUE · CLICK TO FILTER THE REGISTER · SOURCE: ${layer.source.toUpperCase()}`}
        </p>
      </div>

      <BoroughScorecard name={selected} onClear={() => onSelect(null)} />
    </div>
  );
}