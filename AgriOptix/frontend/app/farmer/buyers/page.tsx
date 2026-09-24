"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Bell, Leaf, UserRound } from "lucide-react";
import { useWorkflow } from "../../../lib/store";

export default function BuyerComparison() {
  const router = useRouter();
  const { wf } = useWorkflow();
  const buyers = wf.buyers?.length ? wf.buyers : [];
  const best = buyers.length
    ? buyers.reduce((a, b) =>
        b.price - b.transport - b.loss > a.price - a.transport - a.loss ? b : a
      )
    : null;

  return (
    <div className="buyer-page">
      <header className="buyer-header">
        <div className="buyer-brand">
          <span className="buyer-brand-mark"><Leaf size={30} strokeWidth={1.9} /></span>
          <span>AgriOptix</span>
        </div>
        <div className="buyer-header-actions" aria-label="Account controls">
          <button className="icon-button" type="button" aria-label="Notifications">
            <Bell size={24} strokeWidth={1.8} />
          </button>
          <button className="profile-button" type="button" aria-label="Profile">
            <UserRound size={24} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <main className="buyer-main">
        <section className="comparison-panel" aria-labelledby="buyer-comparison-title">
          <button className="back-button" type="button" onClick={() => router.push("/farmer/market")}>
            <ArrowLeft size={18} strokeWidth={1.8} />
            <span>Back</span>
          </button>

          <div className="comparison-heading">
            <span className="comparison-eyebrow">BUYER COMPARISON</span>
            <h1 id="buyer-comparison-title">Compare your buyers</h1>
          </div>

          <div className="buyer-cards">
            {buyers.map((b) => {
              const net = Number(b.price) - Number(b.transport) - Number(b.loss);
              const isBest = best && b.name === best.name;

              return (
                <article className={`buyer-card${isBest ? " recommended" : ""}`} key={b.name}>
                  <div className="buyer-card-top">
                    <div>
                      <h2>{b.name}</h2>
                      <p>{b.demand} demand · Grade {b.quality}</p>
                    </div>
                    {isBest ? <span className="recommended-pill">RECOMMENDED</span> : null}
                  </div>

                  <div className="quoted-price">?{b.price}</div>

                  <div className="buyer-details">
                    <span>Distance: {b.distance_km} km</span>
                    <span>Transport: ?{b.transport}/kg</span>
                    <span>Expected loss: ?{b.loss}/kg</span>
                    <span>{b.reliability}% reliable</span>
                  </div>

                  <div className="net-price">
                    <span>{b.name === "Buyer C" ? "Net stable" : "Net Price"}</span>
                    <strong>?{net.toFixed(1)}/kg</strong>
                  </div>
                </article>
              );
            })}
          </div>

          <p className="comparison-note">
            Recommendation is based on net realized return (price minus transport expected
            <br className="desktop-break" />
            value-loss) not simply the highest quoted price
          </p>

          <button className="selling-plan-button" type="button" onClick={() => router.push("/farmer/selling-plan")}>
            See Selling Plan
          </button>
        </section>
      </main>

      <div className="decorative-hills" aria-hidden="true">
        <div className="hill hill-one" />
        <div className="hill hill-two" />
        <div className="leaf-cluster left-cluster">
          <Leaf className="leaf leaf-a" />
          <Leaf className="leaf leaf-b" />
          <Leaf className="leaf leaf-c" />
          <Leaf className="leaf leaf-d" />
        </div>
        <div className="leaf-cluster right-cluster">
          <Leaf className="leaf leaf-a" />
          <Leaf className="leaf leaf-b" />
          <Leaf className="leaf leaf-c" />
        </div>
      </div>

      <style jsx>{`
        .buyer-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #eefaf7 0%, #f1fbf8 55%, #dff5ee 100%);
          color: #10201a;
          font-family: "DM Sans", sans-serif;
        }

        .buyer-header {
          position: relative;
          z-index: 10;
          height: 80px;
          padding: 0 43px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(250, 255, 253, 0.86);
          border-bottom: 1px solid rgba(220, 238, 231, 0.75);
          border-radius: 0 0 22px 22px;
          box-shadow: 0 5px 22px rgba(42, 105, 86, 0.06);
          backdrop-filter: blur(10px);
        }

        .buyer-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #123e32;
          font: 800 28px/1 "Manrope", sans-serif;
          letter-spacing: -1px;
        }

        .buyer-brand-mark {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          color: #2aa36e;
          transform: rotate(-9deg);
        }

        .buyer-header-actions {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .icon-button,
        .profile-button {
          border: 0;
          background: transparent;
          padding: 0;
          color: #173f34;
          display: grid;
          place-items: center;
          cursor: pointer;
        }

        .profile-button {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #e0f5eb;
          box-shadow: inset 0 0 0 1px rgba(38, 127, 96, 0.08);
        }

        .buyer-main {
          position: relative;
          z-index: 3;
          padding: 25px 20px 190px;
        }

        .comparison-panel {
          width: min(914px, 100%);
          margin: 0 auto;
          padding: 36px 32px 30px;
          border: 1px solid rgba(226, 241, 235, 0.96);
          border-radius: 20px;
          background: rgba(250, 255, 253, 0.89);
          box-shadow: 0 13px 38px rgba(38, 112, 88, 0.08);
          backdrop-filter: blur(8px);
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0;
          margin: 0 0 25px;
          border: 0;
          background: transparent;
          color: #286c59;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .comparison-heading {
          margin-bottom: 13px;
        }

        .comparison-eyebrow {
          display: block;
          margin-bottom: 3px;
          color: #2c705d;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.3px;
        }

        .comparison-heading h1 {
          margin: 0;
          color: #071713;
          font: 700 27px/1.15 "Manrope", sans-serif;
          letter-spacing: -0.8px;
        }

        .buyer-cards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .buyer-card {
          min-width: 0;
          padding: 13px 14px 12px;
          border: 1px solid #dcebe4;
          border-radius: 14px;
          background: rgba(240, 250, 246, 0.78);
          box-shadow: 0 5px 16px rgba(39, 105, 83, 0.055);
        }

        .buyer-card.recommended {
          border-color: #a8ccb9;
          box-shadow: 0 5px 16px rgba(39, 105, 83, 0.075);
        }

        .buyer-card-top {
          min-height: 39px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }

        .buyer-card h2 {
          margin: 0;
          color: #13251e;
          font: 600 15px/1.15 "DM Sans", sans-serif;
        }

        .buyer-card p {
          margin: 3px 0 0;
          color: #52675e;
          font-size: 9px;
          line-height: 1.2;
        }

        .recommended-pill {
          flex: none;
          padding: 5px 8px;
          border-radius: 999px;
          background: #d2f2dd;
          color: #277251;
          font-size: 8px;
          font-weight: 800;
          line-height: 1;
        }

        .quoted-price {
          margin: 8px 0 8px;
          color: #17241f;
          font: 700 22px/1 "Manrope", sans-serif;
          letter-spacing: -0.5px;
        }

        .buyer-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px 8px;
          color: #44584f;
          font-size: 8px;
          line-height: 1.3;
        }

        .net-price {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-top: 11px;
          padding-top: 8px;
          border-top: 1px solid #dfece6;
          color: #33483e;
          font-size: 9px;
        }

        .net-price strong {
          color: #14251e;
          font-size: 11px;
          font-weight: 800;
        }

        .comparison-note {
          margin: 12px 0 16px;
          color: #182820;
          font-size: 11px;
          line-height: 1.25;
        }

        .selling-plan-button {
          width: 100%;
          height: 36px;
          border: 0;
          border-radius: 8px;
          background: #08734d;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 5px 13px rgba(8, 115, 77, 0.13);
        }

        .selling-plan-button:hover {
          background: #076443;
        }

        .decorative-hills {
          position: absolute;
          z-index: 1;
          left: 0;
          right: 0;
          bottom: 0;
          height: 260px;
          pointer-events: none;
          overflow: hidden;
        }

        .hill {
          position: absolute;
          left: -5%;
          width: 110%;
          border-radius: 50% 50% 0 0;
        }

        .hill-one {
          bottom: -175px;
          height: 285px;
          background: rgba(195, 236, 224, 0.62);
          transform: rotate(-2deg);
        }

        .hill-two {
          bottom: -208px;
          height: 280px;
          background: rgba(220, 245, 238, 0.86);
          transform: rotate(4deg);
        }

        .leaf-cluster {
          position: absolute;
          bottom: -22px;
          width: 105px;
          height: 190px;
          color: #3eaf7d;
        }

        .left-cluster { left: -5px; }
        .right-cluster { right: -2px; transform: scaleX(-1); }

        .leaf {
          position: absolute;
          width: 62px;
          height: 80px;
          stroke-width: 1.2;
          fill: rgba(60, 171, 123, 0.56);
          stroke: #3cae7d;
          transform-origin: bottom center;
        }

        .leaf-a { left: 34px; bottom: 9px; transform: rotate(18deg); }
        .leaf-b { left: 4px; bottom: 33px; transform: rotate(-31deg); }
        .leaf-c { left: 41px; bottom: 70px; transform: rotate(5deg); }
        .leaf-d { left: 11px; bottom: 88px; transform: rotate(-48deg); }

        @media (max-width: 900px) {
          .buyer-header { padding: 0 26px; }
          .buyer-main { padding-top: 20px; }
          .comparison-panel { padding: 30px 24px 26px; }
          .buyer-cards { grid-template-columns: 1fr; gap: 10px; }
          .buyer-card { padding: 16px; }
          .buyer-card-top { min-height: 0; }
        }

        @media (max-width: 600px) {
          .buyer-header { height: 68px; padding: 0 18px; border-radius: 0 0 18px 18px; }
          .buyer-brand { font-size: 23px; }
          .buyer-brand-mark { width: 31px; height: 31px; }
          .buyer-header-actions { gap: 14px; }
          .profile-button { width: 39px; height: 39px; }
          .buyer-main { padding: 14px 10px 145px; }
          .comparison-panel { padding: 24px 15px 20px; border-radius: 16px; }
          .back-button { margin-bottom: 19px; }
          .comparison-heading h1 { font-size: 23px; }
          .comparison-eyebrow { font-size: 10px; }
          .comparison-note { font-size: 10px; }
          .desktop-break { display: none; }
          .selling-plan-button { height: 42px; }
          .decorative-hills { height: 190px; }
          .leaf-cluster { transform: scale(.75); transform-origin: bottom left; }
          .right-cluster { transform: scaleX(-1) scale(.75); transform-origin: bottom right; }
        }
      `}</style>
    </div>
  );
}
