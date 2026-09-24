"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CircleCheck, Info, Truck, Leaf, ChartNoAxesColumnIncreasing } from "lucide-react";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

const METRICS = [
  { label: "Price Error", value: "4.2%" },
  { label: "Quality Error", value: "3.1%" },
  { label: "Shelf-Life Error", value: "6.8%" },
  { label: "Transport Cost Error", value: "5.5%" },
  { label: "Delivery Time Error", value: "7.2%" },
  { label: "Value Loss Error", value: "8.1%" },
];

export default function LearningLoop() {
  const router = useRouter();
  const { wf } = useWorkflow();

  useEffect(() => {
    if (wf.settlement) {
      api("/api/feedback", { method: "POST" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settlement = wf.settlement;
  const order = wf.order;
  const quantity = order?.quantity ?? wf.aggregation?.total_quantity ?? 1550;

  return (
    <StepShell
      eyebrow="CONTINUOUS LEARNING"
      title="Predict → Transact → Observe → Learn"
      step={17}
      totalSteps={19}
      backHref="/farmer/earnings"
      wide
    >
      <div className="learning-page">
        <p className="learning-intro">
          This completed transaction feeds actual price, quality, shelf-life, transport and delivery
          outcomes back into the model so future recommendations improve.
        </p>

        <div className="learning-layout">
          <section className="learning-main">
            <div className="learning-metrics">
              {METRICS.map((metric) => (
                <div className="learning-metric" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>

            <div className="learning-bottom-grid">
              <section className="learning-card">
                <div className="learning-card-title">
                  <ChartNoAxesColumnIncreasing aria-hidden="true" />
                  <b>Analilied error breakdown</b>
                </div>
                <p>
                  This transaction feeds actual price, quality, shelf-life, transport, and delivery
                  outcomes back into the model so future recommendations improve.
                </p>
                <div className="mini-bars" aria-hidden="true">
                  <i style={{ height: "36%" }} />
                  <i style={{ height: "55%" }} />
                  <i style={{ height: "75%" }} />
                  <i style={{ height: "48%" }} />
                </div>
              </section>

              <section className="learning-card">
                <div className="learning-card-title">
                  <Leaf aria-hidden="true" />
                  <b>Analysis</b>
                </div>
                <ul>
                  <li>Price completed transaction feeds actual price, <b>4.2%</b>.</li>
                  <li>Quality, shelf-life, transport and delivery errors are retained.</li>
                  <li>Value-loss error <b>8.1%</b>, higher than planned.</li>
                </ul>
              </section>
            </div>
          </section>

          <aside className="learning-side">
            <section className="verification-card">
              <h2>Verification</h2>
              <div className="verification-item warning">
                <CircleCheck aria-hidden="true" />
                <div>
                  <b>Quality Verification Check</b>
                  <span>Quality error (3.1%) is exceptionally low.</span>
                </div>
              </div>
              <div className="verification-item">
                <Info aria-hidden="true" />
                <div>
                  <b>Logistics Optimization Check</b>
                  <span>Logistics error (5.5%) is higher than predicted, check efficiency.</span>
                </div>
              </div>
            </section>

            <section className="side-check">
              <Truck aria-hidden="true" />
              <div>
                <b>Transport &amp; Perishability Costs Reductions:</b>
                <span>Transport &amp; perishability cost reductions 3.5% &amp; 5.5% in seeing all numbers from 6.8%.</span>
              </div>
            </section>

            <section className="side-check">
              <CircleCheck aria-hidden="true" />
              <div>
                <b>Delivery Performance check:</b>
                <span>Delivery performance check is prevented from 7.2% to improve.</span>
                <span>Value Opportunity check: Value opportunity check is taken into costs of more than 8.1%.</span>
              </div>
            </section>
          </aside>
        </div>

        <div className="learning-actions">
          <button className="primary learning-done" onClick={() => router.push("/farmer/home")}>
            Done -- Back to Home
          </button>
          <button className="secondary learning-another" onClick={() => router.push("/farmer/harvest")}>
            Sell Another Harvest
          </button>
        </div>

        <span className="sr-only">Quantity processed: {quantity}. Settlement: {settlement ? "confirmed" : "pending"}.</span>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 68%, rgba(255,255,255,.86) 0 25%, transparent 54%),
            linear-gradient(180deg, #e9f7f1 0%, #f5fbf7 63%, #d9f0e6 100%);
          color: #101a13;
          position: relative;
          overflow-x: hidden;
        }

        .step-shell::after {
          content: "";
          position: fixed;
          left: -4%; right: -4%; bottom: -2px;
          height: 24%;
          pointer-events: none;
          background:
            radial-gradient(52% 95% at 7% 100%, rgba(112, 191, 145, .55) 0 30%, transparent 31%),
            radial-gradient(45% 90% at 100% 100%, rgba(150, 218, 184, .58) 0 31%, transparent 32%),
            radial-gradient(40% 65% at 22% 100%, rgba(186, 231, 207, .7) 0 32%, transparent 33%);
          z-index: 0;
        }

        .step-shell-header {
          min-height: 43px;
          padding: 8px 17px;
          background: rgba(244, 252, 248, .82);
          border: 0;
          box-shadow: 0 3px 16px rgba(41, 83, 66, .08);
          position: relative;
          z-index: 4;
        }

        .step-shell-brand { gap: 7px; }
        .step-shell-brand b { font: 700 13px/1 "DM Sans", sans-serif; color: #122117; }
        .brandmark.small {
          width: 21px; height: 21px; border-radius: 6px;
          background: #10361f; color: #b9ef73;
        }
        .brandmark.small svg { width: 13px; height: 13px; }
        .step-progress { min-width: 157px; gap: 9px; }
        .step-progress-track { height: 4px; background: #dce9e1; }
        .step-progress-fill { background: #80b85d; }
        .step-progress span { font-size: 7px; font-weight: 500; color: #66736a; }

        .step-shell-main {
          width: min(720px, calc(100% - 32px));
          max-width: 720px;
          margin: 32px auto 30px;
          padding: 21px 17px 17px;
          background: rgba(255,255,255,.77);
          border: 1px solid rgba(213, 225, 216, .86);
          border-radius: 13px;
          box-shadow: 0 12px 35px rgba(40, 69, 55, .11), 0 8px 0 rgba(224,235,228,.78), 0 15px 0 rgba(232,240,235,.68);
          position: relative;
          z-index: 2;
        }

        .step-shell-main.wide { max-width: 720px; }
        .step-back { margin: 0 0 10px; padding: 0; font-size: 9px; color: #53645a; gap: 5px; }
        .step-back svg { width: 12px; height: 12px; }
        .eyebrow { font-size: 8px; letter-spacing: 1.25px; color: #68766d; }
        .step-shell-main h1 {
          margin: 7px 0 5px;
          color: #0b120e;
          font: 700 22px/1.12 "DM Sans", sans-serif;
          letter-spacing: -.55px;
        }
        .step-body { margin-top: 0; }

        .learning-page { width: 100%; }
        .learning-intro {
          margin: 0 0 18px;
          max-width: 485px;
          color: #657169;
          font-size: 8px;
          line-height: 1.35;
        }

        .learning-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 188px;
          gap: 10px;
          align-items: start;
        }

        .learning-metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 8px;
        }
        .learning-metric {
          min-height: 46px;
          padding: 10px 9px 8px;
          background: rgba(251,252,249,.76);
          border-radius: 5px;
        }
        .learning-metric span { display: block; font-size: 6px; color: #68746c; margin-bottom: 5px; }
        .learning-metric strong { font-size: 12px; line-height: 1; color: #101710; }

        .learning-bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .learning-card {
          position: relative;
          min-height: 78px;
          padding: 9px 10px;
          border: 1px solid #e0e7df;
          border-radius: 6px;
          background: rgba(255,255,255,.9);
          overflow: hidden;
        }
        .learning-card-title { display: flex; align-items: center; gap: 5px; margin-bottom: 5px; }
        .learning-card-title svg { width: 12px; height: 12px; color: #6b8d68; }
        .learning-card-title b { font-size: 8px; }
        .learning-card p, .learning-card li { margin: 0; color: #344039; font-size: 6.6px; line-height: 1.32; }
        .learning-card ul { margin: 0; padding-left: 11px; }
        .learning-card li + li { margin-top: 2px; }
        .mini-bars { position: absolute; right: 9px; bottom: 9px; display: flex; align-items: end; gap: 2px; height: 25px; }
        .mini-bars i { display: block; width: 4px; border-radius: 1px 1px 0 0; background: #9ab99a; }

        .learning-side { display: grid; gap: 7px; }
        .verification-card {
          background: rgba(237,247,241,.82);
          border: 1px solid #dce8df;
          border-radius: 6px;
          padding: 9px;
        }
        .verification-card h2 { margin: 0 0 6px; font: 700 9px/1 "DM Sans", sans-serif; }
        .verification-item { display: flex; gap: 5px; margin-top: 6px; }
        .verification-item svg { width: 11px; height: 11px; flex: 0 0 auto; color: #4e8b6a; }
        .verification-item.warning svg { color: #b27d36; }
        .verification-item b, .verification-item span { display: block; font-size: 6px; line-height: 1.25; }
        .verification-item span { color: #5c675f; margin-top: 1px; }

        .side-check {
          display: flex; gap: 7px; padding: 8px;
          border: 1px solid #dce7df; border-radius: 6px;
          background: rgba(244,250,246,.82);
        }
        .side-check > svg { width: 14px; height: 14px; color: #688c6b; flex: 0 0 auto; }
        .side-check b, .side-check span { display: block; font-size: 6px; line-height: 1.3; }
        .side-check span { color: #59665e; margin-top: 1px; }

        .learning-actions {
          display: grid;
          grid-template-columns: 1fr 142px;
          gap: 8px;
          margin-top: 8px;
        }
        .learning-actions .primary, .learning-actions .secondary {
          min-height: 31px;
          border-radius: 6px;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
        }
        .learning-actions .primary { background: #b9f52b; color: #14210e; }
        .learning-actions .secondary { border: 1px solid #d9e2da; background: #fff; color: #152019; }
        .learning-actions .primary:hover { background: #abeb20; }
        .learning-actions .secondary:hover { background: #f6faf7; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }

        @media (max-width: 760px) {
          .step-shell-header { padding: 8px 12px; }
          .step-progress { min-width: 135px; }
          .step-shell-main { width: calc(100% - 20px); margin-top: 18px; padding: 18px 13px 14px; }
          .learning-layout { grid-template-columns: 1fr; }
          .learning-side { grid-template-columns: 1fr 1fr; }
          .verification-card { grid-column: 1 / -1; }
        }

        @media (max-width: 520px) {
          .step-progress { min-width: 115px; }
          .step-progress span { font-size: 6px; }
          .step-shell-main h1 { font-size: 20px; }
          .learning-intro { font-size: 8px; }
          .learning-metrics { grid-template-columns: repeat(2, 1fr); }
          .learning-bottom-grid { grid-template-columns: 1fr; }
          .learning-side { grid-template-columns: 1fr; }
          .learning-actions { grid-template-columns: 1fr; }
          .learning-actions .secondary { min-height: 30px; }
        }
      `}</style>
    </StepShell>
  );
}
