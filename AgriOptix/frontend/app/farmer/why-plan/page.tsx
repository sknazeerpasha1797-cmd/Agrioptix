"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";
import StepShell from "../../../components/StepShell";
import { useWorkflow } from "../../../lib/store";

export default function WhyPlan() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const opt = wf.optimization;

  const reasons = [
    "Better quality-price fit",
    "Buyer demand matches quantity",
    "Lower transport cost",
    "Vehicle capacity feasible",
    "Delivery within shelf life window",
    "Lower expected value loss",
  ];

  function accept() {
    setWf({ acceptedPlan: true });
    router.push("/farmer/aggregation");
  }

  return (
    <StepShell
      eyebrow="EXPLAINABILITY"
      title="Why this plan?"
      step={8}
      totalSteps={19}
      backHref="/farmer/selling-plan"
    >
      <div className="why-plan-page">
        <div className="why-plan-reasons">
          {reasons.map((reason) => (
            <div className="why-plan-reason" key={reason}>
              <CheckCircle2 aria-hidden="true" />
              <span>{reason}</span>
            </div>
          ))}
        </div>

        <div className="why-plan-note">
          <Info aria-hidden="true" />
          <span>
            <b>Why not the other buyers?</b>{" "}
            {opt?.rejected_reason ||
              "Buyer A has a higher quoted price, but its transport and perishability costs reduce net realization."}
          </span>
        </div>

        <div className="step-actions why-plan-actions">
          <button className="primary" onClick={accept}>
            Accept Plan
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #123f3b;
          background:
            linear-gradient(
              180deg,
              rgba(239, 249, 246, 0.98) 0%,
              rgba(245, 252, 249, 0.96) 54%,
              rgba(224, 245, 237, 0.95) 100%
            );
          position: relative;
          overflow: hidden;
        }

        .step-shell::after {
          content: "";
          position: fixed;
          left: -3%;
          right: -3%;
          bottom: -4px;
          height: 28%;
          pointer-events: none;
          background:
            radial-gradient(100% 85% at 0% 100%, rgba(185, 226, 211, 0.7) 0 38%, transparent 39%),
            radial-gradient(90% 72% at 100% 100%, rgba(205, 237, 226, 0.9) 0 42%, transparent 43%);
          opacity: 0.9;
        }

        .step-shell-header {
          min-height: 73px;
          padding: 10px 40px;
          border: 0;
          border-radius: 0 0 28px 28px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 5px 20px rgba(43, 108, 91, 0.07);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }

        .step-shell-brand {
          gap: 13px;
        }

        .step-shell-brand b {
          color: #0d3935;
          font: 800 27px/1 "Manrope", sans-serif;
          letter-spacing: -1px;
        }

        .brandmark.small {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #4bb875;
          color: white;
          box-shadow: inset 0 0 0 3px rgba(255, 255, 255, 0.16);
        }

        .brandmark.small svg {
          width: 31px;
          height: 31px;
        }

        .step-progress {
          min-width: 285px;
          gap: 16px;
        }

        .step-progress-track {
          height: 8px;
          background: #d5eee7;
        }

        .step-progress-fill {
          background: #6ac54f;
        }

        .step-progress span {
          color: #285f58;
          font-size: 14px;
          font-weight: 500;
        }

        .step-shell-main {
          max-width: 1065px;
          margin: 24px auto 0;
          padding: 27px 44px 31px;
          background: rgba(255, 255, 255, 0.66);
          border: 1px solid rgba(218, 240, 234, 0.9);
          border-radius: 18px;
          box-shadow: 0 8px 35px rgba(43, 108, 91, 0.08);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #087b55;
          font-size: 17px;
          font-weight: 500;
          gap: 8px;
          margin-bottom: 13px;
        }

        .step-back svg {
          width: 22px;
          height: 22px;
        }

        .eyebrow {
          color: #65a895;
          font-size: 17px;
          letter-spacing: 2px;
          line-height: 1.2;
        }

        .step-shell-main h1 {
          color: #0c403c;
          font: 800 45px/1.08 "Manrope", sans-serif;
          letter-spacing: -1.6px;
          margin: 9px 0 20px;
        }

        .step-body {
          margin-top: 0;
        }

        .why-plan-page {
          width: 100%;
        }

        .why-plan-reasons {
          display: grid;
          gap: 9px;
        }

        .why-plan-reason {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 18px;
          padding: 9px 16px;
          border: 1px solid #d7eee7;
          border-radius: 13px;
          background: rgba(240, 249, 246, 0.7);
          color: #123f3b;
          font-size: 16px;
        }

        .why-plan-reason svg {
          width: 24px;
          height: 24px;
          flex: 0 0 auto;
          color: #43a447;
          stroke-width: 2.4;
        }

        .why-plan-note {
          min-height: 54px;
          margin-top: 17px;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 10px 18px;
          border-radius: 13px;
          background: rgba(225, 244, 237, 0.8);
          color: #326a61;
          font-size: 14px;
          line-height: 1.35;
        }

        .why-plan-note svg {
          width: 23px;
          height: 23px;
          flex: 0 0 auto;
          fill: #4f9f82;
          color: white;
          stroke-width: 2;
        }

        .why-plan-note b {
          font-weight: 500;
        }

        .why-plan-actions {
          margin-top: 18px;
          display: block;
        }

        .why-plan-actions .primary {
          min-height: 54px;
          width: 100%;
          border-radius: 13px;
          background: #11945d;
          color: white;
          font-size: 21px;
          font-weight: 800;
          box-shadow: none;
        }

        .why-plan-actions .primary:hover {
          background: #0d8050;
        }

        @media (max-width: 900px) {
          .step-shell-header {
            padding: 10px 24px;
          }

          .step-shell-main {
            margin: 20px 20px 0;
            padding: 25px 28px 30px;
          }

          .step-progress {
            min-width: 235px;
          }

          .step-shell-main h1 {
            font-size: 39px;
          }
        }

        @media (max-width: 640px) {
          .step-shell-header {
            min-height: 68px;
            padding: 9px 16px;
            border-radius: 0 0 20px 20px;
          }

          .step-shell-brand {
            gap: 9px;
          }

          .brandmark.small {
            width: 42px;
            height: 42px;
          }

          .brandmark.small svg {
            width: 26px;
            height: 26px;
          }

          .step-shell-brand b {
            font-size: 22px;
          }

          .step-progress {
            min-width: 130px;
            gap: 8px;
          }

          .step-progress-track {
            min-width: 70px;
          }

          .step-progress span {
            font-size: 11px;
          }

          .step-shell-main {
            margin: 14px 12px 0;
            padding: 20px 16px 22px;
            border-radius: 16px;
          }

          .step-back {
            font-size: 14px;
            margin-bottom: 12px;
          }

          .eyebrow {
            font-size: 13px;
            letter-spacing: 1.6px;
          }

          .step-shell-main h1 {
            font-size: 32px;
            letter-spacing: -1px;
            margin: 7px 0 18px;
          }

          .why-plan-reasons {
            gap: 8px;
          }

          .why-plan-reason {
            min-height: 50px;
            gap: 12px;
            padding: 9px 12px;
            font-size: 14px;
          }

          .why-plan-reason svg {
            width: 21px;
            height: 21px;
          }

          .why-plan-note {
            align-items: flex-start;
            gap: 10px;
            padding: 11px 12px;
            margin-top: 14px;
            font-size: 12px;
          }

          .why-plan-note svg {
            width: 20px;
            height: 20px;
          }

          .why-plan-actions {
            margin-top: 14px;
          }

          .why-plan-actions .primary {
            min-height: 50px;
            font-size: 18px;
          }
        }
      `}</style>
    </StepShell>
  );
}
