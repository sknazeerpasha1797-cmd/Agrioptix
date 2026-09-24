"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, CalendarDays, MapPin, X, ChevronRight } from "lucide-react";
import { useWorkflow } from "../../../lib/store";

const REQUIRED = 3;

function formatHarvestDate(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function TakePhotos() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();
  const inputRef = useRef<HTMLInputElement>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const next = [...wf.photos, String(reader.result)].slice(0, REQUIRED);
      setWf({ photos: next });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function remove(index: number) {
    setWf({ photos: wf.photos.filter((_, i) => i !== index) });
  }

  function openPicker() {
    if (wf.photos.length < REQUIRED) inputRef.current?.click();
  }

  const harvest = wf.harvest || {};
  const crop = harvest.crop || "produce";
  const quantity = harvest.quantity_kg ?? harvest.quantity;
  const harvestDate = formatHarvestDate(harvest.harvest_time ?? harvest.harvestDate ?? harvest.date);
  const location = harvest.location ?? harvest.location_name ?? harvest.village ?? "Use current location";

  return (
    <main className="photos-page">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        className="photos-file-input"
      />

      <section className="photos-container">
        <div className="photos-step-title">
          <span className="photos-step-number">3.</span>
          <span className="photos-step-divider" />
          <h1>Upload Photo &amp; Details</h1>
        </div>

        <div className="photos-card">
          <div className="photos-card-header">
            <button
              type="button"
              className="photos-back"
              onClick={() => router.push("/farmer/harvest")}
              aria-label="Back to harvest"
            >
              <ArrowLeft size={34} strokeWidth={2.2} />
            </button>
            <span className="photos-header-divider" />
            <h2>Add Photos</h2>
            <span className="photos-required" aria-label="Required">*</span>
          </div>

          <div className="photos-grid" aria-label={`Photos for ${crop}`}>
            {Array.from({ length: REQUIRED }).map((_, index) => {
              const src = wf.photos[index];

              if (src) {
                return (
                  <div className="photos-tile photos-tile-filled" key={index}>
                    <img src={src} alt={`${crop} photo ${index + 1}`} />
                    <button
                      type="button"
                      className="photos-remove"
                      onClick={() => remove(index)}
                      aria-label={`Remove photo ${index + 1}`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  type="button"
                  className="photos-tile photos-upload-tile"
                  onClick={openPicker}
                  aria-label={`Add photo ${index + 1}`}
                >
                  <span className="photos-camera-circle">
                    <Camera size={42} strokeWidth={1.8} />
                  </span>
                  <span className="photos-upload-text">{index === wf.photos.length ? "Add Photo" : `Photo ${index + 1}`}</span>
                </button>
              );
            })}
          </div>

          <div className="photos-count">
            {wf.photos.length} of {REQUIRED} photos captured
          </div>

          <div className="photos-detail-section">
            <div className="photos-section-label">Harvest Date</div>
            <div className="photos-detail-field">
              <CalendarDays size={31} strokeWidth={2.1} className="photos-green-icon" />
              <div className="photos-detail-values">
                <strong>{harvestDate || (quantity !== undefined && quantity !== null ? `${quantity} kg` : "Not set")}</strong>
                {harvestDate && quantity !== undefined && quantity !== null ? (
                  <span>{quantity} kg</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="photos-detail-section photos-location-section">
            <div className="photos-section-label">Location</div>
            <div className="photos-location-row">
              <div className="photos-detail-field photos-location-field">
                <MapPin size={34} strokeWidth={2.1} className="photos-green-icon" />
                <strong>{location}</strong>
              </div>
              {harvest.location || harvest.location_name ? (
                <div className="photos-location-preview" aria-label="Location preview">
                  <span className="photos-map-road road-one" />
                  <span className="photos-map-road road-two" />
                  <span className="photos-map-water" />
                  <span className="photos-map-pin map-pin-one"><MapPin size={21} fill="currentColor" /></span>
                  <span className="photos-map-pin map-pin-two"><MapPin size={21} fill="currentColor" /></span>
                </div>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="photos-next"
            disabled={wf.photos.length < REQUIRED}
            onClick={() => router.push("/farmer/quality")}
          >
            <span>Next</span>
            <ChevronRight size={31} strokeWidth={2.5} />
          </button>
        </div>
      </section>

      <style jsx>{`
        .photos-page {
          min-height: 100vh;
          box-sizing: border-box;
          padding: 38px 28px 56px;
          background: #f1fbf8;
          color: #10243a;
        }

        .photos-container {
          width: min(1080px, 100%);
          margin: 0 auto;
        }

        .photos-step-title {
          display: flex;
          align-items: center;
          gap: 24px;
          min-height: 112px;
          padding: 0 38px;
          border-radius: 30px;
          background: #e5f5f3;
          box-sizing: border-box;
        }

        .photos-step-number {
          color: #087d59;
          font-size: 58px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: -2px;
        }

        .photos-step-divider,
        .photos-header-divider {
          width: 3px;
          height: 52px;
          border-radius: 99px;
          background: #78b5a4;
          flex: 0 0 auto;
        }

        .photos-step-title h1 {
          margin: 0;
          font-size: clamp(32px, 4.2vw, 54px);
          line-height: 1.05;
          letter-spacing: -1.8px;
          font-weight: 800;
        }

        .photos-card {
          margin-top: 38px;
          padding: 42px 44px 46px;
          border-radius: 34px;
          background: #ffffff;
          box-shadow: 0 22px 55px rgba(30, 86, 72, 0.11);
          box-sizing: border-box;
        }

        .photos-card-header {
          display: flex;
          align-items: center;
          gap: 22px;
          margin-bottom: 42px;
        }

        .photos-back {
          width: 52px;
          height: 52px;
          padding: 0;
          border: 0;
          background: transparent;
          color: #129668;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .photos-header-divider {
          height: 48px;
          background: #d7e5e1;
        }

        .photos-card-header h2 {
          margin: 0;
          font-size: clamp(30px, 4vw, 50px);
          line-height: 1;
          letter-spacing: -1.5px;
          font-weight: 800;
        }

        .photos-required {
          margin-left: auto;
          color: #087d59;
          font-size: 43px;
          font-weight: 800;
          line-height: 1;
        }

        .photos-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .photos-tile {
          position: relative;
          width: 100%;
          aspect-ratio: 1.15 / 1;
          min-height: 210px;
          border-radius: 24px;
          overflow: hidden;
          box-sizing: border-box;
        }

        .photos-tile-filled {
          background: #edf5f2;
        }

        .photos-tile-filled img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photos-upload-tile {
          border: 2px dashed #b8cfca;
          background: #f2f9f8;
          color: #157d60;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          font: inherit;
        }

        .photos-upload-tile:hover {
          background: #edf7f4;
          border-color: #66aa97;
        }

        .photos-camera-circle {
          display: grid;
          place-items: center;
        }

        .photos-upload-text {
          font-size: 18px;
          font-weight: 700;
          color: #47645f;
        }

        .photos-remove {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #fff;
          background: rgba(16, 35, 42, 0.68);
          cursor: pointer;
        }

        .photos-count {
          margin-top: 12px;
          color: #687b86;
          font-size: 15px;
          font-weight: 600;
        }

        .photos-detail-section {
          margin-top: 31px;
          padding: 28px 30px 30px;
          border: 2px solid #e3e9e7;
          border-radius: 25px;
          background: #fff;
        }

        .photos-section-label {
          margin-bottom: 14px;
          color: #657680;
          font-size: 21px;
          line-height: 1.2;
          font-weight: 750;
        }

        .photos-detail-field {
          min-height: 74px;
          display: flex;
          align-items: center;
          gap: 22px;
          padding: 0 27px;
          border: 2px solid #dce9e5;
          border-radius: 19px;
          box-sizing: border-box;
        }

        .photos-green-icon {
          color: #0b9569;
          flex: 0 0 auto;
        }

        .photos-detail-values {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .photos-detail-values strong,
        .photos-location-field strong {
          color: #13273a;
          font-size: 26px;
          line-height: 1.2;
          font-weight: 800;
        }

        .photos-detail-values span {
          margin-top: 4px;
          color: #74858e;
          font-size: 15px;
          font-weight: 650;
        }

        .photos-location-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 190px;
          gap: 16px;
          align-items: stretch;
        }

        .photos-location-field {
          min-height: 102px;
        }

        .photos-location-preview {
          position: relative;
          min-height: 102px;
          overflow: hidden;
          border-radius: 19px;
          border: 2px solid #dce9e5;
          background: #eef5e8;
        }

        .photos-map-road {
          position: absolute;
          display: block;
          width: 145%;
          height: 12px;
          background: #fff;
          transform: rotate(34deg);
          left: -35px;
          top: 42px;
          box-shadow: 0 0 0 2px #e2eadb;
        }

        .road-two {
          width: 120%;
          height: 8px;
          transform: rotate(-42deg);
          left: 28px;
          top: 14px;
        }

        .photos-map-water {
          position: absolute;
          width: 72px;
          height: 160px;
          right: 28px;
          top: -25px;
          border-radius: 55%;
          background: #cfe7ef;
          transform: rotate(23deg);
          opacity: 0.9;
        }

        .photos-map-pin {
          position: absolute;
          z-index: 2;
          color: #0b9569;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,.1));
        }

        .map-pin-one {
          left: 44%;
          top: 23px;
        }

        .map-pin-two {
          right: 28px;
          bottom: 14px;
          color: #e96b66;
        }

        .photos-next {
          width: 100%;
          min-height: 82px;
          margin-top: 34px;
          border: 0;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          background: #119b6d;
          color: #fff;
          font: inherit;
          font-size: 30px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 24px rgba(17, 155, 109, 0.2);
        }

        .photos-next:hover:not(:disabled) {
          background: #0d8d62;
        }

        .photos-next:disabled {
          cursor: not-allowed;
          background: #a9cfc2;
          box-shadow: none;
        }

        .photos-file-input {
          display: none;
        }

        @media (max-width: 760px) {
          .photos-page {
            padding: 18px 14px 30px;
          }

          .photos-step-title {
            min-height: 76px;
            padding: 0 20px;
            gap: 13px;
            border-radius: 22px;
          }

          .photos-step-number {
            font-size: 38px;
            letter-spacing: -1px;
          }

          .photos-step-divider {
            height: 35px;
            width: 2px;
          }

          .photos-step-title h1 {
            font-size: 27px;
            letter-spacing: -0.8px;
          }

          .photos-card {
            margin-top: 20px;
            padding: 25px 18px 28px;
            border-radius: 25px;
          }

          .photos-card-header {
            gap: 12px;
            margin-bottom: 24px;
          }

          .photos-back {
            width: 42px;
            height: 42px;
          }

          .photos-back :global(svg) {
            width: 29px;
            height: 29px;
          }

          .photos-header-divider {
            height: 38px;
            width: 2px;
          }

          .photos-card-header h2 {
            font-size: 30px;
            letter-spacing: -0.8px;
          }

          .photos-required {
            font-size: 31px;
          }

          .photos-grid {
            gap: 10px;
          }

          .photos-tile {
            min-height: 0;
            border-radius: 15px;
          }

          .photos-upload-text {
            font-size: 13px;
          }

          .photos-camera-circle :global(svg) {
            width: 31px;
            height: 31px;
          }

          .photos-remove {
            top: 7px;
            right: 7px;
            width: 30px;
            height: 30px;
          }

          .photos-remove :global(svg) {
            width: 15px;
            height: 15px;
          }

          .photos-detail-section {
            margin-top: 20px;
            padding: 19px 15px 18px;
            border-radius: 18px;
          }

          .photos-section-label {
            font-size: 17px;
            margin-bottom: 9px;
          }

          .photos-detail-field {
            min-height: 64px;
            padding: 0 15px;
            gap: 13px;
            border-radius: 15px;
          }

          .photos-green-icon {
            width: 26px;
            height: 26px;
          }

          .photos-detail-values strong,
          .photos-location-field strong {
            font-size: 18px;
          }

          .photos-location-row {
            grid-template-columns: 1fr;
          }

          .photos-location-field {
            min-height: 68px;
          }

          .photos-location-preview {
            min-height: 110px;
          }

          .photos-next {
            min-height: 66px;
            margin-top: 23px;
            border-radius: 17px;
            font-size: 24px;
          }
        }

        @media (max-width: 430px) {
          .photos-page {
            padding-left: 10px;
            padding-right: 10px;
          }

          .photos-step-title {
            padding: 0 15px;
            gap: 10px;
          }

          .photos-step-number {
            font-size: 32px;
          }

          .photos-step-title h1 {
            font-size: 22px;
          }

          .photos-card-header h2 {
            font-size: 27px;
          }
        }
      `}</style>
    </main>
  );
}
