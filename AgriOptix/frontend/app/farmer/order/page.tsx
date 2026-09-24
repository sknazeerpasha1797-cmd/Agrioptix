"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

export default function OrderConfirmation() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [order, setOrder] = useState<any>(wf.order);

  useEffect(() => {
    if (wf.order) return;

    api("/api/orders", { method: "POST" }).then((res) => {
      setOrder(res);
      setWf({ order: res, orderStatus: "PLANNED" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const opt = wf.optimization;
  const orderNumber = `Order #ORD-2025-${String(order?.id ?? 1).padStart(3, "0")}`;
  const buyer = order?.buyer || opt?.selected_buyer || "Buyer B";
  const quantity = order?.quantity_kg ?? opt?.quantity_kg ?? 1550;
  const vehicle = opt?.vehicle || "2 × 1-ton vehicles";
  const route = opt?.route || "Farm → Aggregation Point → Buyer B";

  return (
    <StepShell
      eyebrow="ORDER CONFIRMATION"
      title="Your order is confirmed"
      step={12}
      totalSteps={19}
      backHref="/farmer/optimization"
    >
      <div className="order-confirmation-page">
        <div className="order-id">{orderNumber}</div>

        <div className="order-details">
          <div className="order-detail">Status: PLANNED</div>
          <div className="order-detail">Buyer: {buyer}</div>
          <div className="order-detail">Quantity: {quantity} kg</div>
          <div className="order-detail">Vehicle: {vehicle}</div>
          <div className="order-detail">Pickup: Tomorrow, 8:00 AM</div>
          <div className="order-detail">Route: {route}</div>
        </div>

        <div className="shipment-preview" aria-hidden="true" />

        <div className="order-actions">
          <button className="primary" onClick={() => router.push("/farmer/tracking")}>
            Track Shipment
          </button>
        </div>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #123f3b;
          background:
            linear-gradient(180deg, rgba(236, 249, 245, 0.96) 0%, rgba(240, 250, 247, 0.95) 62%, rgba(219, 241, 231, 0.94) 100%),
            url("/roleselect-bg.jpg") center bottom / cover no-repeat;
          position: relative;
          overflow-x: hidden;
        }

        .step-shell-header {
          min-height: 44px;
          padding: 5px 23px;
          border: 0;
          border-radius: 0 0 17px 17px;
          background: rgba(255, 255, 255, 0.56);
          box-shadow: 0 3px 12px rgba(43, 108, 91, 0.06);
          backdrop-filter: blur(8px);
          position: relative;
          z-index: 5;
        }

        .step-shell-brand {
          gap: 7px;
        }

        .brandmark.small {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #55a95c;
          color: #fff;
          box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.16);
        }

        .brandmark.small svg {
          width: 19px;
          height: 19px;
        }

        .step-shell-brand b {
          color: #103f3a;
          font: 800 19px/1 "Manrope", sans-serif;
          letter-spacing: -0.7px;
        }

        .step-progress {
          min-width: 164px;
          gap: 9px;
        }

        .step-progress-track {
          height: 6px;
          background: #d4e9e3;
          border-radius: 99px;
        }

        .step-progress-fill {
          background: #8dceb8;
        }

        .step-progress span {
          color: #58736e;
          font-size: 9px;
          font-weight: 500;
        }

        .step-shell-main {
          max-width: 810px;
          margin: 13px auto 0;
          padding: 13px 19px 12px;
          background: rgba(255, 255, 255, 0.69);
          border: 1px solid rgba(214, 237, 229, 0.94);
          border-radius: 15px;
          box-shadow: 0 7px 25px rgba(42, 101, 85, 0.09);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #286b5b;
          font-size: 10px;
          font-weight: 500;
          gap: 5px;
          margin-bottom: 7px;
          padding: 0;
        }

        .step-back svg {
          width: 14px;
          height: 14px;
        }

        .eyebrow {
          display: block;
          color: #78968f;
          font-size: 9px;
          line-height: 1.15;
          letter-spacing: 1.15px;
          font-weight: 700;
        }

        .step-shell-main h1 {
          color: #103f3a;
          font: 800 22px/1.08 "Manrope", sans-serif;
          letter-spacing: -0.75px;
          margin: 5px 0 6px;
        }

        .step-body {
          margin-top: 0;
        }

        .order-confirmation-page {
          width: 100%;
        }

        .order-id {
          color: #123f3b;
          font: 800 20px/1.15 "Manrope", sans-serif;
          letter-spacing: -0.55px;
          margin-bottom: 8px;
        }

        .order-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 62px;
          row-gap: 3px;
          margin-bottom: 10px;
          color: #24433e;
          font: 400 9px/1.3 "DM Sans", sans-serif;
        }

        .order-detail {
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .shipment-preview {
          width: 100%;
          height: 176px;
          border: 1px solid #c9e4da;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(244, 250, 247, 0.82), rgba(213, 239, 226, 0.82));
          margin-bottom: 11px;
        }

        .order-actions {
          display: block;
        }

        .order-actions .primary {
          width: 100%;
          min-height: 34px;
          border: 0;
          border-radius: 8px;
          background: #c0f15c;
          color: #17391f;
          font: 700 12px/1 "DM Sans", sans-serif;
          box-shadow: none;
        }

        .order-actions .primary:hover {
          background: #b3e94f;
        }

        @media (max-width: 900px) {
          .step-shell-header {
            padding: 5px 20px;
          }

          .step-shell-main {
            margin: 12px 18px 0;
          }

          .shipment-preview {
            height: 190px;
          }
        }

        @media (max-width: 640px) {
          .step-shell-header {
            min-height: 54px;
            padding: 7px 12px;
            border-radius: 0 0 16px 16px;
          }

          .brandmark.small {
            width: 31px;
            height: 31px;
          }

          .brandmark.small svg {
            width: 19px;
            height: 19px;
          }

          .step-shell-brand b {
            font-size: 18px;
          }

          .step-progress {
            min-width: 110px;
            gap: 6px;
          }

          .step-progress-track {
            min-width: 52px;
          }

          .step-progress span {
            font-size: 8px;
          }

          .step-shell-main {
            margin: 10px 9px 0;
            padding: 13px 12px 12px;
            border-radius: 13px;
          }

          .step-shell-main h1 {
            font-size: 21px;
            margin-bottom: 7px;
          }

          .order-id {
            font-size: 19px;
            margin-bottom: 10px;
          }

          .order-details {
            column-gap: 18px;
            row-gap: 5px;
            font-size: 10px;
          }

          .order-detail {
            white-space: normal;
          }

          .shipment-preview {
            height: 170px;
            margin-top: 2px;
            margin-bottom: 10px;
          }

          .order-actions .primary {
            min-height: 42px;
            font-size: 14px;
          }
        }
      `}</style>
    </StepShell>
  );
}
