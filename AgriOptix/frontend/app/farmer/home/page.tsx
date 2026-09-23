"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Home as HomeIcon,
  Leaf,
  Menu,
  Package,
  Plus,
  Route,
  Truck,
  Wallet,
  Mic,
} from "lucide-react";
import { useWorkflow } from "../../../lib/store";

export default function FarmerHome() {
  const router = useRouter();
  const { wf } = useWorkflow();

  const farmerName = wf.farmer?.name?.trim() || "";
  const firstName = farmerName ? farmerName.split(/\s+/)[0] : "there";
  const farmLocation = wf.farmer?.village?.trim() || "Location not available";

  const harvest = wf.harvest;
  const harvestQuantity = harvest?.quantity_kg;
  const harvestCrop = harvest?.crop;

  const hasOrder = !!wf.order;
  const isSettled = wf.orderStatus === "SETTLED";
  const activeOrders = hasOrder && !isSettled ? "1" : "0";

  const expectedEarnings =
    wf.optimization?.net_realized_return ??
    wf.settlement?.net_settlement ??
    null;

  const pendingSettlement =
    wf.settlement && !isSettled ? wf.settlement.net_settlement : null;

  const money = (value: unknown) =>
    typeof value === "number"
      ? `₹${value.toLocaleString("en-IN")}`
      : "—";

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/farmer/home" },
    { label: "Harvest", icon: Leaf, path: "/farmer/harvest" },
    { label: "Orders", icon: Package, path: "/farmer/order" },
    { label: "Earnings", icon: Wallet, path: "/farmer/earnings" },
  ];

  return (
    <div className="farmer-home-page">
      <div className="farmer-home-shell">
        <header className="farmer-home-header">
          <div className="farmer-home-brand">
            <div className="farmer-home-logo">
              <Leaf size={27} strokeWidth={2.4} />
            </div>
            <div>
              <div className="farmer-home-brand-name">AgriOptix</div>
              <div className="farmer-home-tagline">Smarter Farms. Better Futures.</div>
            </div>
          </div>

          <button
            type="button"
            className="farmer-home-menu"
            aria-label="Menu"
            onClick={() => router.push("/farmer/dashboard")}
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="farmer-home-main">
          <section className="farmer-home-greeting">
            <h1>
              Good morning, {firstName} <span aria-hidden="true">👋</span>
            </h1>
          </section>

          <button
            type="button"
            className="farmer-home-farm-card"
            onClick={() => router.push("/farmer/onboarding")}
          >
            <div className="farmer-home-farm-icon">
              <Leaf size={30} />
            </div>
            <div className="farmer-home-farm-copy">
              <span>Your Farm</span>
              <strong>{farmLocation}</strong>
            </div>
            <ArrowRight size={28} />
          </button>

          <section className="farmer-home-stats" aria-label="Farm summary">
            <button
              type="button"
              className="farmer-home-stat-card"
              onClick={() => router.push("/farmer/harvest")}
            >
              <div className="farmer-home-stat-icon tomato">
                <Leaf size={27} />
              </div>
              <div className="farmer-home-stat-copy">
                <span>Today&apos;s Harvest</span>
                <strong>
                  {harvestQuantity != null
                    ? `${Number(harvestQuantity).toLocaleString("en-IN")} kg`
                    : "—"}
                </strong>
                <small>{harvestCrop || "No harvest yet"}</small>
              </div>
            </button>

            <button
              type="button"
              className="farmer-home-stat-card"
              onClick={() =>
                router.push(hasOrder ? "/farmer/tracking" : "/farmer/order")
              }
            >
              <div className="farmer-home-stat-icon truck">
                <Truck size={28} />
              </div>
              <div className="farmer-home-stat-copy">
                <span>Active Orders</span>
                <strong>{activeOrders}</strong>
                <small>{hasOrder ? (isSettled ? "Settled" : "In Transit") : "None yet"}</small>
              </div>
            </button>

            <button
              type="button"
              className="farmer-home-stat-card"
              onClick={() => router.push("/farmer/earnings")}
            >
              <div className="farmer-home-stat-icon rupee">
                <Wallet size={27} />
              </div>
              <div className="farmer-home-stat-copy">
                <span>Expected Earnings</span>
                <strong>{money(expectedEarnings)}</strong>
                <small>{expectedEarnings != null ? "Estimated net" : "No estimate yet"}</small>
              </div>
            </button>

            <button
              type="button"
              className="farmer-home-stat-card"
              onClick={() => router.push("/farmer/settlement")}
            >
              <div className="farmer-home-stat-icon settlement">
                <Wallet size={27} />
              </div>
              <div className="farmer-home-stat-copy">
                <span>Pending Settlement</span>
                <strong>{money(pendingSettlement)}</strong>
                <small>{isSettled ? "Settled" : "No settlement yet"}</small>
              </div>
            </button>
          </section>

          <button
            type="button"
            className="farmer-home-add"
            onClick={() => router.push("/farmer/harvest")}
          >
            <Plus size={34} strokeWidth={2.2} />
            <span>Add Harvest</span>
          </button>
        </main>

        <nav className="farmer-home-nav" aria-label="Farmer navigation">
          <div className="farmer-home-nav-inner">
            {navItems.map(({ label, icon: Icon, path }) => {
              const active = label === "Home";
              return (
                <button
                  key={label}
                  type="button"
                  className={`farmer-home-nav-item${active ? " active" : ""}`}
                  onClick={() => router.push(path)}
                >
                  <Icon size={28} strokeWidth={active ? 2.5 : 2} />
                  <span>{label}</span>
                  {active && <i aria-hidden="true" />}
                </button>
              );
            })}

            <button
              type="button"
              className="farmer-home-nav-item"
              aria-label="Voice"
              onClick={() => undefined}
            >
              <Mic size={28} strokeWidth={2} />
              <span>Voice</span>
            </button>
          </div>
        </nav>
      </div>

      <style jsx>{`
        .farmer-home-page {
          min-height: 100vh;
          background: #f4fbf8;
          color: #0e2f25;
          font-family: inherit;
        }

        .farmer-home-shell {
          width: min(1024px, 100%);
          min-height: 100vh;
          margin: 0 auto;
          background: #f7fbfa;
          box-shadow: 0 0 55px rgba(12, 55, 39, 0.08);
        }

        .farmer-home-header {
          min-height: 190px;
          padding: 38px 58px 70px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          color: #fff;
          background:
            linear-gradient(180deg, rgba(8, 93, 56, 0.96), rgba(17, 124, 76, 0.88)),
            url("/hero.jpeg") center/cover;
        }

        .farmer-home-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .farmer-home-logo {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          flex: none;
          border-radius: 50%;
          color: #128552;
          background: #fff;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .farmer-home-brand-name {
          font: 800 36px/1.05 Manrope, sans-serif;
          letter-spacing: -1.1px;
        }

        .farmer-home-tagline {
          margin-top: 8px;
          font-size: 17px;
          opacity: 0.96;
          letter-spacing: 0.1px;
        }

        .farmer-home-menu {
          width: 62px;
          height: 62px;
          border: 0;
          border-radius: 17px;
          display: grid;
          place-items: center;
          color: #fff;
          background: rgba(3, 99, 58, 0.82);
          cursor: pointer;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .farmer-home-main {
          margin-top: -28px;
          padding: 42px 58px 42px;
          border-radius: 27px 27px 0 0;
          background: #eff8f5;
          position: relative;
          z-index: 1;
        }

        .farmer-home-greeting h1 {
          margin: 0 0 30px;
          font: 800 35px/1.15 Manrope, sans-serif;
          letter-spacing: -0.8px;
          color: #0c3027;
        }

        .farmer-home-greeting span {
          font-family: "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        }

        .farmer-home-farm-card,
        .farmer-home-stat-card {
          width: 100%;
          border: 1px solid #e1ebe6;
          background: #fff;
          color: inherit;
          text-align: left;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(22, 74, 52, 0.07);
        }

        .farmer-home-farm-card {
          min-height: 136px;
          padding: 25px 28px;
          border-radius: 21px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .farmer-home-farm-icon {
          width: 75px;
          height: 75px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          flex: none;
          color: #15955b;
          background: #e1f8ee;
        }

        .farmer-home-farm-copy {
          flex: 1;
        }

        .farmer-home-farm-copy span,
        .farmer-home-stat-copy span {
          display: block;
          color: #58726a;
          font-size: 18px;
          line-height: 1.25;
        }

        .farmer-home-farm-copy strong {
          display: block;
          margin-top: 7px;
          font: 800 28px/1.15 Manrope, sans-serif;
          color: #102e26;
        }

        .farmer-home-farm-card > svg {
          color: #3f665b;
          flex: none;
        }

        .farmer-home-stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          margin-top: 18px;
        }

        .farmer-home-stat-card {
          min-height: 196px;
          padding: 28px;
          border-radius: 21px;
          display: flex;
          align-items: flex-start;
          gap: 20px;
        }

        .farmer-home-stat-icon {
          width: 66px;
          height: 66px;
          flex: none;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: #0d9558;
          background: #e1f8ee;
        }

        .farmer-home-stat-icon.tomato svg {
          transform: rotate(-5deg);
        }

        .farmer-home-stat-copy {
          min-width: 0;
        }

        .farmer-home-stat-copy strong {
          display: block;
          margin-top: 10px;
          color: #0c2e25;
          font: 800 31px/1.05 Manrope, sans-serif;
          letter-spacing: -0.7px;
        }

        .farmer-home-stat-copy small {
          display: block;
          margin-top: 8px;
          color: #58726a;
          font-size: 19px;
          line-height: 1.25;
        }

        .farmer-home-add {
          width: 100%;
          min-height: 112px;
          margin-top: 20px;
          border: 0;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #fff;
          background: linear-gradient(135deg, #10a15f, #0c8f55);
          box-shadow: 0 14px 28px rgba(12, 143, 85, 0.2);
          cursor: pointer;
          font: 800 31px/1 Manrope, sans-serif;
        }

        .farmer-home-nav {
          padding: 22px 28px 30px;
          background: #f7fbfa;
        }

        .farmer-home-nav-inner {
          min-height: 126px;
          padding: 12px 18px 10px;
          border: 1px solid #e1ebe6;
          border-radius: 21px;
          background: #fff;
          box-shadow: 0 8px 25px rgba(22, 74, 52, 0.06);
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 6px;
        }

        .farmer-home-nav-item {
          position: relative;
          border: 0;
          background: transparent;
          color: #526c64;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 9px;
          cursor: pointer;
          border-radius: 14px;
          font-size: 17px;
        }

        .farmer-home-nav-item.active {
          color: #078d50;
          font-weight: 800;
        }

        .farmer-home-nav-item i {
          position: absolute;
          width: 68px;
          height: 7px;
          border-radius: 99px;
          background: #0b9a58;
          bottom: 2px;
        }

        @media (hover: hover) {
          .farmer-home-farm-card:hover,
          .farmer-home-stat-card:hover {
            border-color: #bfe5d4;
            transform: translateY(-1px);
          }

          .farmer-home-add:hover {
            filter: brightness(1.03);
          }

          .farmer-home-nav-item:hover {
            background: #f0f8f5;
          }
        }

        @media (max-width: 720px) {
          .farmer-home-header {
            min-height: 155px;
            padding: 26px 22px 58px;
          }

          .farmer-home-logo {
            width: 58px;
            height: 58px;
          }

          .farmer-home-brand-name {
            font-size: 28px;
          }

          .farmer-home-tagline {
            font-size: 13px;
          }

          .farmer-home-menu {
            width: 50px;
            height: 50px;
          }

          .farmer-home-main {
            padding: 30px 22px 30px;
          }

          .farmer-home-greeting h1 {
            font-size: 28px;
          }

          .farmer-home-farm-copy strong {
            font-size: 22px;
          }

          .farmer-home-stat-card {
            min-height: 160px;
            padding: 20px;
          }

          .farmer-home-stat-icon {
            width: 55px;
            height: 55px;
          }

          .farmer-home-stat-copy strong {
            font-size: 25px;
          }

          .farmer-home-stat-copy small {
            font-size: 16px;
          }

          .farmer-home-add {
            min-height: 88px;
            font-size: 25px;
          }

          .farmer-home-nav {
            padding: 14px 12px 18px;
          }

          .farmer-home-nav-inner {
            min-height: 96px;
            padding: 8px 6px 7px;
          }

          .farmer-home-nav-item {
            font-size: 13px;
            gap: 5px;
          }

          .farmer-home-nav-item svg {
            width: 23px;
            height: 23px;
          }

          .farmer-home-nav-item i {
            width: 44px;
            height: 5px;
          }
        }

        @media (max-width: 520px) {
          .farmer-home-stats {
            grid-template-columns: 1fr;
          }

          .farmer-home-farm-card {
            padding: 20px;
            gap: 15px;
          }

          .farmer-home-farm-icon {
            width: 58px;
            height: 58px;
          }

          .farmer-home-farm-copy span,
          .farmer-home-stat-copy span {
            font-size: 16px;
          }

          .farmer-home-farm-copy strong {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
