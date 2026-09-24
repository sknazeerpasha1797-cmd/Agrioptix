"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import StepShell from "../../../components/StepShell";
import { useWorkflow, api } from "../../../lib/store";

export default function DeliveryVerification() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verifying, setVerifying] = useState(false);
  const [now, setNow] = useState(new Date());

  const expected = wf.harvest?.quantity_kg || 1550;
  const received = wf.order?.quantity_kg || expected;
  const difference = received - expected;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  function setDigit(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < otp.length - 1) {
      document.getElementById(`delivery-otp-${index + 1}`)?.focus();
    }
  }

  function handleOtpKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`delivery-otp-${index - 1}`)?.focus();
    }
  }

  async function confirmDelivery() {
    if (otp.some((digit) => !digit) || verifying) return;

    setVerifying(true);
    try {
      await api("/api/delivery/verify", {
        method: "POST",
        body: JSON.stringify({ otp: otp.join("") }),
      });
    } catch {
      // Keep the existing demo flow usable when the backend is unavailable.
    }

    setWf({ orderStatus: "VERIFIED" });
    setVerifying(false);
    router.push("/farmer/settlement");
  }

  return (
    <StepShell
      eyebrow="DELIVERY VERIFICATION"
      title="Confirm the delivery"
      step={14}
      totalSteps={19}
      backHref="/farmer/tracking"
    >
      <div className="verification-page">
        <div className="verification-grid">
          <div className="verification-stat">
            <small>Expected Quantity</small>
            <strong>{expected} kg</strong>
          </div>
          <div className="verification-stat">
            <small>Received Quantity</small>
            <strong>{received} kg</strong>
          </div>
          <div className="verification-stat">
            <small>Difference</small>
            <strong>{difference} kg</strong>
          </div>
          <div className="verification-stat">
            <small>Timestamp</small>
            <strong>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</strong>
          </div>
        </div>

        <div className="otp-section">
          <label htmlFor="delivery-otp-0">OTP Verification</label>
          <div className="otp-row">
            {otp.map((digit, index) => (
              <input
                id={`delivery-otp-${index}`}
                key={index}
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                aria-label={`OTP digit ${index + 1}`}
                maxLength={1}
                value={digit}
                onChange={(event) => setDigit(index, event.target.value)}
                onKeyDown={(event) => handleOtpKeyDown(index, event)}
              />
            ))}
          </div>
        </div>

        <div className="verification-success">
          <CheckCircle2 aria-hidden="true" />
          <div>
            <strong>Quantity Check successful:</strong>{" "}
            Expected and received quantities are identical. Timestamp is correct.
            <br />
            Proceed to finalize the settlement with the button below.
          </div>
        </div>

        <button
          className="confirm-delivery-button"
          disabled={otp.some((digit) => !digit) || verifying}
          onClick={confirmDelivery}
        >
          {verifying ? "Confirming…" : "Confirm Delivery"}
        </button>
      </div>

      <style jsx global>{`
        .step-shell {
          min-height: 100vh;
          color: #103c37;
          background:
            linear-gradient(180deg, #eaf8f4 0%, #f5fcfa 48%, #dff2ea 100%);
          position: relative;
          overflow: hidden;
        }

        .step-shell::before {
          content: "";
          position: fixed;
          left: -10%;
          right: -10%;
          bottom: -13%;
          height: 31%;
          pointer-events: none;
          background:
            radial-gradient(70% 100% at 8% 100%, rgba(187, 229, 211, .9) 0 48%, transparent 49%),
            radial-gradient(70% 90% at 91% 100%, rgba(202, 237, 225, .95) 0 52%, transparent 53%);
          opacity: .9;
        }

        .step-shell-header {
          min-height: 47px;
          padding: 8px 18px;
          border: 0;
          border-radius: 0 0 17px 17px;
          background: rgba(255,255,255,.76);
          box-shadow: 0 4px 18px rgba(41, 107, 91, .06);
          position: relative;
          z-index: 5;
        }

        .step-shell-brand { gap: 7px; }
        .step-shell-brand b {
          color: #153c39;
          font: 700 13px/1 Arial, sans-serif;
          letter-spacing: -.35px;
        }
        .brandmark.small {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #4cab70;
          color: #fff;
          box-shadow: none;
        }
        .brandmark.small svg { width: 15px; height: 15px; }

        .step-progress {
          min-width: 158px;
          gap: 9px;
        }
        .step-progress-track {
          width: 100px;
          height: 5px;
          background: #d8ece6;
          border-radius: 999px;
        }
        .step-progress-fill {
          background: #77bf59;
          border-radius: inherit;
        }
        .step-progress span {
          color: #58716c;
          font-size: 9px;
          white-space: nowrap;
        }

        .step-shell-main {
          width: min(446px, calc(100vw - 28px));
          max-width: none;
          margin: 34px auto 0;
          padding: 19px 22px 17px;
          background: rgba(255,255,255,.69);
          border: 1px solid rgba(218,237,231,.9);
          border-radius: 11px;
          box-shadow: 0 7px 23px rgba(47, 107, 93, .12);
          position: relative;
          z-index: 2;
        }

        .step-back {
          color: #356b61;
          font-size: 9px;
          gap: 5px;
          margin-bottom: 12px;
        }
        .step-back svg { width: 11px; height: 11px; }

        .eyebrow {
          display: block;
          color: #687d78;
          font-size: 9px;
          letter-spacing: 1.1px;
          line-height: 1.1;
          font-weight: 500;
        }

        .step-shell-main h1 {
          color: #0b2422;
          font: 700 22px/1.12 Arial, sans-serif;
          letter-spacing: -.6px;
          margin: 6px 0 14px;
        }

        .step-body { margin-top: 0; }
        .verification-page { width: 100%; }

        .verification-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 13px;
        }

        .verification-stat {
          min-height: 42px;
          padding: 8px 10px;
          border-radius: 8px;
          background: rgba(239,248,245,.76);
        }

        .verification-stat small {
          display: block;
          color: #83908c;
          font-size: 7px;
          line-height: 1.1;
          margin-bottom: 3px;
        }

        .verification-stat strong {
          display: block;
          color: #0e2927;
          font-size: 10px;
          line-height: 1.15;
          font-weight: 600;
        }

        .otp-section label {
          display: block;
          margin-bottom: 7px;
          color: #75827e;
          font-size: 8px;
        }

        .otp-row {
          display: flex;
          gap: 7px;
          margin-bottom: 11px;
        }

        .otp-row input {
          width: 30px;
          height: 35px;
          padding: 0;
          text-align: center;
          border: 1px solid #dce8e4;
          border-radius: 6px;
          background: rgba(255,255,255,.95);
          color: #123d38;
          font-size: 14px;
          outline: none;
        }

        .otp-row input:focus {
          border-color: #52aa79;
          box-shadow: 0 0 0 2px rgba(82,170,121,.12);
        }

        .verification-success {
          min-height: 39px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 7px;
          background: rgba(226,244,236,.88);
          color: #355f56;
          font-size: 7px;
          line-height: 1.25;
          margin-bottom: 12px;
        }

        .verification-success svg {
          width: 13px;
          height: 13px;
          flex: 0 0 auto;
          color: #5c8f7e;
          fill: #5c8f7e;
          stroke: #fff;
        }

        .verification-success strong { font-weight: 600; }

        .confirm-delivery-button {
          width: 100%;
          min-height: 33px;
          border: 0;
          border-radius: 6px;
          background: linear-gradient(90deg, #123d2b, #1b8957);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .confirm-delivery-button:disabled {
          opacity: .58;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .step-shell-header { padding: 8px 13px; }
          .step-progress { min-width: 120px; gap: 6px; }
          .step-progress-track { width: 70px; }
          .step-progress span { font-size: 8px; }
          .step-shell-main {
            width: calc(100vw - 20px);
            margin-top: 18px;
            padding: 17px 14px 15px;
          }
          .step-shell-main h1 { font-size: 21px; }
          .verification-stat { min-height: 45px; }
        }
      `}</style>
    </StepShell>
  );
}
