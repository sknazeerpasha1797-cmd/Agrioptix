"use client";

import {
  BadgeCheck,
  Clock3,
  Sparkles,
  Truck,
  MapPin,
  Tractor,
  Route,
  PackageCheck,
  IndianRupee,
  Activity,
} from "lucide-react";

function Operations() {
  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="screen wide">
        <header className="topbar">
          <div className="brand">
            <div className="brand-icon">
              <Activity size={22} />
            </div>

            <div>
              <div className="brand-name">AgriOptix</div>
              <div className="brand-subtitle">
                Farm-to-Market Optimization Platform
              </div>
            </div>
          </div>

          <div className="status">
            <span className="status-dot" />
            System operational
          </div>
        </header>

        <div className="section-title">
          <div>
            <span className="eyebrow">OPERATIONS CONTROL TOWER</span>

            <h1>Live operations</h1>

            <p>
              One view across routes, vehicles, clusters, optimization and
              settlements.
            </p>
          </div>

          <span className="data-badge">DEMO DATA</span>
        </div>

        <section className="stats-grid">
          <StatCard
            icon={<Tractor size={21} />}
            title="Active harvests"
            value="18"
            description="Across farmer clusters"
          />

          <StatCard
            icon={<Truck size={21} />}
            title="Vehicles"
            value="14"
            description="11 currently active"
          />

          <StatCard
            icon={<Route size={21} />}
            title="Live shipments"
            value="41"
            description="Routes being monitored"
          />

          <StatCard
            icon={<IndianRupee size={21} />}
            title="Pending settlements"
            value="3"
            description="Awaiting processing"
          />
        </section>

        <div className="ops-grid">
          <div className="ops-map map-card">
            <div className="map-header">
              <div>
                <span className="eyebrow">LIVE ROUTE MAP</span>
                <h2>Farm-to-market movement</h2>
              </div>

              <span className="live-badge">
                <span className="status-dot" />
                LIVE
              </span>
            </div>

            <div className="map-area">
              <div className="map-grid" />

              <div className="map-road road-one" />
              <div className="map-road road-two" />
              <div className="map-road road-three" />

              <div className="ops-route route-one" />
              <div className="ops-route route-two" />

              <div className="ops-marker m1">
                <Tractor size={19} />
              </div>

              <div className="ops-marker m2">
                <Truck size={19} />
              </div>

              <div className="ops-marker m3">
                <MapPin size={19} />
              </div>

              <div className="map-label label-one">Farmer Cluster A</div>
              <div className="map-label label-two">Vehicle 08</div>
              <div className="map-label label-three">Buyer Hub</div>
            </div>

            <div className="map-footer">
              <div>
                <span className="legend-dot farmer" />
                Farmer cluster
              </div>

              <div>
                <span className="legend-dot vehicle" />
                Vehicle
              </div>

              <div>
                <span className="legend-dot buyer" />
                Buyer
              </div>
            </div>
          </div>

          <div className="card alert-card">
            <span className="eyebrow">ALERTS</span>

            <div className="alert">
              <div className="alert-icon">
                <Clock3 size={19} />
              </div>

              <div>
                <b>3 settlements pending</b>
                <small>Awaiting settlement process.</small>
              </div>
            </div>

            <div className="alert">
              <div className="alert-icon">
                <Truck size={19} />
              </div>

              <div>
                <b>2 vehicles near capacity</b>
                <small>Review shared-load allocation.</small>
              </div>
            </div>

            <div className="alert">
              <div className="alert-icon">
                <Sparkles size={19} />
              </div>

              <div>
                <b>AI services</b>
                <small>Quality model: demo · Routing: demo</small>
              </div>
            </div>
          </div>

          <div className="card ops-list">
            <div className="list-heading">
              <div>
                <span className="eyebrow">OPTIMIZATION RUNS</span>
                <h2>Recommended selling plans</h2>
              </div>

              <span className="run-count">3 RUNS</span>
            </div>

            <div className="compact-row">
              <div className="commodity">
                <div className="commodity-icon">🍅</div>

                <div>
                  <strong>Tomatoes</strong>
                  <small>Buyer B · 420 kg</small>
                </div>
              </div>

              <div className="price">
                <strong>₹22.6/kg</strong>
                <small>Net return</small>
              </div>

              <BadgeCheck size={21} />
            </div>

            <div className="compact-row">
              <div className="commodity">
                <div className="commodity-icon">🧅</div>

                <div>
                  <strong>Onions</strong>
                  <small>Hyderabad · 680 kg</small>
                </div>
              </div>

              <div className="price">
                <strong>₹19.8/kg</strong>
                <small>Net return</small>
              </div>

              <BadgeCheck size={21} />
            </div>

            <div className="compact-row">
              <div className="commodity">
                <div className="commodity-icon">🌶️</div>

                <div>
                  <strong>Chillies</strong>
                  <small>Buyer A · 310 kg</small>
                </div>
              </div>

              <div className="price">
                <strong>₹24.1/kg</strong>
                <small>Net return</small>
              </div>

              <BadgeCheck size={21} />
            </div>
          </div>
        </div>

        <section className="flow-section">
          <div className="flow-heading">
            <div>
              <span className="eyebrow">AGRIOPTIX EXECUTION FLOW</span>
              <h2>From harvest to settlement</h2>
            </div>
          </div>

          <div className="flow">
            {[
              "Harvest",
              "AI Quality",
              "Market + Demand",
              "Smart Aggregation",
              "MILP Optimization",
              "Best Selling Plan",
              "Pickup",
              "Delivery",
              "Settlement",
            ].map((item, index) => (
              <div className="flow-item" key={item}>
                <div className="flow-number">{index + 1}</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          font-family:
            Inter,
            ui-sans-serif,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          background: #f5f7fb;
          color: #172033;
        }

        body {
          overflow-x: hidden;
        }

        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 10% 10%,
              rgba(93, 82, 255, 0.08),
              transparent 30%
            ),
            radial-gradient(
              circle at 90% 20%,
              rgba(38, 185, 133, 0.08),
              transparent 30%
            ),
            #f5f7fb;
        }

        .background-glow {
          position: fixed;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          opacity: 0.45;
        }

        .glow-one {
          top: -180px;
          left: -140px;
          background: rgba(96, 87, 255, 0.15);
        }

        .glow-two {
          right: -160px;
          bottom: -180px;
          background: rgba(41, 190, 139, 0.14);
        }

        .screen {
          position: relative;
          z-index: 2;
          margin: 0 auto;
          padding: 28px 34px 50px;
        }

        .screen.wide {
          max-width: 1500px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 46px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-icon {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #5c55f5, #766dfc);
          color: white;
          box-shadow: 0 12px 25px rgba(92, 85, 245, 0.25);
        }

        .brand-name {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .brand-subtitle {
          margin-top: 2px;
          font-size: 11px;
          color: #8a92a6;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border: 1px solid #e4e8f0;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.75);
          color: #697287;
          font-size: 12px;
          font-weight: 600;
        }

        .status-dot {
          width: 7px;
          height: 7px;
          display: inline-block;
          border-radius: 50%;
          background: #29b987;
          box-shadow: 0 0 0 4px rgba(41, 185, 135, 0.12);
        }

        .section-title {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 24px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #777f95;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .section-title h1 {
          margin: 0;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1;
          letter-spacing: -2px;
        }

        .section-title p {
          max-width: 650px;
          margin: 12px 0 0;
          color: #7d8599;
          font-size: 14px;
        }

        .data-badge,
        .live-badge,
        .run-count {
          white-space: nowrap;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.8px;
        }

        .data-badge {
          color: #5e59dc;
          background: #eeedff;
          border: 1px solid #dfddff;
        }

        .live-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #198660;
          background: #eaf9f3;
          border: 1px solid #d2f1e4;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 18px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 19px;
          border: 1px solid #e7eaf1;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.78);
          box-shadow: 0 12px 30px rgba(35, 44, 68, 0.05);
        }

        .stat-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #f0efff;
          color: #625cf1;
        }

        .stat-title {
          font-size: 11px;
          color: #838b9f;
          font-weight: 700;
        }

        .stat-value {
          margin-top: 3px;
          font-size: 23px;
          line-height: 1;
          font-weight: 800;
        }

        .stat-description {
          margin-top: 5px;
          font-size: 10px;
          color: #9ba2b3;
        }

        .ops-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.55fr) minmax(300px, 0.75fr);
          gap: 18px;
        }

        .card,
        .map-card {
          border: 1px solid #e6e9f0;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 16px 40px rgba(35, 44, 68, 0.06);
        }

        .map-card {
          min-height: 470px;
          overflow: hidden;
          position: relative;
        }

        .map-header {
          position: absolute;
          z-index: 5;
          top: 22px;
          left: 24px;
          right: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .map-header h2,
        .list-heading h2,
        .flow-heading h2 {
          margin: 0;
          font-size: 18px;
          letter-spacing: -0.4px;
        }

        .map-area {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background:
            linear-gradient(
              30deg,
              transparent 45%,
              rgba(128, 139, 163, 0.09) 46%,
              rgba(128, 139, 163, 0.09) 47%,
              transparent 48%
            ),
            linear-gradient(
              150deg,
              transparent 45%,
              rgba(128, 139, 163, 0.07) 46%,
              rgba(128, 139, 163, 0.07) 47%,
              transparent 48%
            ),
            #f4f6f9;
        }

        .map-grid {
          position: absolute;
          inset: 0;
          opacity: 0.5;
          background-image:
            linear-gradient(#dfe4eb 1px, transparent 1px),
            linear-gradient(90deg, #dfe4eb 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .map-road {
          position: absolute;
          height: 18px;
          border-radius: 999px;
          background: rgba(202, 208, 220, 0.65);
          transform: rotate(-28deg);
        }

        .road-one {
          width: 70%;
          top: 45%;
          left: 10%;
        }

        .road-two {
          width: 55%;
          top: 64%;
          left: 34%;
          transform: rotate(23deg);
        }

        .road-three {
          width: 40%;
          top: 26%;
          left: 48%;
          transform: rotate(65deg);
        }

        .ops-route {
          position: absolute;
          height: 3px;
          border-radius: 10px;
          background: #665ef4;
          transform-origin: left center;
          box-shadow: 0 0 12px rgba(102, 94, 244, 0.4);
        }

        .route-one {
          width: 280px;
          top: 57%;
          left: 22%;
          transform: rotate(-18deg);
        }

        .route-two {
          width: 210px;
          top: 38%;
          left: 50%;
          transform: rotate(35deg);
        }

        .ops-marker {
          position: absolute;
          z-index: 4;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 4px solid white;
          border-radius: 50%;
          color: white;
          box-shadow: 0 8px 20px rgba(30, 40, 60, 0.18);
        }

        .m1 {
          left: 20%;
          top: 55%;
          background: #6b61f5;
        }

        .m2 {
          left: 65%;
          top: 31%;
          background: #2cb88a;
        }

        .m3 {
          right: 16%;
          bottom: 19%;
          background: #e0a23b;
        }

        .map-label {
          position: absolute;
          z-index: 5;
          padding: 6px 9px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e2e6ee;
          box-shadow: 0 6px 16px rgba(30, 40, 60, 0.07);
          color: #596176;
          font-size: 10px;
          font-weight: 700;
        }

        .label-one {
          left: 13%;
          top: 66%;
        }

        .label-two {
          left: 62%;
          top: 24%;
        }

        .label-three {
          right: 9%;
          bottom: 11%;
        }

        .map-footer {
          position: absolute;
          z-index: 5;
          bottom: 18px;
          left: 22px;
          display: flex;
          gap: 18px;
          padding: 9px 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid #e3e7ee;
          color: #727b90;
          font-size: 10px;
          font-weight: 600;
        }

        .map-footer > div {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }

        .legend-dot.farmer {
          background: #665ef4;
        }

        .legend-dot.vehicle {
          background: #2cb88a;
        }

        .legend-dot.buyer {
          background: #e0a23b;
        }

        .alert-card {
          padding: 24px;
        }

        .alert {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 18px 0;
          border-bottom: 1px solid #edf0f4;
        }

        .alert:last-child {
          border-bottom: 0;
        }

        .alert-icon {
          width: 39px;
          height: 39px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f2f1ff;
          color: #665ef4;
        }

        .alert b {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
        }

        .alert small {
          color: #8d95a7;
          font-size: 10px;
          line-height: 1.5;
        }

        .ops-list {
          grid-column: 1 / -1;
          padding: 24px;
        }

        .list-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .run-count {
          color: #5e59dc;
          background: #f0efff;
        }

        .compact-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          min-height: 74px;
          border-top: 1px solid #edf0f4;
        }

        .commodity {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .commodity-icon {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f5f6f9;
          font-size: 20px;
        }

        .commodity strong {
          display: block;
          font-size: 12px;
        }

        .commodity small,
        .price small {
          display: block;
          margin-top: 4px;
          color: #969daf;
          font-size: 10px;
        }

        .price {
          margin-left: auto;
          text-align: right;
        }

        .price strong {
          font-size: 12px;
        }

        .compact-row > svg {
          color: #28ad80;
        }

        .flow-section {
          margin-top: 18px;
          padding: 24px;
          border: 1px solid #e6e9f0;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.82);
          box-shadow: 0 16px 40px rgba(35, 44, 68, 0.05);
        }

        .flow {
          display: grid;
          grid-template-columns: repeat(9, 1fr);
          gap: 8px;
          margin-top: 22px;
        }

        .flow-item {
          position: relative;
          min-height: 75px;
          padding: 12px 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 8px;
          text-align: center;
          border-radius: 13px;
          background: #f6f7fa;
          border: 1px solid #ebedf2;
        }

        .flow-item:not(:last-child)::after {
          content: "→";
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          color: #a0a7b7;
          font-weight: 800;
          z-index: 3;
        }

        .flow-number {
          width: 23px;
          height: 23px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #eae9ff;
          color: #625cf1;
          font-size: 9px;
          font-weight: 800;
        }

        .flow-item span {
          font-size: 9px;
          line-height: 1.25;
          color: #626b7f;
          font-weight: 700;
        }

        @media (max-width: 1050px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ops-grid {
            grid-template-columns: 1fr;
          }

          .ops-list {
            grid-column: auto;
          }

          .flow {
            grid-template-columns: repeat(3, 1fr);
          }

          .flow-item:not(:last-child)::after {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .screen {
            padding: 20px 16px 35px;
          }

          .topbar {
            margin-bottom: 30px;
          }

          .brand-subtitle {
            display: none;
          }

          .status {
            font-size: 10px;
          }

          .section-title {
            align-items: flex-start;
            flex-direction: column;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .map-card {
            min-height: 390px;
          }

          .flow {
            grid-template-columns: repeat(2, 1fr);
          }

          .map-footer {
            gap: 8px;
            left: 12px;
            right: 12px;
            justify-content: space-between;
          }

          .compact-row {
            gap: 8px;
          }
        }
      `}</style>
    </main>
  );
}

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-description">{description}</div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Operations />;
}