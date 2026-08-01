import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ActionSection } from "@/components/ActionSection";
import { Hero } from "@/components/Hero";
import { LondonMap } from "@/components/LondonMap";
import { MetricStrip } from "@/components/MetricStrip";
import { Narrative } from "@/components/Narrative";
import { SiteFooter } from "@/components/SiteFooter";
import { StalledRegister } from "@/components/StalledRegister";
import { TopBar } from "@/components/TopBar";
import { fmt } from "@/lib/metrics";

const title = "Stalled London — 100,477 approved homes that never started";
const description =
  "Interactive map and register of London homes with planning permission but no recorded construction start, built from the Planning London Datahub and MHCLG housing data.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const [borough, setBorough] = useState<string | null>(null);

  return (
    <>
      <TopBar />
      <main>
        <Hero />
        <MetricStrip />

        <section className="explorer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE MAP · FIVE VERIFIED LAYERS</p>
              <h2>
                Where London&rsquo;s
                <br />
                housing <em>stops</em>.
              </h2>
            </div>
            <p className="disclaimer">
              Every layer is a published government figure, not a model. Boroughs are
              shaded by decile within London. Switch layers to compare demand, delivery,
              stalled consents, affordable loss and decision speed. Click a borough to
              filter the register below.
            </p>
          </div>

          <LondonMap selected={borough} onSelect={setBorough} />
        </section>

        <Narrative />

        <section className="explorer">
          <div className="section-heading">
            <div>
              <p className="eyebrow">THE REGISTER · {fmt(totals.homes)} HOMES</p>
              <h2>
                The stalled sites
                <br />
                <em>register</em>.
              </h2>
            </div>
            <p className="disclaimer">
              The 164 largest stalled residential schemes, with full application records
              retrieved from the Planning London Datahub. Stall risk score combines age of
              permission (40%), scheme size (30%), affordable share (20%) and the
              borough&rsquo;s Housing Delivery Test result (10%). Click any row for a
              sourced evidence card.
            </p>
          </div>

          <StalledRegister borough={borough} onBorough={setBorough} />
        </section>

        <ActionSection />
      </main>
      <SiteFooter />
    </>
  );
}
