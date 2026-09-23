"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Leaf, UserRound } from "lucide-react";
import { useWorkflow } from "../../../lib/store";

export default function BuyerComparison() {
  const router = useRouter();
  const { wf } = useWorkflow();
  const buyers = wf.buyers?.length ? wf.buyers : [];
  const best = buyers.length
    ? buyers.reduce((a, b) => ((b.price - b.transport - b.loss) > (a.price - a.transport - a.loss) ? b : a))
    : null;

  return (
    <div className="perishability-page buyers-page">
      {/* Header (same branded header as the Shelf-Life screen) */}
      <header className="perishability-header">
        <div className="perishability-brand" aria-label="AgriOptix">
          <span className="perishability-brand-mark" aria-hidden="true">
            <Leaf className="brand-leaf brand-leaf-back" size={38} strokeWidth={2.2} />
            <Leaf className="brand-leaf brand-leaf-front" size={42} strokeWidth={2.2} />
          </span>
          <span className="perishability-brand-text">AgriOptix</span>
        </div>
        <div className="perishability-header-actions" aria-hidden="true">
          <Bell className="header-bell" size={32} strokeWidth={2.2} />
          <span className="perishability-avatar">
            <UserRound size={28} strokeWidth={2.1} />
          </span>
        </div>
      </header>

      <main className="perishability-main">
        <section className="perishability-card">
          <button type="button" className="perishability-back" onClick={() => router.push("/farmer/market")}>
            <ArrowLeft size={32} strokeWidth={2.5} />
            <span>Back</span>
          </button>

          <div className="perishability-eyebrow">BUYER COMPARISON</div>
          <h1>Compare your buyers</h1>

          <div className="buyer-options">
            {buyers.map((b) => {
              const net = (b.price - b.transport - b.loss).toFixed(1);
              const isBest = best && b.name === best.name;
              return (
                <article className={"buyer-option" + (isBest ? " recommended" : "")} key={b.name}>
                  <div className="buyer-option-top">
                    <div>
                      <b className="buyer-option-name">{b.name}</b>
                      <span className="buyer-option-meta">{b.demand} demand · Grade {b.quality}</span>
                    </div>
                    {isBest && <span className="buyer-option-badge">RECOMMENDED</span>}
                  </div>
                  <div className="buyer-option-price">₹{b.price}<small>/kg</small></div>
                  <div className="buyer-option-stats">
                    <span>Distance: {b.distance_km} km</span>
                    <span>Transport: ₹{b.transport}/kg</span>
                    <span>Expected loss: ₹{b.loss}/kg</span>
                    <span>{b.reliability}% reliable</span>
                  </div>
                  <div className="buyer-option-net"><small>Net realized</small><b>₹{net}/kg</b></div>
                </article>
              );
            })}
          </div>

          <p className="buyers-note">
            Recommendation is based on net realized return (price minus transport minus expected value loss), not simply the highest quoted price.
          </p>

          <div className="perishability-actions">
            <button type="button" className="buyers-cta" onClick={() => router.push("/farmer/selling-plan")}>
              See Selling Plan
            </button>
          </div>
        </section>
      </main>

      {/* Decorative bottom leaves */}
      <div className="perishability-decor" aria-hidden="true">
        <Leaf className="decor-leaf decor-leaf-left-a" size={112} />
        <Leaf className="decor-leaf decor-leaf-left-b" size={84} />
        <Leaf className="decor-leaf decor-leaf-right-a" size={108} />
        <Leaf className="decor-leaf decor-leaf-right-b" size={78} />
      </div>
    </div>
  );
}