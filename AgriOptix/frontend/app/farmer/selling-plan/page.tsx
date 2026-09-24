"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Bell, Leaf, UserRound } from "lucide-react";
import { useWorkflow, api } from "../../../lib/store";

export default function SellingPlan() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [opt, setOpt] = useState<any>(wf.optimization);
  const [loading, setLoading] = useState(!wf.optimization);

  useEffect(() => {
    if (wf.optimization) return;

    api("/api/optimization/run", { method: "POST" })
      .then((res) => {
        setOpt(res);
        setWf({ optimization: res });
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buyer = opt?.selected_buyer || "Buyer B";
  const quantity = opt?.quantity_kg ?? 1550;
  const vehicle = opt?.vehicle || "2 × 1-ton vehicles";
  const delivery = opt?.delivery || "Today, 6:30 PM";
  const loss = opt?.expected_value_loss ?? 1085;
  const net = opt?.net_realized_return;

  return (
    <div className="selling-plan-page">
      <style jsx>{`
        .selling-plan-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.8), transparent 52%),
            linear-gradient(180deg, #eafaf5 0%, #f3fcf9 48%, #e7f8f2 100%);
          color: #164d3b;
          font-family: "DM Sans", Arial, sans-serif;
        }

        .selling-plan-page::before,
        .selling-plan-page::after {
          content: "";
          position: absolute;
          z-index: 0;
          pointer-events: none;
          opacity: 0.9;
        }

        .selling-plan-page::before {
          width: 125%;
          height: 180px;
          left: -12%;
          bottom: -58px;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          background: rgba(190, 235, 220, 0.5);
          transform: rotate(-2deg);
        }

        .selling-plan-page::after {
          width: 120%;
          height: 145px;
          left: -8%;
          bottom: -72px;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          background: rgba(210, 244, 235, 0.82);
          transform: rotate(1deg);
        }

        .sp-header {
          position: relative;
          z-index: 3;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 44px;
          background: rgba(248, 255, 252, 0.82);
          border-bottom: 1px solid rgba(181, 225, 212, 0.4);
          box-shadow: 0 7px 24px rgba(37, 112, 87, 0.08);
          backdrop-filter: blur(10px);
        }

        .sp-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #123f32;
        }

        .sp-brand-mark {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          color: #2f9d70;
          transform: rotate(-12deg);
        }

        .sp-brand-name {
          font: 800 30px/1 "Manrope", Arial, sans-serif;
          letter-spacing: -1.1px;
        }

        .sp-header-actions {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .sp-icon-button {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: #155943;
          cursor: pointer;
        }

        .sp-profile {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #d7f4e8;
          color: #197153;
        }

        .sp-leaves {
          position: absolute;
          z-index: 1;
          pointer-events: none;
          color: #35aa79;
          opacity: 0.75;
        }

        .sp-leaves-left {
          left: -15px;
          bottom: -4px;
          transform: rotate(-12deg);
        }

        .sp-leaves-right {
          right: -18px;
          bottom: -2px;
          transform: rotate(14deg) scaleX(-1);
        }

        .sp-main {
          position: relative;
          z-index: 2;
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 24px 110px;
        }

        .sp-card {
          width: min(1185px, 100%);
          min-height: 540px;
          padding: 39px 55px 32px;
          border-radius: 20px;
          background: rgba(249, 255, 252, 0.76);
          border: 1px solid rgba(207, 235, 225, 0.72);
          box-shadow: 0 20px 55px rgba(48, 113, 91, 0.09);
          backdrop-filter: blur(8px);
        }

        .sp-back {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #21634d;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
        }

        .sp-eyebrow {
          margin-top: 17px;
          color: #6c817b;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3.3px;
        }

        .sp-title {
          margin: 10px 0 15px;
          color: #104f3a;
          font: 800 clamp(38px, 4vw, 46px)/1.05 "Manrope", Arial, sans-serif;
          letter-spacing: -1.8px;
        }

        .sp-net {
          margin-top: 12px;
          padding: 23px 28px 25px;
          border-radius: 15px;
          background: linear-gradient(105deg, #0d6245 0%, #07543b 100%);
          color: white;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .sp-net-label {
          display: block;
          margin-bottom: 5px;
          font-size: 17px;
          font-weight: 500;
          color: #d8ebe3;
        }

        .sp-net-value {
          display: block;
          color: #d8ff83;
          font: 800 clamp(42px, 5vw, 51px)/1 "Manrope", Arial, sans-serif;
          letter-spacing: -1.7px;
        }

        .sp-plan-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 17px;
          color: #4f6960;
          font-size: 18px;
        }

        .sp-plan-row strong {
          color: #47645a;
          font-weight: 800;
        }

        .sp-route {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 19px;
          color: #536d63;
          font-size: 17px;
        }

        .sp-route svg {
          color: #3d6f5c;
        }

        .sp-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
          margin-top: 23px;
          color: #6d8079;
          font-size: 16px;
        }

        .sp-meta span:last-child {
          text-align: right;
        }

        .sp-actions {
          display: grid;
          grid-template-columns: 310px 1fr;
          gap: 14px;
          margin-top: 30px;
        }

        .sp-action {
          min-height: 60px;
          border-radius: 13px;
          padding: 14px 24px;
          font-size: 19px;
          font-weight: 800;
          cursor: pointer;
        }

        .sp-secondary {
          border: 1px solid #b9dcd0;
          background: rgba(255, 255, 255, 0.72);
          color: #155943;
          box-shadow: 0 2px 7px rgba(29, 91, 69, 0.05);
        }

        .sp-primary {
          border: 1px solid #b9e85f;
          background: linear-gradient(90deg, #c5f26c, #baf05d);
          color: #164426;
        }

        .sp-loading {
          color: #526c61;
          font-size: 18px;
          padding: 90px 0;
        }

        @media (max-width: 900px) {
          .sp-header {
            height: 70px;
            padding: 0 24px;
          }

          .sp-brand-name {
            font-size: 25px;
          }

          .sp-main {
            min-height: calc(100vh - 70px);
            padding: 24px 18px 100px;
          }

          .sp-card {
            padding: 32px 32px 28px;
          }

          .sp-actions {
            grid-template-columns: 1fr 1.5fr;
          }
        }

        @media (max-width: 640px) {
          .sp-header {
            padding: 0 16px;
          }

          .sp-brand-mark {
            width: 42px;
            height: 42px;
          }

          .sp-brand-name {
            font-size: 23px;
          }

          .sp-header-actions {
            gap: 4px;
          }

          .sp-icon-button {
            width: 38px;
            height: 38px;
          }

          .sp-profile {
            width: 40px;
            height: 40px;
          }

          .sp-main {
            align-items: flex-start;
            padding: 16px 10px 80px;
          }

          .sp-card {
            min-height: auto;
            padding: 26px 18px 22px;
            border-radius: 16px;
          }

          .sp-back {
            font-size: 15px;
          }

          .sp-eyebrow {
            margin-top: 15px;
            font-size: 10px;
            letter-spacing: 2.3px;
          }

          .sp-title {
            font-size: 37px;
            margin-top: 8px;
          }

          .sp-net {
            padding: 18px 19px 20px;
          }

          .sp-net-label {
            font-size: 14px;
          }

          .sp-net-value {
            font-size: 38px;
          }

          .sp-plan-row,
          .sp-route {
            font-size: 14px;
            gap: 8px;
          }

          .sp-meta {
            grid-template-columns: 1fr;
            gap: 8px;
            font-size: 13px;
          }

          .sp-meta span:last-child {
            text-align: left;
          }

          .sp-actions {
            grid-template-columns: 1fr;
            gap: 10px;
            margin-top: 24px;
          }

          .sp-action {
            min-height: 53px;
            font-size: 16px;
          }

          .sp-leaves {
            transform: scale(0.75);
          }
        }
      `}</style>

      <header className="sp-header">
        <div className="sp-brand">
          <div className="sp-brand-mark" aria-hidden="true">
            <Leaf size={45} strokeWidth={1.8} />
          </div>
          <div className="sp-brand-name">AgriOptix</div>
        </div>
        <div className="sp-header-actions">
          <button className="sp-icon-button" aria-label="Notifications">
            <Bell size={28} strokeWidth={1.7} />
          </button>
          <div className="sp-profile" aria-hidden="true">
            <UserRound size={27} strokeWidth={1.8} />
          </div>
        </div>
      </header>

      <main className="sp-main">
        <div className="sp-card">
          <button className="sp-back" onClick={() => router.push("/farmer/buyers")}>
            <ArrowLeft size={21} strokeWidth={2} />
            Back
          </button>

          <div className="sp-eyebrow">OPTIMAL SELLING PLAN</div>
          <h1 className="sp-title">{loading ? "Building your plan…" : buyer}</h1>

          {loading ? (
            <div className="sp-loading">Preparing your optimized selling plan…</div>
          ) : (
            <>
              <section className="sp-net">
                <span className="sp-net-label">Expected Net Realization</span>
                <strong className="sp-net-value">
                  ₹{(net ?? 34330).toLocaleString("en-IN")}
                </strong>
              </section>

              <div className="sp-plan-row">
                <strong>{quantity} kg</strong>
                <span>•</span>
                <span>{vehicle}</span>
              </div>

              <div className="sp-route">
                <span>Farm</span>
                <ArrowRight size={17} />
                <span>Aggregation</span>
                <ArrowRight size={17} />
                <span>{buyer}</span>
              </div>

              <div className="sp-meta">
                <span>Delivery: {delivery}</span>
                <span>Expected value loss: ₹{Number(loss).toLocaleString("en-IN")}</span>
              </div>

              <div className="sp-actions">
                <button
                  className="sp-action sp-secondary"
                  onClick={() => router.push("/farmer/why-plan")}
                >
                  Why This Plan?
                </button>
                <button
                  className="sp-action sp-primary"
                  onClick={() => router.push("/farmer/why-plan")}
                >
                  Continue
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <div className="sp-leaves sp-leaves-left" aria-hidden="true">
        <Leaf size={135} strokeWidth={1.2} />
      </div>
      <div className="sp-leaves sp-leaves-right" aria-hidden="true">
        <Leaf size={150} strokeWidth={1.2} />
      </div>
    </div>
  );
}
