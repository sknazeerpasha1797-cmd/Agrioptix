"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { useWorkflow, api } from "../../../lib/store";

const CROPS = ["Tomato", "Chilli", "Onion", "Brinjal"];

function formatQuantity(value: string) {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-IN");
}

export default function AddHarvest() {
  const router = useRouter();
  const { setWf } = useWorkflow();

  const [crop, setCrop] = useState("Tomato");
  const [quantity, setQuantity] = useState("1550");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("Use current location");
  const [saving, setSaving] = useState(false);

  async function next() {
    setSaving(true);

    let harvest;
    try {
      harvest = await api("/api/harvests", {
        method: "POST",
        body: JSON.stringify({
          crop,
          quantity_kg: Number(quantity),
          harvest_time: date || null,
        }),
      });
    } catch {
      harvest = {
        crop,
        quantity_kg: Number(quantity),
        harvest_time: date,
      };
    }

    setWf({ harvest, photos: [] });
    setSaving(false);
    router.push("/farmer/photos");
  }

  function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    setQuantity(digitsOnly);
  }

  return (
    <main className="harvest-page">
      <style jsx>{`
        .harvest-page {
          min-height: 100vh;
          box-sizing: border-box;
          background: #edf8f5;
          color: #102b24;
          padding: 44px 22px 56px;
          font-family: inherit;
        }

        .harvest-wrap {
          width: min(980px, 100%);
          margin: 0 auto;
        }

        .harvest-heading {
          display: flex;
          align-items: center;
          gap: 24px;
          margin: 0 0 28px;
        }

        .back-button {
          width: 54px;
          height: 54px;
          border: 0;
          background: transparent;
          color: #13775c;
          display: grid;
          place-items: center;
          border-radius: 50%;
          cursor: pointer;
          flex: 0 0 auto;
        }

        .back-button:hover {
          background: rgba(19, 119, 92, 0.08);
        }

        .heading-title {
          margin: 0;
          font-size: clamp(42px, 5vw, 64px);
          line-height: 1;
          letter-spacing: -2.4px;
          font-weight: 800;
          color: #0b493b;
        }

        .harvest-card {
          background: #ffffff;
          border: 1px solid #dcebe6;
          border-radius: 34px;
          padding: 48px 42px 42px;
          box-shadow:
            0 18px 50px rgba(21, 78, 61, 0.08),
            0 2px 7px rgba(21, 78, 61, 0.04);
        }

        .card-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
        }

        .card-title {
          margin: 0;
          font-size: clamp(34px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -1.7px;
          color: #083f33;
          font-weight: 800;
        }

        .card-next-icon {
          color: #58616a;
          flex: 0 0 auto;
        }

        .progress {
          display: flex;
          align-items: center;
          width: 100%;
          margin: 0 0 46px;
        }

        .progress-line {
          height: 2px;
          background: #d9dde0;
          flex: 1;
        }

        .progress-line.active {
          background: #21845f;
        }

        .progress-step {
          width: 62px;
          height: 62px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: #f6f7f8;
          border: 2px solid #d9dde0;
          color: #6b737a;
          font-size: 27px;
          font-weight: 700;
          box-sizing: border-box;
        }

        .progress-step.active {
          background: #21845f;
          border-color: #21845f;
          color: #ffffff;
          box-shadow: 0 7px 16px rgba(33, 132, 95, 0.18);
        }

        .question {
          margin: 0 0 26px;
          font-size: clamp(30px, 3.4vw, 42px);
          line-height: 1.12;
          letter-spacing: -1.2px;
          color: #111d35;
          font-weight: 800;
        }

        .field-label {
          display: block;
          margin: 0 0 12px;
          color: #465163;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
        }

        .crop-card {
          position: relative;
          min-height: 150px;
          border: 2px solid #dce3e6;
          border-radius: 23px;
          display: flex;
          align-items: center;
          gap: 30px;
          padding: 18px 26px 18px 24px;
          box-sizing: border-box;
          background: #ffffff;
          cursor: pointer;
          transition:
            border-color 0.18s ease,
            box-shadow 0.18s ease;
        }

        .crop-card:hover,
        .crop-card:focus-within {
          border-color: #9bcdbb;
          box-shadow: 0 8px 22px rgba(20, 103, 78, 0.07);
        }

        .tomato-icon {
          width: 126px;
          height: 112px;
          border-radius: 20px;
          background: #f4f5f5;
          display: grid;
          place-items: center;
          position: relative;
          flex: 0 0 auto;
          overflow: hidden;
        }

        .tomato-shape {
          width: 70px;
          height: 60px;
          border-radius: 48% 48% 52% 52%;
          background: linear-gradient(145deg, #ff5a45, #d9231c);
          position: relative;
          box-shadow:
            inset -8px -7px 0 rgba(151, 16, 16, 0.12),
            0 7px 12px rgba(136, 25, 18, 0.16);
        }

        .tomato-shape::before {
          content: "";
          position: absolute;
          width: 20px;
          height: 16px;
          left: 24px;
          top: -7px;
          background: #3e8a43;
          clip-path: polygon(50% 0, 64% 44%, 100% 25%, 75% 72%, 50% 45%, 26% 72%, 0 25%, 36% 44%);
        }

        .crop-select {
          appearance: none;
          -webkit-appearance: none;
          border: 0;
          outline: 0;
          background: transparent;
          color: #12233b;
          font: inherit;
          font-size: clamp(30px, 3.4vw, 44px);
          font-weight: 800;
          width: 100%;
          min-width: 0;
          cursor: pointer;
          padding: 8px 42px 8px 0;
        }

        .crop-select-wrap {
          min-width: 0;
          flex: 1;
          position: relative;
        }

        .crop-select-wrap::after {
          content: "";
          position: absolute;
          right: 4px;
          top: 50%;
          width: 12px;
          height: 12px;
          border-right: 3px solid #5b6570;
          border-bottom: 3px solid #5b6570;
          transform: translateY(-65%) rotate(45deg);
          pointer-events: none;
        }

        .quantity-block {
          margin-top: 42px;
        }

        .quantity-box {
          height: 134px;
          border: 2px solid #dce3e6;
          border-radius: 23px;
          display: flex;
          align-items: center;
          padding: 0 30px;
          box-sizing: border-box;
          background: #ffffff;
        }

        .quantity-input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #0c4639;
          font-size: clamp(31px, 3.6vw, 46px);
          font-weight: 800;
          min-width: 0;
        }

        .quantity-unit {
          color: #0c4639;
          font-size: clamp(31px, 3.6vw, 46px);
          font-weight: 800;
          white-space: nowrap;
        }

        .details {
          margin-top: 30px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .detail-field {
          min-width: 0;
        }

        .detail-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #52606a;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .detail-input {
          width: 100%;
          height: 54px;
          box-sizing: border-box;
          border: 2px solid #dce3e6;
          border-radius: 15px;
          padding: 0 15px;
          background: #fbfcfc;
          color: #15392f;
          font: inherit;
          outline: none;
        }

        .detail-input:focus {
          border-color: #9bcdbb;
          background: #ffffff;
        }

        .next-button {
          width: 100%;
          min-height: 92px;
          margin-top: 42px;
          border: 0;
          border-radius: 22px;
          background: #21845f;
          color: #ffffff;
          font-size: clamp(28px, 3vw, 38px);
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(33, 132, 95, 0.18);
          transition:
            transform 0.15s ease,
            background 0.15s ease,
            opacity 0.15s ease;
        }

        .next-button:hover:not(:disabled) {
          background: #197552;
          transform: translateY(-1px);
        }

        .next-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
          box-shadow: none;
        }

        @media (max-width: 760px) {
          .harvest-page {
            padding: 24px 14px 36px;
          }

          .harvest-heading {
            gap: 10px;
            margin-bottom: 18px;
          }

          .back-button {
            width: 46px;
            height: 46px;
          }

          .heading-title {
            font-size: 39px;
            letter-spacing: -1.6px;
          }

          .harvest-card {
            padding: 30px 20px 26px;
            border-radius: 25px;
          }

          .card-title-row {
            margin-bottom: 27px;
          }

          .card-title {
            font-size: 34px;
          }

          .progress {
            margin-bottom: 34px;
          }

          .progress-step {
            width: 47px;
            height: 47px;
            font-size: 20px;
          }

          .question {
            font-size: 29px;
          }

          .field-label {
            font-size: 23px;
          }

          .crop-card {
            min-height: 108px;
            gap: 16px;
            padding: 12px 16px;
          }

          .tomato-icon {
            width: 82px;
            height: 78px;
            border-radius: 15px;
          }

          .tomato-shape {
            width: 51px;
            height: 45px;
          }

          .tomato-shape::before {
            width: 15px;
            height: 12px;
            left: 18px;
            top: -5px;
          }

          .crop-select {
            font-size: 29px;
          }

          .quantity-block {
            margin-top: 29px;
          }

          .quantity-box {
            height: 98px;
            padding: 0 20px;
          }

          .quantity-input,
          .quantity-unit {
            font-size: 31px;
          }

          .details {
            grid-template-columns: 1fr;
            gap: 14px;
            margin-top: 22px;
          }

          .next-button {
            min-height: 72px;
            margin-top: 28px;
            border-radius: 17px;
            font-size: 28px;
          }
        }

        @media (max-width: 420px) {
          .heading-title {
            font-size: 34px;
          }

          .harvest-card {
            padding-left: 16px;
            padding-right: 16px;
          }

          .progress-step {
            width: 41px;
            height: 41px;
            font-size: 18px;
          }

          .crop-card {
            gap: 11px;
            padding-left: 10px;
            padding-right: 12px;
          }

          .tomato-icon {
            width: 69px;
            height: 68px;
          }

          .crop-select {
            font-size: 25px;
            padding-right: 27px;
          }

          .quantity-input,
          .quantity-unit {
            font-size: 27px;
          }
        }
      `}</style>

      <div className="harvest-wrap">
        <div className="harvest-heading">
          <button
            type="button"
            className="back-button"
            aria-label="Go back"
            onClick={() => router.push("/farmer/home")}
          >
            <ArrowLeft size={52} strokeWidth={2.2} />
          </button>
          <h1 className="heading-title">Add Harvest</h1>
        </div>

        <section className="harvest-card">
          <div className="card-title-row">
            <h2 className="card-title">New Harvest</h2>
            <ChevronRight className="card-next-icon" size={42} strokeWidth={2} />
          </div>

          <div className="progress" aria-label="Harvest steps">
            <div className="progress-step active">1</div>
            <div className="progress-line active" />
            <div className="progress-step">2</div>
            <div className="progress-line" />
            <div className="progress-step">3</div>
            <div className="progress-line" />
            <div className="progress-step">4</div>
          </div>

          <h3 className="question">What did you harvest?</h3>

          <label className="field-label" htmlFor="crop">
            Crop
          </label>

          <div className="crop-card">
            <div className="tomato-icon" aria-hidden="true">
              <div className="tomato-shape" />
            </div>

            <div className="crop-select-wrap">
              <select
                id="crop"
                className="crop-select"
                value={crop}
                onChange={(event) => setCrop(event.target.value)}
                aria-label="Crop"
              >
                {CROPS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <ChevronRight
              className="card-next-icon"
              size={36}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>

          <div className="quantity-block">
            <label className="field-label" htmlFor="quantity">
              Quantity
            </label>

            <div className="quantity-box">
              <input
                id="quantity"
                className="quantity-input"
                type="text"
                inputMode="numeric"
                value={formatQuantity(quantity)}
                onChange={handleQuantityChange}
                aria-label="Quantity in kilograms"
              />
              <span className="quantity-unit">kg</span>
            </div>
          </div>

          <div className="details">
            <div className="detail-field">
              <label className="detail-label" htmlFor="harvest-date">
                <CalendarDays size={17} />
                Harvest Date &amp; Time
              </label>
              <input
                id="harvest-date"
                className="detail-input"
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>

            <div className="detail-field">
              <label className="detail-label" htmlFor="harvest-location">
                <MapPin size={17} />
                Location
              </label>
              <input
                id="harvest-location"
                className="detail-input"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
            </div>
          </div>

          <button
            type="button"
            className="next-button"
            disabled={!quantity || saving}
            onClick={next}
          >
            {saving ? "Saving…" : "Next"}
          </button>
        </section>
      </div>
    </main>
  );
}
