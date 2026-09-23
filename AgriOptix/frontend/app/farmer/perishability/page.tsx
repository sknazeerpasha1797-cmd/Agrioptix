"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bell,
  Info,
  Leaf,
  UserRound,
} from "lucide-react";
import { useWorkflow, api } from "../../../lib/store";

function lossTier(loss: number) {
  if (loss < 1) return "low";
  if (loss < 3) return "medium";
  return "high";
}

export default function Perishability() {
  const router = useRouter();
  const { wf, setWf } = useWorkflow();

  const [p, setP] = useState<any>(wf.perishability);

  useEffect(() => {
    if (wf.perishability) return;

    api("/api/perishability/predict", {
      method: "POST",
    }).then((res) => {
      setP(res);
      setWf({ perishability: res });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const curve = p?.decay_curve || [
    { day: 0, loss_per_kg: 0 },
    { day: 1, loss_per_kg: 0.8 },
    { day: 2, loss_per_kg: 2.1 },
    { day: 3, loss_per_kg: 4.8 },
  ];

  const timeline = useMemo(() => curve.slice(0, 4), [curve]);

  const urgency = String(p?.urgency || "HIGH").toUpperCase();

  const remainingDays = p?.remaining_shelf_life_days ?? 3.2;

  const expectedValueLoss = p?.expected_value_loss ?? 1100;

  return (
    <div className="perishability-page">
      {/* =========================
          HEADER
      ========================== */}
      <header className="perishability-header">
        <div className="perishability-brand" aria-label="AgriOptix">
          <span
            className="perishability-brand-mark"
            aria-hidden="true"
          >
            <Leaf
              className="brand-leaf brand-leaf-back"
              size={38}
              strokeWidth={2.2}
            />

            <Leaf
              className="brand-leaf brand-leaf-front"
              size={42}
              strokeWidth={2.2}
            />
          </span>

          <span className="perishability-brand-text">
            AgriOptix
          </span>
        </div>

        <div
          className="perishability-header-actions"
          aria-hidden="true"
        >
          <Bell
            className="header-bell"
            size={32}
            strokeWidth={2.2}
          />

          <span className="perishability-avatar">
            <UserRound
              size={28}
              strokeWidth={2.1}
            />
          </span>
        </div>
      </header>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="perishability-main">
        {/* Back navigation */}
        <button
          type="button"
          className="perishability-back"
          onClick={() => router.push("/farmer/quality")}
        >
          <ArrowLeft
            size={32}
            strokeWidth={2.5}
          />

          <span>Back</span>
        </button>

        {/* Main white card */}
        <section className="perishability-card">
          {/* Eyebrow */}
          <div className="perishability-eyebrow">
            SHELF-LIFE / PERISHABILITY
          </div>

          {/* Heading */}
          <h1>Remaining Shelf Life</h1>

          {/* =========================
              SHELF LIFE BADGE
          ========================== */}
          <div className="shelf-life-badge">
            <span className="shelf-life-icon">
              <Leaf
                size={34}
                fill="currentColor"
                strokeWidth={2.2}
              />
            </span>

            <strong>
              {remainingDays} days
            </strong>
          </div>

          {/* =========================
              URGENCY ALERT
          ========================== */}
          <div className="perishability-alert">
            <span className="perishability-alert-icon">
              <AlertTriangle
                size={31}
                strokeWidth={2.7}
              />
            </span>

            <p>
              <strong>
                Urgency: {urgency}
              </strong>{" "}
              — selling sooner reduces expected value loss.
            </p>
          </div>

          {/* =========================
              TIMELINE
          ========================== */}
          <div
            className="perishability-timeline"
            aria-label="Expected loss timeline"
          >
            {timeline.map((c: any, index: number) => {
              const tier = lossTier(
                Number(c.loss_per_kg) || 0
              );

              const label =
                c.day === 0
                  ? "Today"
                  : `${c.day} day${
                      c.day > 1 ? "s" : ""
                    }`;

              return (
                <div
                  key={`${c.day}-${index}`}
                  className={`perishability-stage ${tier}`}
                >
                  <span className="stage-dot" />

                  <div className="stage-copy">
                    <small>{label}</small>

                    <b>
                      {tier.toUpperCase()}
                    </b>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =========================
              INFORMATION CARD
          ========================== */}
          <div className="perishability-info">
            <span className="perishability-info-icon">
              <Info
                size={27}
                strokeWidth={2.7}
              />
            </span>

            <p>
              Expected value loss: ₹
              {expectedValueLoss}.
              <br />
              Selling within the recommended
              window keeps more of this value
              in your pocket.
            </p>
          </div>

          {/* =========================
              CONTINUE BUTTON
          ========================== */}
          <div className="perishability-actions">
            <button
              type="button"
              className="perishability-continue"
              onClick={() =>
                router.push("/farmer/market")
              }
            >
              <span>Continue</span>

              <ArrowRight
                className="continue-arrow"
                size={38}
                strokeWidth={2.2}
              />
            </button>
          </div>
        </section>
      </main>

      {/* =========================
          DECORATIVE BOTTOM LEAVES
      ========================== */}
      <div
        className="perishability-decor"
        aria-hidden="true"
      >
        <Leaf
          className="decor-leaf decor-leaf-left-a"
          size={112}
        />

        <Leaf
          className="decor-leaf decor-leaf-left-b"
          size={84}
        />

        <Leaf
          className="decor-leaf decor-leaf-right-a"
          size={108}
        />

        <Leaf
          className="decor-leaf decor-leaf-right-b"
          size={78}
        />
      </div>
    </div>
  );
}