import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/SiteFooter";
import { TopBar } from "@/components/TopBar";
import { fmt, sites, totals } from "@/lib/metrics";

const title = "Sources & method — Stalled London";
const description =
  "Every dataset, query and calculation behind Stalled London: Planning London Datahub, MHCLG Housing Delivery Test 2023 and planning performance Table P151a.";

export const Route = createFileRoute("/sources")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Sources,
});

function Sources() {
  return (
    <>
      <TopBar />
      <main className="prose-page">
        <p className="eyebrow">PROVENANCE</p>
        <h1>
          Sources &amp;<br />
          <em>method</em>.
        </h1>
        <p>
          Stalled London contains no estimated, modelled or illustrative numbers. Every
          figure on the site is either published directly by a government body or is an
          arithmetic aggregation of published records, described below. Data retrieved{" "}
          {totals.retrieved}.
        </p>

        <h2>1. Stalled homes and the register</h2>
        <div className="source-card">
          <b>PLANNING LONDON DATAHUB — GREATER LONDON AUTHORITY</b>
          <p>
            We queried the Datahub&rsquo;s residential-unit and application indexes for
            every London borough decision between 2015 and 2021 with a residential unit
            record ({fmt(160000)}+ unit rows). A scheme is counted as stalled when it was
            permitted and has <strong>no actual commencement date recorded</strong>, and
            its status is either &ldquo;Lapsed&rdquo; (permission expired) or
            &ldquo;Approved&rdquo; (live consent, no start logged). That yields{" "}
            {fmt(totals.schemes)} schemes and {fmt(totals.homes)} homes, of which{" "}
            {fmt(totals.affordable)} were consented in affordable tenures (social rent,
            affordable rent, London affordable rent, shared ownership and other
            intermediate products, as classified in the Datahub tenure field).
          </p>
          <p>
            The register table lists the {sites.length} largest of those schemes, with the
            application reference, site address, tenure mix and decision date taken
            verbatim from the Datahub record.
          </p>
          <p>
            <a
              href="https://planningdata.london.gov.uk/"
              target="_blank"
              rel="noreferrer"
            >
              planningdata.london.gov.uk →
            </a>
          </p>
        </div>

        <h2>2. Demand and delivery layers</h2>
        <div className="source-card">
          <b>MHCLG HOUSING DELIVERY TEST 2023 MEASUREMENT</b>
          <p>
            The demand layer uses each borough&rsquo;s <strong>homes required</strong> for
            2020&ndash;23 and the delivery layer uses its published{" "}
            <strong>Housing Delivery Test percentage</strong>, both read from the official
            measurement spreadsheet. Across the 33 London authorities the test records{" "}
            {fmt(totals.delivered)} homes delivered against {fmt(totals.required)}{" "}
            required. Consequences (presumption in favour of sustainable development, 20%
            buffer, action plan) are the government&rsquo;s own designations.
          </p>
          <p>
            <a
              href="https://assets.publishing.service.gov.uk/media/6759ccfbad4694c785b0eddb/Housing_Delivery_Test_2023_measurement.ods"
              target="_blank"
              rel="noreferrer"
            >
              Housing Delivery Test 2023 measurement (.ods) →
            </a>
          </p>
        </div>

        <h2>3. Planning delays layer</h2>
        <div className="source-card">
          <b>MHCLG PLANNING PERFORMANCE TABLE P151A</b>
          <p>
            Percentage of decisions on applications for major development determined within
            the 13-week statutory period, April 2024 &ndash; March 2026, per local planning
            authority. We deliberately show the raw statutory measure rather than the
            headline &ldquo;within agreed time&rdquo; figure, which counts extensions of
            time agreed with the applicant and therefore sits near 100% for almost every
            borough. Both numbers appear on the borough scorecard.
          </p>
          <p>
            <a
              href="https://www.gov.uk/government/collections/planning-applications-statistics"
              target="_blank"
              rel="noreferrer"
            >
              Planning application statistics collection →
            </a>
          </p>
        </div>

        <h2>4. Stall risk score</h2>
        <div className="source-card">
          <b>DERIVED — TRANSPARENT WEIGHTING</b>
          <p>
            The only composed number on the site. For each scheme: years since permission
            (capped at 12) weighted 40%, homes consented (capped at 1,000) weighted 30%,
            affordable share of the scheme weighted 20%, and the inverse of the
            borough&rsquo;s Housing Delivery Test score weighted 10%. Expressed 0&ndash;100.
            It ranks published facts; it is not a prediction.
          </p>
        </div>

        <h2>Known limitations</h2>
        <p>
          Datahub records are submitted by boroughs, and completeness varies. A missing
          commencement date is evidence of a reporting or delivery gap, not proof that a
          site is empty today — several large schemes recorded as lapsed have since been
          consented again or partly built under later permissions. Layers that could not be
          sourced to a verified published dataset were not included, and no borough figure
          on this site is interpolated.
        </p>
      </main>
      <SiteFooter />
    </>
  );
}