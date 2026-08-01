import boroughsData from "@/data/boroughs.json";
import sitesData from "@/data/sites.json";
import totalsData from "@/data/totals.json";

export type BoroughRow = {
  stalled_sites: number;
  stalled_homes: number;
  stalled_affordable: number;
  lapsed_sites: number;
  lapsed_homes: number;
  nostart_sites: number;
  nostart_homes: number;
  homes_required_2020_23: number;
  homes_delivered_2020_23: number;
  hdt_2023_pct: number;
  hdt_consequence: string;
  major_decisions: number | null;
  pct_within_13_weeks: number | null;
};

export type Site = {
  id: string;
  name: string;
  borough: string;
  reference: string;
  postcode: string | null;
  street: string | null;
  homes: number;
  affordable: number;
  decision_date: string;
  approved_year: number;
  years_since: number;
  flag: string;
  application_type: string | null;
  status: string | null;
  lapsed_date: string | null;
  description: string | null;
  tenures: Record<string, number>;
  lat: number | null;
  lng: number | null;
  risk_score: number;
  last_updated: string | null;
};

export const boroughs = boroughsData as Record<string, BoroughRow>;
export const sites = sitesData as Site[];
export const totals = totalsData;
export const boroughNames = Object.keys(boroughs).sort();

export type LayerId =
  | "demand"
  | "delivery"
  | "stalled"
  | "affordable"
  | "delays";

export type Layer = {
  id: LayerId;
  label: string;
  unit: string;
  ramp: "ramp-orange" | "ramp-acid" | "ramp-ink";
  /** true when a HIGH raw value should read as a LOW-pressure (cool) borough */
  invert: boolean;
  legendLow: string;
  legendHigh: string;
  source: string;
  value: (b: BoroughRow) => number | null;
  format: (v: number) => string;
};

const int = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number) => `${v}%`;

export const layers: Layer[] = [
  {
    id: "demand",
    label: "Demand pressure",
    unit: "homes required 2020–23",
    ramp: "ramp-ink",
    invert: false,
    legendLow: "lower need",
    legendHigh: "highest need",
    source: "MHCLG Housing Delivery Test 2023 — homes required",
    value: (b) => b.homes_required_2020_23,
    format: int,
  },
  {
    id: "delivery",
    label: "Supply delivery",
    unit: "% of requirement delivered",
    ramp: "ramp-orange",
    invert: true,
    legendLow: "delivering",
    legendHigh: "under-delivering",
    source: "MHCLG Housing Delivery Test 2023 measurement",
    value: (b) => b.hdt_2023_pct,
    format: pct,
  },
  {
    id: "stalled",
    label: "Stalled homes",
    unit: "approved homes with no recorded start",
    ramp: "ramp-orange",
    invert: false,
    legendLow: "few",
    legendHigh: "most stalled",
    source: "Planning London Datahub — residential units, 2015–2021 decisions",
    value: (b) => b.stalled_homes,
    format: int,
  },
  {
    id: "affordable",
    label: "Affordable gap",
    unit: "affordable homes inside stalled schemes",
    ramp: "ramp-acid",
    invert: false,
    legendLow: "few",
    legendHigh: "largest gap",
    source: "Planning London Datahub — tenure of consented units",
    value: (b) => b.stalled_affordable,
    format: int,
  },
  {
    id: "delays",
    label: "Planning delays",
    unit: "% of major decisions inside 13 weeks",
    ramp: "ramp-ink",
    invert: true,
    legendLow: "faster",
    legendHigh: "slowest",
    source: "MHCLG Table P151a, April 2024 – March 2026",
    value: (b) => b.pct_within_13_weeks,
    format: (v) => `${v}%`,
  },
];

export function layerById(id: LayerId): Layer {
  return layers.find((l) => l.id === id) ?? layers[0]!;
}

/** Returns heat-0..heat-9 for a borough on a layer, or null when no data. */
export function heatClass(layer: Layer, name: string): string {
  const row = boroughs[name];
  if (!row) return "no-data";
  const v = layer.value(row);
  if (v === null || v === undefined) return "no-data";
  const all = boroughNames
    .map((n) => layer.value(boroughs[n]!))
    .filter((x): x is number => x !== null && x !== undefined)
    .sort((a, b) => a - b);
  const rank = all.filter((x) => x < v).length;
  let step = Math.floor((rank / Math.max(all.length - 1, 1)) * 9);
  if (layer.invert) step = 9 - step;
  return `heat-${Math.max(0, Math.min(9, step))}`;
}

export function boroughRank(name: string, layer: Layer): number | null {
  const row = boroughs[name];
  if (!row) return null;
  const v = layer.value(row);
  if (v === null) return null;
  const ordered = boroughNames
    .filter((n) => layer.value(boroughs[n]!) !== null)
    .sort((a, b) => {
      const av = layer.value(boroughs[a]!)!;
      const bv = layer.value(boroughs[b]!)!;
      return layer.invert ? av - bv : bv - av;
    });
  return ordered.indexOf(name) + 1;
}

export const rankedBoroughsCount = boroughNames.length;

export function fmt(n: number): string {
  return n.toLocaleString("en-GB");
}

export function topBoroughs(
  key: (b: BoroughRow) => number,
  count = 5,
): { name: string; value: number }[] {
  return boroughNames
    .map((name) => ({ name, value: key(boroughs[name]!) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, count);
}
