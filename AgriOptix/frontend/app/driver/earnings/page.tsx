"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverEarnings.module.css";

type Driver = {
  full_name?: string;
  vehicle_number?: string;
};

type EarningRow = {
  label: string;
  description: string;
  amount: number;
  icon: string;
};

export default function DriverEarningsPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const earnings: EarningRow[] = [
    {
      label: "Base Fare",
      description: "Farm-to-buyer transport",
      amount: 4200,
      icon: "🚚",
    },
    {
      label: "Per Kg Bonus",
      description: "Load completion incentive",
      amount: 1650,
      icon: "⚖️",
    },
    {
      label: "Additional Stop",
      description: "Farm B collection stop",
      amount: 500,
      icon: "📍",
    },
    {
      label: "Fuel Allowance",
      description: "Trip fuel support",
      amount: 500,
      icon: "⛽",
    },
  ];

  const total = earnings.reduce((sum, item) => sum + item.amount, 0);

  useEffect(() => {
    const storedDriver =
      localStorage.getItem("agrioptix_driver") ||
      sessionStorage.getItem("agrioptix_driver");

    if (!storedDriver) {
      router.replace("/driver/login");
      return;
    }

    try {
      setDriver(JSON.parse(storedDriver));
    } catch {
      router.replace("/driver/login");
    }
  }, [router]);

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>AgriOptix</div>
          <div className={styles.moduleTitle}>Driver Earnings</div>
        </div>

        <div className={styles.headerRight}>
          <span>06 / 09</span>

          <div className={styles.avatar}>
            {(driver?.full_name || "D").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <section className={styles.content}>
        {/* Heading */}
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>TRIP COMPLETED</p>
            <h1>Your Earnings</h1>
            <p>
              Your earnings from the completed AgriOptix delivery are ready.
            </p>
          </div>

          <div className={styles.paidBadge}>
            <span>✓</span>
            DELIVERY COMPLETED
          </div>
        </div>

        {/* Total earnings */}
        <section className={styles.totalCard}>
          <div className={styles.totalTop}>
            <div>
              <span className={styles.totalLabel}>TOTAL TRIP EARNINGS</span>

              <h2>
                ₹{total.toLocaleString("en-IN")}
              </h2>

              <p>Today's completed trip</p>
            </div>

            <div className={styles.moneyIcon}>₹</div>
          </div>

          <div className={styles.totalMeta}>
            <div>
              <span>Trip</span>
              <strong>Farm A → Hyderabad</strong>
            </div>

            <div>
              <span>Load</span>
              <strong>1,548 kg</strong>
            </div>

            <div>
              <span>Status</span>
              <strong className={styles.green}>Completed</strong>
            </div>
          </div>
        </section>

        {/* Earnings breakdown */}
        <section className={styles.breakdownCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.label}>EARNINGS BREAKDOWN</span>
              <h2>How you earned it</h2>
            </div>

            <button
              type="button"
              className={styles.detailsToggle}
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? "Hide Details" : "View Details"}
            </button>
          </div>

          <div className={styles.earningList}>
            {earnings.map((item) => (
              <div className={styles.earningRow} key={item.label}>
                <div className={styles.earningIcon}>{item.icon}</div>

                <div className={styles.earningInfo}>
                  <strong>{item.label}</strong>

                  <span>{item.description}</span>

                  {showDetails && (
                    <small>
                      Verified against completed trip activity
                    </small>
                  )}
                </div>

                <strong className={styles.amount}>
                  +₹{item.amount.toLocaleString("en-IN")}
                </strong>
              </div>
            ))}
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total Earnings</span>

            <strong>₹{total.toLocaleString("en-IN")}</strong>
          </div>
        </section>

        {/* Trip summary */}
        <section className={styles.tripCard}>
          <div className={styles.tripHeader}>
            <div>
              <span className={styles.label}>COMPLETED TRIP</span>
              <h2>Tomato Delivery</h2>
            </div>

            <span className={styles.completedBadge}>COMPLETED</span>
          </div>

          <div className={styles.tripRoute}>
            <div className={styles.routePoint}>
              <div className={styles.startDot} />

              <div>
                <span>Pickup</span>
                <strong>Farm A, Ranga Reddy</strong>
              </div>
            </div>

            <div className={styles.routeLine} />

            <div className={styles.routePoint}>
              <div className={styles.endDot} />

              <div>
                <span>Delivery</span>
                <strong>Hyderabad Buyer</strong>
              </div>
            </div>
          </div>

          <div className={styles.tripStats}>
            <div>
              <span>Delivered</span>
              <strong>1,548 kg</strong>
            </div>

            <div>
              <span>Grade</span>
              <strong>Grade A</strong>
            </div>

            <div>
              <span>Delivered At</span>
              <strong>06:28 PM</strong>
            </div>
          </div>
        </section>

        {/* Payment status */}
        <section className={styles.paymentCard}>
          <div className={styles.paymentIcon}>✓</div>

          <div>
            <span>SETTLEMENT STATUS</span>
            <h2>Ready for Settlement</h2>
            <p>
              Your completed trip has been verified. Settlement can be
              processed through the AgriOptix payment system.
            </p>
          </div>

          <div className={styles.paymentAmount}>
            ₹{total.toLocaleString("en-IN")}
          </div>
        </section>

        {/* Action */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.historyButton}
            onClick={() => router.push("/driver/earnings/history")}
          >
            View Earnings History
          </button>

          <button
            type="button"
            className={styles.homeButton}
            onClick={() => router.push("/driver/dashboard")}
          >
            Back to Dashboard →
          </button>
        </div>

        {/* Demo note */}
        <div className={styles.demoNote}>
          <span>DEMO SETTLEMENT</span>
          <p>
            Earnings shown here are prototype values based on the AgriOptix
            master workflow. Production payments can connect to the settlement
            service after delivery verification.
          </p>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className={styles.bottomNav}>
        <button onClick={() => router.push("/driver/dashboard")}>
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button onClick={() => router.push("/driver/route")}>
          <span>⌁</span>
          <small>Route</small>
        </button>

        <button onClick={() => router.push("/driver/dashboard")}>
          <span>▣</span>
          <small>Loads</small>
        </button>

        <button className={styles.navActive}>
          <span>₹</span>
          <small>Earnings</small>
        </button>

        <button onClick={() => router.push("/driver/profile")}>
  <span>●</span>
  <small>Profile</small>
</button>
      </nav>
    </main>
  );
}