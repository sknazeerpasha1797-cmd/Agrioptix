"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

export default function SmartAggregation() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [agg, setAgg] = useState<any>(wf.aggregation);

  useEffect(() => {
    if (wf.aggregation) return;
    api("/api/aggregation/cluster", { method: "POST" }).then((res) => {
      setAgg(res);
      setWf({ aggregation: res });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const farmers = agg?.farmers?.length
    ? agg.farmers
    : [
        { name: "Farmer 1", quantity_kg: 450 },
        { name: "Farmer 2", quantity_kg: 300 },
        { name: "Farmer 3", quantity_kg: 500 },
        { name: "Farmer 4", quantity_kg: 300 },
      ];

  const totalKg = agg?.total_kg ?? 1550;
  const aggregationPoint = agg?.aggregation_point || "Hyderabad North Aggregation Hub";

  return (
    <StepShell
      eyebrow="SMART AGGREGATION"
      title="Nearby Farmers Aggregated"
      step={10}
      totalSteps={19}
      backHref="/farmer/why-plan"
      wide
    >
      <div className="aggregation-page">
        <div className="aggregation-map" aria-label="Nearby farmers and aggregation hub map">
          <svg viewBox="0 0 760 230" role="img" aria-hidden="true">
            <defs>
              <filter id="agg-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#527064" floodOpacity=".2" />
              </filter>
              <radialGradient id="farmer-node" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#8dcc6a" />
                <stop offset="100%" stopColor="#318d2f" />
              </radialGradient>
            </defs>

            <g stroke="#779f8e" strokeWidth="1.5" strokeDasharray="5 5" opacity=".9">
              <line x1="250" y1="70" x2="430" y2="116" />
              <line x1="310" y1="118" x2="430" y2="116" />
              <line x1="265" y1="170" x2="430" y2="116" />
            </g>

            <g filter="url(#agg-shadow)">
              <circle cx="250" cy="70" r="13" fill="url(#farmer-node)" stroke="#d9f0cf" strokeWidth="5" />
              <circle cx="310" cy="118" r="13" fill="#a4d96b" stroke="#e2f2d8" strokeWidth="5" />
              <circle cx="265" cy="170" r="13" fill="#7b9b91" stroke="#d9e6e0" strokeWidth="5" />
              <circle cx="430" cy="116" r="14" fill="#183f36" stroke="#a9c4b9" strokeWidth="4" />
            </g>

            <text x="448" y="120" fill="#24463e" fontSize="12" fontFamily="DM Sans, sans-serif">
              {aggregationPoint}
            </text>
          </svg>
        </div>

        <div className="aggregation-stats">
          <div className="aggregation-stat">
            <small>Farmers</small>
            <strong>{farmers.length}</strong>
          </div>
          <div className="aggregation-stat">
            <small>Total Quantity</small>
            <strong>{Number(totalKg).toLocaleString("en-IN")} kg</strong>
          </div>
          <div className="aggregation-stat aggregation-stat-point">
            <small>Aggregation Point</small>
            <strong>{aggregationPoint}</strong>
          </div>
          <div className="aggregation-stat">
            <small>Reduced Transport Cost</small>
            <strong>-28%</strong>
          </div>
        </div>

        <div className="aggregation-farmers">
          {farmers.map((farmer: any, index: number) => (
            <span className="aggregation-chip" key={`${farmer.name}-${index}`}>
              {farmer.name} · {farmer.quantity_kg} kg
            </span>
          ))}
        </div>

        <div className="step-actions aggregation-actions">
          <button className="primary" onClick={() => router.push("/farmer/optimization")}>
            Confirm Aggregation
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #123f3b;
          background:
            radial-gradient(70% 45% at 12% 95%, rgba(197, 233, 221, 0.9) 0 48%, transparent 49%),
            radial-gradient(75% 48% at 92% 94%, rgba(207, 237, 226, 0.95) 0 48%, transparent 49%),
            linear-gradient(180deg, #effaf7 0%, #f4fbf8 58%, #e2f4ed 100%);
          position: relative;
          overflow: hidden;
        }

        .step-shell::after {
          content: "";
          position: fixed;
          left: -5%;
          right: -5%;
          bottom: -70px;
          height: 180px;
          pointer-events: none;
          background:
            radial-gradient(50% 100% at 8% 100%, rgba(113, 191, 154, 0.62) 0 28%, transparent 29%),
            radial-gradient(48% 100% at 92% 100%, rgba(113, 191, 154, 0.58) 0 27%, transparent 28%);
          opacity: .85;
        }

        .step-shell-header {
          min-height: 58px;
          padding: 8px 40px;
          border: 0;
          border-radius: 0 0 24px 24px;
          background: rgba(255, 255, 255, .78);
          box-shadow: 0 5px 18px rgba(43, 108, 91, .07);
          backdrop-filter: blur(10px);
          position: relative;
          z-index: 10;
        }

        .step-shell-brand { gap: 9px; }

        .step-shell-brand b {
          color: #0d3935;
          font: 800 21px/1 "Manrope", sans-serif;
          letter-spacing: -.8px;
        }

        .brandmark.small {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: #4bb875;
          color: white;
          box-shadow: inset 0 0 0 2px rgba(255,255,255,.16);
        }

        .brandmark.small svg { width: 22px; height: 22px; }

        .step-progress { min-width: 165px; gap: 9px; }
        .step-progress-track { height: 6px; background: #d6ece5; }
        .step-progress-fill { background: #8ccf62; }
        .step-progress span { color: #4b7169; font-size: 10px; font-weight: 500; }

        .step-shell-main.wide {
          max-width: 810px;
          margin: 14px auto 0;
          padding: 15px 19px 12px;
          background: rgba(255,255,255,.66);
          border: 1px solid rgba(218,240,234,.95);
          border-radius: 15px;
          box-shadow: 0 8px 28px rgba(43,108,91,.08);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #24725c;
          font-size: 10px;
          font-weight: 500;
          gap: 5px;
          margin-bottom: 7px;
        }

        .step-back svg { width: 14px; height: 14px; }

        .step-shell-main .eyebrow {
          color: #799b91;
          font-size: 9px;
          letter-spacing: 1.2px;
          line-height: 1.2;
        }

        .step-shell-main h1 {
          color: #103f3a;
          font: 800 22px/1.08 "Manrope", sans-serif;
          letter-spacing: -.8px;
          margin: 4px 0 7px;
        }

        .step-body { margin-top: 0; }

        .aggregation-page { width: 100%; }

        .aggregation-map {
          height: 158px;
          border: 1px solid #d5ebe3;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(239,249,244,.9), rgba(219,239,227,.92));
          overflow: hidden;
        }

        .aggregation-map svg { width: 100%; height: 100%; display: block; }

        .aggregation-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 7px;
          margin-top: 9px;
        }

        .aggregation-stat {
          min-height: 58px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 7px 8px;
          border: 1px solid #d5ebe3;
          border-radius: 9px;
          background: rgba(255,255,255,.62);
          color: #1b4a42;
        }

        .aggregation-stat small {
          color: #789087;
          font-size: 7px;
          margin-bottom: 4px;
        }

        .aggregation-stat strong {
          color: #183f3a;
          font-size: 11px;
          font-weight: 600;
          line-height: 1.25;
        }

        .aggregation-stat-point {
          box-shadow: 0 5px 14px rgba(36,90,76,.13);
        }

        .aggregation-farmers {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 8px;
        }

        .aggregation-chip {
          display: inline-flex;
          align-items: center;
          min-height: 18px;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(207,238,224,.82);
          color: #2e6559;
          font-size: 7px;
          white-space: nowrap;
        }

        .aggregation-actions {
          margin-top: 11px;
          display: block;
        }

        .aggregation-actions .primary {
          min-height: 34px;
          width: 100%;
          border-radius: 9px;
          background: linear-gradient(90deg, #9edbbd, #8ed7b7);
          color: #245c50;
          font-size: 12px;
          font-weight: 600;
          box-shadow: none;
        }

        .aggregation-actions .primary:hover { background: #86ceb0; }

        @media (max-width: 900px) {
          .step-shell-header { padding: 8px 24px; }
          .step-shell-main.wide { margin: 12px 18px 0; }
          .aggregation-map { height: 180px; }
        }

        @media (max-width: 640px) {
          .step-shell-header {
            min-height: 56px;
            padding: 8px 14px;
            border-radius: 0 0 18px 18px;
          }

          .step-shell-brand b { font-size: 18px; }
          .brandmark.small { width: 32px; height: 32px; }
          .brandmark.small svg { width: 20px; height: 20px; }
          .step-progress { min-width: 112px; gap: 6px; }
          .step-progress-track { min-width: 55px; }
          .step-progress span { font-size: 8px; }

          .step-shell-main.wide {
            margin: 10px 9px 0;
            padding: 13px 11px 11px;
            border-radius: 13px;
          }

          .step-shell-main h1 { font-size: 20px; }
          .step-back { font-size: 10px; }
          .aggregation-map { height: 165px; }

          .aggregation-stats {
            grid-template-columns: 1fr 1fr;
            gap: 6px;
          }

          .aggregation-stat { min-height: 56px; }
          .aggregation-stat strong { font-size: 10px; }
          .aggregation-farmers { gap: 4px; }
          .aggregation-chip { font-size: 7px; }
        }
      `}</style>
    </StepShell>
  );
}
