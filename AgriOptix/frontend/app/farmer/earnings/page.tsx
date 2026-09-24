"use client";

import { Leaf, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import StepShell from "../../../components/StepShell";
import { useWorkflow } from "../../../lib/store";

export default function Earnings() {
  const router = useRouter();
  const { wf } = useWorkflow();

  const net = wf.settlement?.net_settlement ?? 35400;
  const crop = wf.harvest?.crop || "Tomato";
  const quantity = wf.order?.quantity_kg || 1550;
  const buyer = wf.order?.buyer || wf.optimization?.selected_buyer || "Buyer B";

  return (
    <StepShell
      eyebrow="EARNINGS"
      title="Your Earnings"
      step={16}
      totalSteps={19}
      backHref="/farmer/settlement"
    >
      <div className="earnings-page">
        <section className="earnings-total" aria-label="Total earnings">
          <span>Total earnings</span>
          <strong>₹{Number(net).toLocaleString("en-IN")}</strong>
        </section>

        <section className="earnings-summary" aria-label="Transaction summary">
          <div>
            <span>{crop} · {quantity} kg</span>
          </div>
          <div>
            <strong>{buyer}</strong>
          </div>
          <div>
            <span>Status: <b>Completed</b></span>
          </div>
        </section>

        <section className="earnings-insights" aria-label="Earnings insights">
          <div className="earnings-insight">
            <Info aria-hidden="true" />
            <p>
              <b>Market Price Shift: -₹5,100</b> (Price decreased due to high supply)
            </p>
          </div>
          <div className="earnings-insight">
            <Info aria-hidden="true" />
            <p>
              <b>Predicted Cost Offset: +₹3,200.</b> Optimized logistics reduced final transport costs. Details available.
            </p>
          </div>
        </section>

        <div className="earnings-actions">
          <button
            className="primary earnings-learning"
            onClick={() => router.push("/farmer/learning")}
          >
            <Leaf aria-hidden="true" />
            View Learning Loop
          </button>
          <button
            className="secondary earnings-home"
            onClick={() => router.push("/farmer/home")}
          >
            Back to Home
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #142c1d;
          background:
            radial-gradient(circle at 50% 72%, rgba(255, 255, 255, 0.7) 0 16%, transparent 45%),
            linear-gradient(180deg, #e8f7f1 0%, #eefaf5 52%, #d9f1e6 100%);
          position: relative;
          overflow: hidden;
        }

        .step-shell::before {
          content: "";
          position: fixed;
          inset: auto 0 0;
          height: 24vh;
          pointer-events: none;
          background:
            radial-gradient(38% 90% at 6% 100%, rgba(110, 190, 140, 0.42) 0 38%, transparent 39%),
            radial-gradient(34% 80% at 94% 100%, rgba(126, 203, 153, 0.38) 0 38%, transparent 39%),
            linear-gradient(180deg, transparent, rgba(192, 235, 216, 0.56));
          z-index: 0;
        }

        .step-shell-header {
          min-height: 44px;
          padding: 8px 16px;
          border: 0;
          border-radius: 0 0 13px 13px;
          background: rgba(245, 252, 248, 0.88);
          box-shadow: 0 3px 12px rgba(30, 86, 61, 0.08);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 5;
        }

        .step-shell-brand {
          gap: 7px;
        }

        .step-shell-brand b {
          color: #142c1d;
          font: 800 13px/1 "Manrope", sans-serif;
          letter-spacing: -0.2px;
        }

        .brandmark.small {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #123b27;
          color: #d9f3a2;
          box-shadow: none;
        }

        .brandmark.small svg {
          width: 13px;
          height: 13px;
        }

        .step-progress {
          min-width: 152px;
          gap: 8px;
        }

        .step-progress-track {
          height: 4px;
          background: #d4e6dc;
        }

        .step-progress-fill {
          background: #6fba70;
        }

        .step-progress span {
          color: #68776f;
          font-size: 7px;
          font-weight: 500;
        }

        .step-shell-main {
          width: min(443px, calc(100vw - 28px));
          max-width: none;
          margin: 32px auto 0;
          padding: 19px 23px 16px;
          background: rgba(250, 253, 251, 0.78);
          border: 1px solid rgba(218, 235, 226, 0.96);
          border-radius: 11px;
          box-shadow:
            0 8px 24px rgba(39, 81, 60, 0.08),
            0 13px 0 rgba(236, 248, 242, 0.82),
            0 21px 0 rgba(222, 241, 232, 0.64);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #5f7167;
          font-size: 9px;
          font-weight: 500;
          gap: 5px;
          margin-bottom: 13px;
        }

        .step-back svg {
          width: 11px;
          height: 11px;
        }

        .eyebrow {
          display: block;
          color: #5f7167;
          font-size: 8px;
          letter-spacing: 1.25px;
          line-height: 1.2;
          font-weight: 700;
        }

        .step-shell-main h1 {
          color: #101b15;
          font: 800 23px/1.05 "Manrope", sans-serif;
          letter-spacing: -0.8px;
          margin: 7px 0 10px;
        }

        .step-body {
          margin-top: 0;
        }

        .earnings-page {
          width: 100%;
        }

        .earnings-total {
          min-height: 78px;
          padding: 17px 16px 14px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0d2a19 0%, #153a24 100%);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
        }

        .earnings-total span {
          display: block;
          color: #c0cbc4;
          font-size: 7px;
          line-height: 1;
        }

        .earnings-total strong {
          display: block;
          margin-top: 7px;
          color: #c8f36b;
          font: 800 23px/1 "Manrope", sans-serif;
          letter-spacing: -0.6px;
        }

        .earnings-summary {
          display: grid;
          grid-template-columns: 1.25fr 0.9fr 1.1fr;
          min-height: 31px;
          margin-top: 11px;
          border: 1px solid #e2eee7;
          border-radius: 9px;
          background: rgba(250, 253, 251, 0.74);
          overflow: hidden;
        }

        .earnings-summary > div {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 0;
          padding: 0 8px;
          color: #66756c;
          font-size: 8px;
          white-space: nowrap;
        }

        .earnings-summary > div + div {
          border-left: 1px solid #e4ece7;
        }

        .earnings-summary strong,
        .earnings-summary b {
          color: #17221b;
          font-weight: 800;
        }

        .earnings-insights {
          margin: 7px -23px -16px;
          padding: 10px 22px 16px;
          border-radius: 11px;
          background: rgba(249, 253, 251, 0.92);
          box-shadow: 0 -1px 0 rgba(226, 239, 231, 0.9);
        }

        .earnings-insight {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          min-height: 31px;
          padding: 8px 11px;
          border-radius: 7px;
          background: #eaf5ef;
          color: #23372c;
          font-size: 8px;
          line-height: 1.35;
        }

        .earnings-insight + .earnings-insight {
          margin-top: 9px;
        }

        .earnings-insight svg {
          width: 13px;
          height: 13px;
          flex: 0 0 auto;
          color: #5d8972;
          fill: #5d8972;
          stroke: #eaf5ef;
          margin-top: 1px;
        }

        .earnings-insight p {
          margin: 0;
        }

        .earnings-insight b {
          color: #15221a;
          font-weight: 800;
        }

        .earnings-actions {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 100px;
          gap: 9px;
          margin-top: 10px;
        }

        .earnings-actions .primary,
        .earnings-actions .secondary {
          min-height: 33px;
          margin: 0;
          border-radius: 7px;
          font-size: 9px;
          padding: 8px 10px;
        }

        .earnings-learning {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          background: #c8f06c;
          color: #15251a;
        }

        .earnings-learning:hover {
          background: #b9e65a;
        }

        .earnings-learning svg {
          width: 13px;
          height: 13px;
          stroke-width: 1.8;
        }

        .earnings-home {
          width: 100%;
          border: 1px solid #dfe8e1;
          background: #fff;
          color: #26372d;
          font-weight: 500;
        }

        @media (max-width: 640px) {
          .step-shell-header {
            min-height: 42px;
            padding: 8px 12px;
          }

          .step-shell-brand {
            gap: 6px;
          }

          .step-shell-brand b {
            font-size: 12px;
          }

          .brandmark.small {
            width: 21px;
            height: 21px;
          }

          .step-progress {
            min-width: 118px;
            gap: 6px;
          }

          .step-progress-track {
            min-width: 60px;
          }

          .step-progress span {
            font-size: 6px;
          }

          .step-shell-main {
            width: calc(100vw - 22px);
            margin-top: 19px;
            padding: 17px 16px 13px;
            border-radius: 10px;
          }

          .step-back {
            font-size: 8px;
            margin-bottom: 11px;
          }

          .eyebrow {
            font-size: 7px;
            letter-spacing: 1.05px;
          }

          .step-shell-main h1 {
            font-size: 21px;
            margin: 6px 0 9px;
          }

          .earnings-total {
            min-height: 72px;
            padding: 15px 13px 12px;
          }

          .earnings-total strong {
            font-size: 21px;
          }

          .earnings-summary {
            grid-template-columns: 1.15fr 0.85fr 1.1fr;
            margin-top: 9px;
          }

          .earnings-summary > div {
            padding: 0 5px;
            font-size: 7px;
          }

          .earnings-insights {
            margin-left: -16px;
            margin-right: -16px;
            padding: 9px 15px 13px;
          }

          .earnings-insight {
            gap: 7px;
            padding: 7px 9px;
            font-size: 7px;
          }

          .earnings-insight svg {
            width: 12px;
            height: 12px;
          }

          .earnings-actions {
            grid-template-columns: minmax(0, 1fr) 96px;
            gap: 7px;
            margin-top: 8px;
          }

          .earnings-actions .primary,
          .earnings-actions .secondary {
            min-height: 32px;
            font-size: 8px;
          }
        }

        @media (max-width: 390px) {
          .earnings-summary > div {
            font-size: 6.5px;
          }

          .earnings-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </StepShell>
  );
}
