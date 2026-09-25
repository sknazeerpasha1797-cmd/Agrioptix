"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./dashboard.css";

export default function BuyerHome() {
  const router = useRouter();

  const [buyerName, setBuyerName] = useState("FreshMart Foods");
  const [activeMenu, setActiveMenu] = useState("home");

  useEffect(() => {
    try {
      const storedAccount = localStorage.getItem("buyerAccount");

      if (storedAccount) {
        const account = JSON.parse(storedAccount);

        if (account?.company) {
          setBuyerName(account.company);
        } else if (account?.fullName) {
          setBuyerName(account.fullName);
        }
      }
    } catch (error) {
      console.error("Unable to load buyer account:", error);
    }
  }, []);

  const goTo = (path: string, menu?: string) => {
    if (menu) {
      setActiveMenu(menu);
    }

    router.push(path);
  };

  const handleHome = () => {
    setActiveMenu("home");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="dashboard-page">

      <div className="dashboard-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <header className="dashboard-header">

          <div className="brand-section">

            <div className="brand-logo">
              <span>◒</span>
            </div>

            <div className="brand-text">

              <div className="brand-name">
                AgriOptix
              </div>

              <div className="brand-tagline">
                Smarter Farms. Better Futures.
              </div>

            </div>

          </div>

          <button
            type="button"
            className="header-profile"
            onClick={() =>
              goTo("/buyer/profile", "profile")
            }
            aria-label="Open profile"
          >
            <span className="profile-icon">
              ♙
            </span>
          </button>

        </header>


        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <section className="dashboard-content">

          {/* ===================================================
              WELCOME
          ==================================================== */}

          <section className="welcome-section">

            <div>

              <p className="welcome-small">
                BUYER DASHBOARD
              </p>

              <h1>
                Welcome, {buyerName} 👋
              </h1>

              <p className="welcome-description">
                Manage your agricultural procurement,
                discover quality produce and track your
                orders in one place.
              </p>

            </div>

          </section>


          {/* ===================================================
              STAT CARDS
          ==================================================== */}

          <section className="stats-grid">

            {/* ACTIVE REQUIREMENTS */}

            <button
              type="button"
              className="stat-card"
              onClick={() =>
                goTo("/buyer/requirements")
              }
            >

              <div className="stat-icon green">
                <span>☷</span>
              </div>

              <div className="stat-information">

                <span className="stat-title">
                  Active Requirements
                </span>

                <strong>
                  2
                </strong>

                <small>
                  View requirements
                </small>

              </div>

            </button>


            {/* INCOMING SUPPLY */}

            <button
              type="button"
              className="stat-card"
              onClick={() =>
                goTo("/buyer/supply", "supply")
              }
            >

              <div className="stat-icon blue">
                <span>⌂</span>
              </div>

              <div className="stat-information">

                <span className="stat-title">
                  Incoming Supply
                </span>

                <strong>
                  3
                </strong>

                <small>
                  Available matches
                </small>

              </div>

            </button>


            {/* ONGOING ORDERS */}

            <button
              type="button"
              className="stat-card"
              onClick={() =>
                goTo("/buyer/orders", "orders")
              }
            >

              <div className="stat-icon green">
                <span>▰</span>
              </div>

              <div className="stat-information">

                <span className="stat-title">
                  Ongoing Orders
                </span>

                <strong>
                  2
                </strong>

                <small>
                  Track orders
                </small>

              </div>

            </button>


            {/* TOTAL PURCHASES */}

            <button
              type="button"
              className="stat-card"
              onClick={() =>
                goTo("/buyer/payments", "payments")
              }
            >

              <div className="stat-icon money">
                <span>₹</span>
              </div>

              <div className="stat-information">

                <span className="stat-title">
                  Total Purchases
                </span>

                <strong className="purchase-value">
                  ₹2,48,000
                </strong>

                <small>
                  This month
                </small>

              </div>

            </button>

          </section>


          {/* ===================================================
              CREATE REQUIREMENT
          ==================================================== */}

          <button
            type="button"
            className="create-requirement"
            onClick={() =>
              goTo("/buyer/requirements")
            }
          >

            <span className="create-plus">
              +
            </span>

            <span>
              Create Requirement
            </span>

            <span className="create-arrow">
              →
            </span>

          </button>


          {/* ===================================================
              QUICK ACTIONS
          ==================================================== */}

          <section className="quick-section">

            <div className="section-heading">

              <div>

                <p>
                  QUICK ACTIONS
                </p>

                <h2>
                  Manage procurement
                </h2>

              </div>

              <span>
                ● LIVE
              </span>

            </div>


            <div className="quick-grid">

              {/* NEW REQUIREMENT */}

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  goTo("/buyer/requirements")
                }
              >

                <div className="quick-card-icon">
                  +
                </div>

                <div>

                  <strong>
                    New Requirement
                  </strong>

                  <small>
                    Tell us what produce you need
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              {/* FIND SUPPLY */}

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  goTo("/buyer/supply", "supply")
                }
              >

                <div className="quick-card-icon supply-icon">
                  ◉
                </div>

                <div>

                  <strong>
                    Find Supply
                  </strong>

                  <small>
                    Explore matching farmers
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>


              {/* TRACK ORDERS */}

              <button
                type="button"
                className="quick-card"
                onClick={() =>
                  goTo("/buyer/orders", "orders")
                }
              >

                <div className="quick-card-icon order-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    Track Orders
                  </strong>

                  <small>
                    Monitor your deliveries
                  </small>

                </div>

                <span>
                  →
                </span>

              </button>

            </div>

          </section>


          {/* ===================================================
              RECENT ACTIVITY
          ==================================================== */}

          <section className="activity-section">

            <div className="section-heading">

              <div>

                <p>
                  RECENT ACTIVITY
                </p>

                <h2>
                  Procurement overview
                </h2>

              </div>

            </div>


            <div className="activity-card">

              {/* ACTIVITY 1 */}

              <div className="activity-item">

                <div className="activity-dot green-dot">
                  ✓
                </div>

                <div className="activity-details">

                  <strong>
                    Requirement matched
                  </strong>

                  <span>
                    Tomato • Grade A • 1,550 kg
                  </span>

                </div>

                <small>
                  2h ago
                </small>

              </div>


              {/* ACTIVITY 2 */}

              <div className="activity-item">

                <div className="activity-dot blue-dot">
                  →
                </div>

                <div className="activity-details">

                  <strong>
                    Order picked up
                  </strong>

                  <span>
                    Order #AGT5678
                  </span>

                </div>

                <small>
                  5h ago
                </small>

              </div>


              {/* ACTIVITY 3 */}

              <div className="activity-item">

                <div className="activity-dot orange-dot">
                  ₹
                </div>

                <div className="activity-details">

                  <strong>
                    Payment processed
                  </strong>

                  <span>
                    ₹34,300 settlement
                  </span>

                </div>

                <small>
                  Yesterday
                </small>

              </div>

            </div>

          </section>

        </section>


        {/* =====================================================
            FOOTER
        ====================================================== */}

        <footer className="dashboard-footer">

          <span>
            © 2026 AgriOptix
          </span>

          <span>
            Better Decisions. Fresher Produce.
          </span>

        </footer>


        {/* =====================================================
            MOBILE BOTTOM NAVIGATION
        ====================================================== */}

        <nav className="mobile-navigation">

          {/* HOME */}

          <button
            type="button"
            className={
              activeMenu === "home"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={handleHome}
          >

            <span className="nav-icon">
              ⌂
            </span>

            <span>
              Home
            </span>

          </button>


          {/* SUPPLY */}

          <button
            type="button"
            className={
              activeMenu === "supply"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              goTo("/buyer/supply", "supply")
            }
          >

            <span className="nav-icon">
              ◉
            </span>

            <span>
              Supply
            </span>

          </button>


          {/* ORDERS */}

          <button
            type="button"
            className={
              activeMenu === "orders"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              goTo("/buyer/orders", "orders")
            }
          >

            <span className="nav-icon">
              🛒
            </span>

            <span>
              Orders
            </span>

          </button>


          {/* PAYMENTS */}

          <button
            type="button"
            className={
              activeMenu === "payments"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              goTo("/buyer/payments", "payments")
            }
          >

            <span className="nav-icon">
              ▣
            </span>

            <span>
              Payments
            </span>

          </button>


          {/* PROFILE */}

          <button
            type="button"
            className={
              activeMenu === "profile"
                ? "nav-item active"
                : "nav-item"
            }
            onClick={() =>
              goTo("/buyer/profile", "profile")
            }
          >

            <span className="nav-icon">
              ♙
            </span>

            <span>
              Profile
            </span>

          </button>

        </nav>

      </div>

    </main>
  );
}