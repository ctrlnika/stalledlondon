import data from "@/data/affordability.json";

export type YearRow = {
  year: number;
  price_nominal: number | null;
  price_real: number | null;
  earn_nominal: number;
  earn_real: number;
  ratio: number | null;
  partial: boolean;
};

export const series = data.series as YearRow[];
export const meta = data.meta;

export const withPrices = series.filter((r) => r.price_real !== null);

export const gbp = (n: number) =>
  `£${Math.round(n).toLocaleString("en-GB")}`;

export const gbpShort = (n: number) =>
  n >= 1000 ? `£${Math.round(n / 1000)}k` : `£${Math.round(n)}`;

export type Scenario = {
  /** homes actually built out of the stalled consents */
  homes: number;
  /** assumed % fall in real prices per 1% increase in stock */
  elasticity: number;
  /** gross annual income used for the affordability test */
  income: number;
};

export type ScenarioResult = {
  stockUpliftPct: number;
  priceChangePct: number;
  basePrice: number;
  newPrice: number;
  priceDrop: number;
  baseRatio: number;
  newRatio: number;
  /** deposit needed at a 4.5x income lending cap */
  baseDeposit: number;
  newDeposit: number;
  baseYearsToSave: number;
  newYearsToSave: number;
  affordableHomes: number;
};

const LEND_MULTIPLE = 4.5;
const SAVINGS_RATE = 0.1;

export function simulate({ homes, elasticity, income }: Scenario): ScenarioResult {
  const basePrice = meta.london_avg_price;
  const stockUpliftPct = (homes / meta.london_stock) * 100;
  const priceChangePct = -elasticity * stockUpliftPct;
  const newPrice = basePrice * (1 + priceChangePct / 100);
  const capacity = income * LEND_MULTIPLE;
  const dep = (p: number) => Math.max(0, p - capacity);
  const baseDeposit = dep(basePrice);
  const newDeposit = dep(newPrice);
  const save = income * SAVINGS_RATE;
  return {
    stockUpliftPct,
    priceChangePct,
    basePrice,
    newPrice,
    priceDrop: basePrice - newPrice,
    baseRatio: basePrice / income,
    newRatio: newPrice / income,
    baseDeposit,
    newDeposit,
    baseYearsToSave: baseDeposit / save,
    newYearsToSave: newDeposit / save,
    affordableHomes: Math.round((homes / 100477) * 19988),
  };
}

export const lendMultiple = LEND_MULTIPLE;
export const savingsRate = SAVINGS_RATE;