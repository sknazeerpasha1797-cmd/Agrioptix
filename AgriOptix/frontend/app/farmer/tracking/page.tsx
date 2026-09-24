"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Info } from "lucide-react";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

const STAGES = ["PLANNED", "PICKUP_ASSIGNED", "PICKED_UP", "IN_TRANSIT", "DELIVERED"];

export default function Tracking() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const idx = Math.max(0, STAGES.indexOf(wf.orderStatus));

  // Keep the tracking screen synchronized with the workflow state. The backend
  // is updated before the UI advances, so the next step always reflects the
  // real order transition rather than a visual-only state change.
  useEffect(() => {
    if (wf.orderStatus === "DELIVERED") {
      router.prefetch("/farmer/verification");
    }
  }, [wf.orderStatus, router]);

  async function advance() {
    if (updating) return;

    // The tracking screen is the final delivery step in this flow.
    // Confirming it marks the shipment as DELIVERED on the backend and then
    // moves the user to the existing delivery-verification page.
    if (idx >= STAGES.length - 1) {
      router.push("/farmer/verification");
      return;
    }

    const orderId = wf.order?.id ?? 1;
    setUpdating(true);
    setError("");

    try {
      const response = await api(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "DELIVERED" }),
      });

      const confirmedStatus = response?.status || "DELIVERED";

      setWf({
        orderStatus: confirmedStatus,
        order: wf.order
          ? { ...wf.order, status: confirmedStatus }
          : wf.order,
      });

      // Only navigate after the server has accepted the status update.
      if (confirmedStatus === "DELIVERED") {
        router.push("/farmer/verification");
      } else {
        setError("Shipment was not marked as delivered. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update shipment status."
      );
    } finally {
      setUpdating(false);
    }
  }

  const markerX = 70 + (idx / (STAGES.length - 1)) * 250;
  const markerY = 184 - (idx / (STAGES.length - 1)) * 92;

  return (
    <StepShell
      eyebrow="LIVE TRACKING"
      title="Shipment Tracking"
      step={13}
      totalSteps={19}
      backHref="/farmer/order"
    >
      <div className="tracking-page">
        <div className="tracking-map" aria-label="Shipment route map">
          <svg viewBox="0 0 390 230" role="img" aria-hidden="true">
            <path
              d="M70 184 C130 120 210 168 262 137 C304 112 306 92 320 58"
              fill="none"
              stroke="#8bb64c"
              strokeWidth="3"
              strokeDasharray="7 6"
            />
            <circle cx="70" cy="184" r="8" fill="#102f25" stroke="#d4e6c7" strokeWidth="4" />
            <circle cx="320" cy="58" r="8" fill="#102f25" stroke="#d4e6c7" strokeWidth="4" />
            <circle cx={markerX} cy={markerY} r="6" fill="#d8f36f" opacity={idx === 0 || idx === 4 ? 0 : 1} />
          </svg>
        </div>

        <div className="tracking-statuses">
          <div className="tracking-status-column">
            {STAGES.slice(0, 3).map((stage, i) => (
              <div className={`tracking-status ${i <= idx ? "active" : ""}`} key={stage}>
                <span className="tracking-dot" />
                <span>{stage.replaceAll("_", " ")}</span>
              </div>
            ))}
          </div>
          <div className="tracking-status-column">
            {STAGES.slice(3).map((stage, i) => {
              const stageIndex = i + 3;
              return (
                <div className={`tracking-status ${stageIndex <= idx ? "active" : ""}`} key={stage}>
                  <span className="tracking-dot" />
                  <span>{stage.replaceAll("_", " ")}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="tracking-insights">
          <div className="tracking-alert">
            <AlertTriangle aria-hidden="true" />
            <div>
              <strong>Delivery Efficiency: MEDIUM-HIGH</strong> — a slightly longer delay is predicted.
            </div>
          </div>
          <div className="tracking-cost">
            <Info aria-hidden="true" />
            <div>
              <strong>Projected Cost Offset: -₹50.</strong>
              <br />
              The predicted delay may incur a small additional cost, which is partially offset by transport efficiencies.
              <br />
              <u>Details available.</u>
            </div>
          </div>
        </div>

        <div className="tracking-delay-scale" aria-label="Delivery efficiency scale">
          <div className="tracking-scale-bars">
            <span className="on-time" />
            <span className="slight" />
            <span className="noticeable" />
            <span className="high" />
          </div>
          <div className="tracking-scale-labels">
            <span>On-Time</span>
            <span>Slight Delay</span>
            <span>Noticeable Delay</span>
            <span>High Delay</span>
          </div>
        </div>

        <div className="tracking-action">
          <button className="tracking-arrived" disabled={idx < STAGES.length - 1}>
            Arrived — proceed to verification
          </button>
          {error ? <div className="tracking-error" role="alert">{error}</div> : null}
          <button className="primary" disabled={updating} onClick={advance}>
            {updating ? "Updating shipment…" : "Confirm and Continue →"}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #102f2b;
          background:
            radial-gradient(80% 55% at 50% 100%, rgba(207, 239, 226, 0.95), transparent 72%),
            linear-gradient(180deg, #e9f8f3 0%, #f4fbf8 54%, #e0f4eb 100%);
          overflow-x: hidden;
          position: relative;
        }

        .step-shell::before,
        .step-shell::after {
          content: "";
          position: fixed;
          pointer-events: none;
          z-index: 0;
        }

        .step-shell::before {
          left: -90px;
          right: -90px;
          bottom: -80px;
          height: 190px;
          border-radius: 50% 50% 0 0;
          background: rgba(188, 230, 215, 0.68);
          transform: rotate(-2deg);
        }

        .step-shell::after {
          width: 170px;
          height: 130px;
          right: -25px;
          bottom: -12px;
          background:
            radial-gradient(ellipse at 65% 65%, #55ad79 0 16%, transparent 17%),
            radial-gradient(ellipse at 38% 78%, #4da873 0 15%, transparent 16%),
            radial-gradient(ellipse at 78% 28%, #63b982 0 13%, transparent 14%),
            radial-gradient(ellipse at 25% 35%, #6cc18b 0 12%, transparent 13%);
          opacity: .72;
        }

        .step-shell-header {
          min-height: 52px;
          padding: 7px 18px;
          border: 0;
          border-radius: 0 0 22px 22px;
          background: rgba(255, 255, 255, 0.76);
          box-shadow: 0 4px 15px rgba(34, 95, 77, .07);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 3;
        }

        .step-shell-brand { gap: 7px; }
        .step-shell-brand b {
          color: #0d3935;
          font: 800 16px/1 "Manrope", sans-serif;
          letter-spacing: -.6px;
        }
        .brandmark.small {
          width: 29px;
          height: 29px;
          border-radius: 50%;
          background: #4aa66b;
          color: white;
        }
        .brandmark.small svg { width: 18px; height: 18px; }
        .step-progress { min-width: 170px; gap: 8px; }
        .step-progress-track { height: 5px; background: #d9ebe5; }
        .step-progress-fill { background: #69bb88; }
        .step-progress span { color: #50746b; font-size: 9px; font-weight: 500; }

        .step-shell-main {
          width: min(434px, calc(100% - 24px));
          margin: 8px auto 0;
          padding: 12px 14px 10px;
          background: rgba(255,255,255,.92);
          border: 1px solid rgba(210, 226, 220, .9);
          border-radius: 11px;
          box-shadow: 0 3px 12px rgba(35, 91, 75, .12);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #41695f;
          font-size: 9px;
          font-weight: 500;
          gap: 4px;
          margin-bottom: 5px;
        }
        .step-back svg { width: 12px; height: 12px; }
        .eyebrow {
          color: #6a766f;
          font-size: 8px;
          letter-spacing: 1px;
          line-height: 1.1;
        }
        .step-shell-main h1 {
          color: #0e1716;
          font: 800 22px/1.08 "Manrope", sans-serif;
          letter-spacing: -.7px;
          margin: 4px 0 6px;
        }
        .step-body { margin-top: 0; }

        .tracking-page { position: relative; }
        .tracking-map {
          height: 156px;
          border: 1px solid #d6e3d1;
          border-radius: 10px;
          background: linear-gradient(135deg, #edf4e7, #dcead4);
          overflow: hidden;
        }
        .tracking-map svg { display: block; width: 100%; height: 100%; }

        .tracking-statuses {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          padding: 8px 2px 0;
        }
        .tracking-status-column { position: relative; }
        .tracking-status-column:first-child::after,
        .tracking-status-column:last-child::after {
          content: "";
          position: absolute;
          top: 9px;
          bottom: 9px;
          width: 1px;
          background: #b9cfad;
          left: 4px;
          z-index: 0;
        }
        .tracking-status {
          position: relative;
          z-index: 1;
          min-height: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: #36453f;
          font-size: 8px;
          line-height: 1;
        }
        .tracking-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex: 0 0 auto;
          background: #83a15c;
          box-shadow: 0 0 0 2px #fff;
        }
        .tracking-status.active .tracking-dot { background: #7eb53b; }
        .tracking-status:nth-child(3) .tracking-dot { box-shadow: 0 0 0 2px #d9f2a7; }

        .tracking-insights {
          display: grid;
          grid-template-columns: 1fr 1.02fr;
          gap: 8px;
          margin-top: 1px;
          position: relative;
          z-index: 4;
        }
        .tracking-alert,
        .tracking-cost {
          min-height: 79px;
          border-radius: 8px;
          display: flex;
          gap: 8px;
          padding: 9px 10px;
          font-size: 9px;
          line-height: 1.25;
          box-shadow: 0 2px 8px rgba(45, 89, 72, .04);
        }
        .tracking-alert {
          background: #fff0f0;
          border: 1px solid #f0c8c8;
          color: #7a2525;
        }
        .tracking-cost {
          background: #e8f4ed;
          border: 1px solid #c9e1d5;
          color: #355c50;
        }
        .tracking-alert svg,
        .tracking-cost svg {
          flex: 0 0 auto;
          width: 17px;
          height: 17px;
        }
        .tracking-alert svg { color: #e44b55; fill: #e44b55; stroke: #fff; }
        .tracking-cost svg { color: #1d946d; fill: #1d946d; stroke: #fff; }
        .tracking-alert strong,
        .tracking-cost strong { font-weight: 700; }

        .tracking-delay-scale {
          width: calc(50% - 4px);
          margin-top: -79px;
          min-height: 79px;
          padding: 49px 10px 7px;
          box-sizing: border-box;
          position: relative;
          z-index: 5;
          color: #557067;
          font-size: 8px;
        }
        .tracking-scale-bars {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          height: 7px;
          overflow: hidden;
          border-radius: 5px;
          gap: 2px;
        }
        .tracking-scale-bars span { display: block; }
        .tracking-scale-bars .on-time { background: #2fba8c; }
        .tracking-scale-bars .slight { background: #30c79b; }
        .tracking-scale-bars .noticeable { background: #e7b52b; }
        .tracking-scale-bars .high { background: #df2735; }
        .tracking-scale-labels {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          margin-top: 5px;
          text-align: center;
        }
        .tracking-scale-labels span:nth-child(2) { color: #4a8f79; }
        .tracking-scale-labels span:nth-child(3) { color: #c29a20; }
        .tracking-scale-labels span:nth-child(4) { color: #93404a; }

        .tracking-action { margin-top: 7px; position: relative; z-index: 5; }
        .tracking-arrived {
          display: block;
          width: 100%;
          min-height: 29px;
          margin-bottom: 3px;
          border: 0;
          border-radius: 7px;
          background: #d9f58a;
          color: #6a765d;
          font-size: 12px;
          font-weight: 700;
        }
        .tracking-arrived:disabled { opacity: 1; }
        .tracking-error {
          margin: 0 0 4px;
          padding: 5px 8px;
          border-radius: 6px;
          background: #fff0f0;
          color: #9b3131;
          border: 1px solid #f0c8c8;
          font-size: 8px;
          line-height: 1.25;
        }

        .tracking-action .primary {
          width: 100%;
          min-height: 31px;
          border: 0;
          border-radius: 8px;
          background: #112f21;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          box-shadow: none;
        }
        .tracking-action .primary:disabled { opacity: 1; }

        @media (max-width: 640px) {
          .step-shell-header { padding: 7px 13px; }
          .step-shell-main { width: calc(100% - 16px); margin-top: 7px; padding: 11px 10px 9px; }
          .step-shell-brand b { font-size: 14px; }
          .brandmark.small { width: 27px; height: 27px; }
          .step-progress { min-width: 130px; }
          .step-progress span { font-size: 8px; }
          .step-progress-track { min-width: 60px; }
          .step-shell-main h1 { font-size: 20px; }
          .tracking-map { height: 142px; }
          .tracking-statuses { gap: 10px; }
          .tracking-insights { grid-template-columns: 1fr 1fr; gap: 5px; }
          .tracking-alert, .tracking-cost { font-size: 8px; padding: 8px; min-height: 84px; }
          .tracking-delay-scale { margin-top: -84px; min-height: 84px; padding-top: 55px; font-size: 7px; }
        }
      `}</style>
    </StepShell>
  );
}
