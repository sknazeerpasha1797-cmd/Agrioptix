"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Leaf,
  ArrowRight,
  CirclePlay,
  ShieldCheck,
  Clock3,
  TrendingUp,
  Truck,
  IndianRupee,
  User,
  Users,
  Store,
  X,
} from "lucide-react";

/** Two-tone circular leaf logomark matching the AgriOptix brand reference. */
function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#ffffff",
        border: "1px solid #e6ece5",
        display: "grid",
        placeItems: "center",
        position: "relative",
        overflow: "hidden",
        flex: "none",
      }}
    >
      <Leaf
        size={size * 0.62}
        color="#0e5337"
        strokeWidth={2.4}
        style={{ position: "absolute", left: "12%", top: "18%" }}
      />
      <Leaf
        size={size * 0.62}
        color="#3fae66"
        strokeWidth={2.4}
        style={{
          position: "absolute",
          right: "10%",
          bottom: "14%",
          transform: "rotate(180deg)",
        }}
      />
    </div>
  );
}

const FEATURES = [
  { icon: ShieldCheck, label: "AI Quality Assessment" },
  { icon: Clock3, label: "Shelf-Life Prediction" },
  { icon: TrendingUp, label: "Best Market Matching" },
  { icon: Truck, label: "Smart Logistics & Routing" },
  { icon: IndianRupee, label: "Higher Realization" },
];

const FLOW = [
  { icon: User, label: "Farmers" },
  { icon: Users, label: "Aggregation" },
  { icon: Truck, label: "Logistics" },
  { icon: Store, label: "Markets" },
  { icon: User, label: "Buyers" },
];

const BANNER_ITEMS = [
  {
    icon: Leaf,
    title: "Less Waste",
    desc: "Keep produce fresh, reduce value loss",
  },
  {
    icon: TrendingUp,
    title: "More Income",
    desc: "Better decisions, higher realization",
  },
  {
    icon: Users,
    title: "Stronger Supply Chains",
    desc: "Connect farmers, buyers and transporters",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [showDemoNotice, setShowDemoNotice] = useState(false);

  function goToRoleSelection() {
    router.push("/role-selection");
  }

  function handleWatchDemo() {
    // No demo video/route exists yet in the project.
    // Simple, self-contained placeholder — no new pages, no unrelated system.
    setShowDemoNotice(true);
    window.setTimeout(() => setShowDemoNotice(false), 3200);
  }

  return (
    <div className="landing">
      <header className="landing-header">
        <div className="landing-brand">
          <LogoMark size={36} />
          <div>
            <b>AgriOptix</b>
            <div className="landing-brand-tagline">
              AI-Powered Farm-to-Market Optimization &amp; Execution Platform
            </div>
          </div>
        </div>

        <div className="landing-header-note">
          <Leaf size={14} /> Better Decisions. Higher Earnings.
        </div>
      </header>

      <section className="landing-hero">
        <div
          className="landing-hero-bg"
          style={{ backgroundImage: "url(/card-farmer.jpg)" }}
        />
        <div className="landing-hero-scrim" />

        <div className="landing-copy">
          <h1>
            Smarter Harvest.
            <br />
            Better Decisions.
            <br />
            <span className="accent">Higher Returns</span>
          </h1>

          <p>
            AgriOptix analyzes your produce, finds the best market, optimizes
            logistics and executes the entire journey — so you get the
            highest possible return, before it loses value.
          </p>

          <div className="landing-features">
            {FEATURES.map((f) => (
              <div className="landing-feature" key={f.label}>
                <div className="landing-feature-icon">
                  <f.icon size={19} />
                </div>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <div className="landing-actions">
            <button className="primary" onClick={goToRoleSelection}>
              Get Started <ArrowRight size={17} />
            </button>
            <button className="secondary landing-demo" onClick={handleWatchDemo}>
              <CirclePlay size={17} /> Watch Demo
            </button>
          </div>

          <div className="welcome-login">
            Already have an account?{" "}
            <a onClick={goToRoleSelection}>Login →</a>
          </div>
        </div>

        <div className="landing-visual">
          <div className="landing-flow">
            {FLOW.map((node, i) => (
              <div className="landing-flow-node" key={node.label + i}>
                <div className="landing-flow-icon">
                  <node.icon size={20} />
                </div>
                <span>{node.label}</span>
              </div>
            ))}
            <div className="landing-flow-center">
              From
              <br />
              <b>Harvest to Market</b>
            </div>
          </div>

          <div className="floating-card">
            <span className="floating-card-tag">AI Analysis Complete</span>
            <div className="floating-card-body">
              <div className="floating-card-thumb">🍅</div>
              <div>
                <b>Tomatoes</b>
                <span>Grade A &middot; 3.2 days left</span>
              </div>
            </div>
            <button className="floating-card-cta" onClick={goToRoleSelection}>
              View Best Plan <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <section className="landing-banner">
        <div className="landing-banner-items">
          {BANNER_ITEMS.map((item) => (
            <div className="landing-banner-item" key={item.title}>
              <div className="landing-banner-icon">
                <item.icon size={17} />
              </div>
              <div>
                <b>{item.title}</b>
                <span>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="landing-banner-note">
          Real Farmers.
          <br />
          Real Impact.
        </div>
      </section>

      {showDemoNotice ? (
        <div className="demo-toast">
          <span>Demo video coming soon.</span>
          <button onClick={() => setShowDemoNotice(false)} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      ) : null}

      <style jsx>{`
        .demo-toast {
          position: fixed;
          left: 50%;
          bottom: 28px;
          transform: translateX(-50%);
          z-index: 20;
          background: #142c1d;
          color: #eaf7d9;
          padding: 12px 16px;
          border-radius: 12px;
          box-shadow: 0 16px 34px rgba(20, 44, 29, 0.35);
          display: flex;
          align-items: center;
          gap: 14px;
          font-size: 13px;
          font-weight: 600;
        }
        .demo-toast button {
          border: 0;
          background: transparent;
          color: #a8bba9;
          cursor: pointer;
          display: grid;
          place-items: center;
          padding: 2px;
        }
      `}</style>
    </div>
  );
}