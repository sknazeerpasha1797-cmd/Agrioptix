"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

export default function Settlement() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [s, setS] = useState<any>(wf.settlement);

  useEffect(() => {
    if (wf.settlement) return;

    api("/api/settlements/1")
      .then((res) => {
        setS(res);
        setWf({ settlement: res, orderStatus: "SETTLED" });
      })
      .catch(() => {
        // Keep the page usable with the existing fallback values if the API is unavailable.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saleValue = Number(s?.sale_value ?? 40300);
  const transportCost = Number(s?.logistics_cost ?? 4200);
  const handlingCost = Number(s?.handling_cost ?? 700);
  const netSettlement = Number(s?.net_settlement ?? saleValue - transportCost - handlingCost);

  return (
    <StepShell
      eyebrow="SETTLEMENT"
      title="Settlement Details"
      step={15}
      totalSteps={19}
      backHref="/farmer/verification"
    >
      <div className="settlement-target">
        <div className="settlement-ledger" aria-label="Settlement breakdown">
          <div className="ledger-row">
            <span>Sale Value</span>
            <strong>₹{saleValue.toLocaleString("en-IN")}</strong>
          </div>
          <div className="ledger-row">
            <span>Transport Cost</span>
            <strong>− ₹{transportCost.toLocaleString("en-IN")}</strong>
          </div>
          <div className="ledger-row">
            <span>Handling Cost</span>
            <strong>− ₹{handlingCost.toLocaleString("en-IN")}</strong>
          </div>

          <div className="settlement-divider" />

          <div className="net-row">
            <span>Farmer Net Settlement</span>
            <strong>₹{netSettlement.toLocaleString("en-IN")}</strong>
          </div>
        </div>

        <div className="settlement-note">
          <Info aria-hidden="true" />
          <p>
            <b>Settlement confirmed with farmer.</b> All costs are accurate and have been deducted. Details available.
          </p>
        </div>

        <div className="settlement-actions">
          <button
            className="settlement-complete"
            type="button"
            onClick={() => router.push("/farmer/earnings")}
          >
            <span>Settlement Completed</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #173c36;
          background:
            linear-gradient(
              180deg,
              rgba(235, 249, 245, 0.97) 0%,
              rgba(242, 251, 248, 0.96) 58%,
              rgba(218, 240, 231, 0.97) 100%
            ),
            url("/roleselect-bg.jpg") center bottom / cover no-repeat;
          position: relative;
          overflow: hidden;
        }

        .step-shell::before {
          content: "";
          position: fixed;
          left: -8%;
          right: -8%;
          bottom: -13%;
          height: 31%;
          pointer-events: none;
          background:
            radial-gradient(70% 100% at 8% 100%, rgba(183, 226, 209, 0.86) 0 48%, transparent 49%),
            radial-gradient(70% 90% at 92% 100%, rgba(201, 236, 224, 0.93) 0 52%, transparent 53%);
          opacity: 0.9;
          z-index: 0;
        }

        .step-shell-header {
          min-height: 47px;
          padding: 7px 16px;
          border: 0;
          border-radius: 0 0 17px 17px;
          background: rgba(255, 255, 255, 0.58);
          box-shadow: 0 4px 18px rgba(41, 107, 91, 0.055);
          backdrop-filter: blur(9px);
          position: relative;
          z-index: 5;
        }

        .step-shell-brand {
          gap: 7px;
        }

        .brandmark.small {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4eaa72;
          color: #fff;
          box-shadow: none;
        }

        .brandmark.small svg {
          width: 15px;
          height: 15px;
        }

        .step-shell-brand b {
          color: #173c38;
          font: 700 13px/1 "Manrope", Arial, sans-serif;
          letter-spacing: -0.35px;
        }

        .step-progress {
          min-width: 154px;
          gap: 8px;
        }

        .step-progress-track {
          height: 5px;
          background: #d7ebe4;
          border-radius: 999px;
        }

        .step-progress-fill {
          background: #86c85f;
        }

        .step-progress span {
          color: #607d76;
          font-size: 8px;
          font-weight: 500;
        }

        .step-shell-main {
          width: min(445px, calc(100vw - 32px));
          max-width: 445px;
          margin: 32px auto 0;
          padding: 20px 24px 18px;
          background: rgba(250, 255, 253, 0.78);
          border: 1px solid rgba(216, 236, 229, 0.96);
          border-radius: 11px;
          box-shadow:
            0 8px 24px rgba(39, 95, 78, 0.08),
            0 10px 0 -3px rgba(236, 248, 244, 0.92),
            0 17px 0 -8px rgba(225, 242, 235, 0.92);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #4c7168;
          font-size: 9px;
          font-weight: 500;
          gap: 5px;
          margin-bottom: 10px;
        }

        .step-back svg {
          width: 13px;
          height: 13px;
        }

        .eyebrow {
          color: #718d85;
          font-size: 8px;
          line-height: 1.2;
          letter-spacing: 1.15px;
          font-weight: 700;
        }

        .step-shell-main h1 {
          margin: 5px 0 17px;
          color: #0d1916;
          font: 700 22px/1.08 "Manrope", Arial, sans-serif;
          letter-spacing: -0.75px;
        }

        .step-body {
          margin-top: 0;
        }

        .settlement-target {
          width: 100%;
        }

        .settlement-ledger {
          padding: 0 1px;
        }

        .ledger-row {
          min-height: 19px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          color: #334942;
          font-size: 9px;
          line-height: 1.2;
        }

        .ledger-row strong {
          color: #182923;
          font-size: 9px;
          font-weight: 600;
          white-space: nowrap;
        }

        .settlement-divider {
          height: 1px;
          margin: 9px 0 9px;
          background: #dceae5;
        }

        .net-row {
          min-height: 35px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: #3b4f49;
          font-size: 9px;
        }

        .net-row strong {
          color: #111b18;
          font: 800 20px/1 "Manrope", Arial, sans-serif;
          letter-spacing: -0.5px;
          white-space: nowrap;
        }

        .settlement-note {
          min-height: 39px;
          margin-top: 32px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 7px;
          background: rgba(226, 244, 236, 0.88);
          color: #3b5d54;
          font-size: 7px;
          line-height: 1.3;
        }

        .settlement-note svg {
          width: 13px;
          height: 13px;
          flex: 0 0 auto;
          margin-top: 1px;
          color: #4f8977;
          fill: #4f8977;
          stroke: #fff;
          stroke-width: 2.3;
        }

        .settlement-note p {
          margin: 0;
        }

        .settlement-note b {
          color: #27463f;
          font-weight: 700;
        }

        .settlement-actions {
          margin-top: 12px;
        }

        .settlement-complete {
          width: 100%;
          min-height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          border: 0;
          border-radius: 6px;
          background: linear-gradient(90deg, #103e2c 0%, #188b59 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: none;
        }

        .settlement-complete:hover {
          background: linear-gradient(90deg, #0d3626 0%, #147b4f 100%);
        }

        .settlement-complete svg {
          width: 13px;
          height: 13px;
          stroke-width: 2.2;
        }

        @media (max-width: 640px) {
          .step-shell-header {
            min-height: 45px;
            padding: 7px 13px;
          }

          .step-shell-brand b {
            font-size: 12px;
          }

          .step-progress {
            min-width: 116px;
            gap: 6px;
          }

          .step-progress-track {
            min-width: 58px;
          }

          .step-progress span {
            font-size: 7px;
          }

          .step-shell-main {
            width: calc(100vw - 22px);
            margin-top: 20px;
            padding: 17px 14px 15px;
            border-radius: 12px;
          }

          .step-back {
            font-size: 9px;
            margin-bottom: 9px;
          }

          .step-shell-main h1 {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .ledger-row {
            font-size: 9px;
          }

          .net-row strong {
            font-size: 19px;
          }

          .settlement-note {
            margin-top: 27px;
            font-size: 7px;
          }
        }

        @media (min-width: 641px) and (max-width: 900px) {
          .step-shell-main {
            margin-top: 28px;
          }
        }
      `}</style>
    </StepShell>
  );
}
