"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverEarningsHistory.module.css";

type DayEarning = {
  date: string;
  day: string;
  amount: number;
  trips: number;
};

const earningsData: DayEarning[] = [
  { date: "Apr 18", day: "18", amount: 5420, trips: 1 },
  { date: "Apr 19", day: "19", amount: 6180, trips: 1 },
  { date: "Apr 20", day: "20", amount: 5760, trips: 1 },
  { date: "Apr 21", day: "21", amount: 7120, trips: 1 },
  { date: "Apr 22", day: "22", amount: 5980, trips: 1 },
  { date: "Apr 23", day: "23", amount: 6450, trips: 1 },
  { date: "Apr 24", day: "24", amount: 5770, trips: 1 },
];

const formatCurrency = (amount: number) =>
  `₹${amount.toLocaleString("en-IN")}`;

export default function EarningsHistoryPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<DayEarning>(
    earningsData[6]
  );

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

  const totalEarnings = useMemo(
    () => earningsData.reduce((sum, item) => sum + item.amount, 0),
    []
  );

  const averageEarnings = Math.round(totalEarnings / earningsData.length);

  const highestDay = useMemo(
    () =>
      earningsData.reduce((highest, current) =>
        current.amount > highest.amount ? current : highest
      ),
    []
  );

  const maxAmount = Math.max(...earningsData.map((item) => item.amount));

  if (!driver) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Loading earnings...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>A</div>

          <div>
            <div className={styles.brandName}>AgriOptix</div>
            <div className={styles.brandSub}>Driver / Transporter Portal</div>
          </div>
        </div>

        <div className={styles.headerTitle}>
          <span>Earnings History</span>
          <small>08 / 09</small>
        </div>

        <div className={styles.driverBadge}>
          <div className={styles.avatar}>
            {driver?.full_name?.charAt(0)?.toUpperCase() ||
              driver?.fullName?.charAt(0)?.toUpperCase() ||
              "D"}
          </div>

          <div className={styles.driverInfo}>
            <strong>
              {driver?.full_name || driver?.fullName || "Driver"}
            </strong>
            <span>Transport Partner</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* PAGE INTRO */}
        <section className={styles.pageIntro}>
          <div>
            <span className={styles.eyebrow}>FINANCIAL OVERVIEW</span>
            <h1>Your Earnings</h1>
            <p>
              Track your completed-trip earnings and daily performance.
            </p>
          </div>

          <button
            className={styles.backButton}
            onClick={() => router.push("/driver/earnings")}
          >
            ← Back to Earnings
          </button>
        </section>

        {/* SUMMARY CARD */}
        <section className={styles.summaryCard}>
          <div className={styles.summaryMain}>
            <span className={styles.summaryLabel}>7-DAY EARNINGS</span>

            <div className={styles.totalAmount}>
              {formatCurrency(totalEarnings)}
            </div>

            <div className={styles.growth}>
              <span className={styles.growthArrow}>↗</span>
              <strong>+12%</strong>
              <span>vs previous 7 days</span>
            </div>
          </div>

          <div className={styles.summaryDivider}></div>

          <div className={styles.summaryStats}>
            <div>
              <span>Average / Day</span>
              <strong>{formatCurrency(averageEarnings)}</strong>
            </div>

            <div>
              <span>Highest Day</span>
              <strong>{formatCurrency(highestDay.amount)}</strong>
            </div>

            <div>
              <span>Completed Trips</span>
              <strong>7</strong>
            </div>
          </div>
        </section>

        {/* DEMO NOTICE */}
        <div className={styles.demoNotice}>
          <span className={styles.demoIcon}>i</span>

          <div>
            <strong>Prototype earnings data</strong>
            <p>
              These values demonstrate the AgriOptix transporter workflow.
              Production earnings can be connected to completed trips and
              settlement records.
            </p>
          </div>
        </div>

        {/* CHART */}
        <section className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.sectionLabel}>DAILY PERFORMANCE</span>
              <h2>Apr 18 — Apr 24</h2>
            </div>

            <div className={styles.selectedAmount}>
              <span>{selectedDay.date}</span>
              <strong>{formatCurrency(selectedDay.amount)}</strong>
            </div>
          </div>

          <div className={styles.chartArea}>
            <div className={styles.yAxis}>
              <span>₹8k</span>
              <span>₹6k</span>
              <span>₹4k</span>
              <span>₹2k</span>
              <span>₹0</span>
            </div>

            <div className={styles.chart}>
              <div className={styles.gridLine}></div>
              <div className={styles.gridLine}></div>
              <div className={styles.gridLine}></div>
              <div className={styles.gridLine}></div>

              <div className={styles.bars}>
                {earningsData.map((item) => {
                  const height = Math.max(
                    20,
                    (item.amount / maxAmount) * 100
                  );

                  const isSelected = selectedDay.date === item.date;

                  return (
                    <button
                      key={item.date}
                      className={`${styles.barColumn} ${
                        isSelected ? styles.selectedColumn : ""
                      }`}
                      onClick={() => setSelectedDay(item)}
                    >
                      <div className={styles.tooltip}>
                        {formatCurrency(item.amount)}
                      </div>

                      <div className={styles.barWrapper}>
                        <div
                          className={styles.bar}
                          style={{ height: `${height}%` }}
                        ></div>
                      </div>

                      <span className={styles.barLabel}>{item.day}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.chartFooter}>
            <span>APRIL 2026</span>
            <span>
              Selected: <strong>{selectedDay.date}</strong>
            </span>
          </div>
        </section>

        {/* SELECTED DAY */}
        <section className={styles.detailCard}>
          <div className={styles.detailHeader}>
            <div>
              <span className={styles.sectionLabel}>SELECTED DAY</span>
              <h2>{selectedDay.date}</h2>
            </div>

            <div className={styles.detailTotal}>
              {formatCurrency(selectedDay.amount)}
            </div>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <span>Completed Trips</span>
              <strong>{selectedDay.trips}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Average / Trip</span>
              <strong>{formatCurrency(selectedDay.amount)}</strong>
            </div>

            <div className={styles.detailItem}>
              <span>Settlement</span>
              <strong className={styles.settled}>Ready</strong>
            </div>
          </div>
        </section>

        {/* RECENT EARNINGS */}
        <section className={styles.recentCard}>
          <div className={styles.cardHeader}>
            <div>
              <span className={styles.sectionLabel}>RECENT ACTIVITY</span>
              <h2>Daily Earnings</h2>
            </div>
          </div>

          <div className={styles.earningsList}>
            {earningsData
              .slice()
              .reverse()
              .map((item) => (
                <button
                  key={item.date}
                  className={`${styles.earningRow} ${
                    selectedDay.date === item.date
                      ? styles.activeRow
                      : ""
                  }`}
                  onClick={() => setSelectedDay(item)}
                >
                  <div className={styles.dateIcon}>₹</div>

                  <div className={styles.rowInfo}>
                    <strong>{item.date}</strong>
                    <span>
                      {item.trips} completed trip
                      {item.trips !== 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className={styles.rowAmount}>
                    <strong>{formatCurrency(item.amount)}</strong>
                    <span>Ready for settlement</span>
                  </div>

                  <span className={styles.rowArrow}>→</span>
                </button>
              ))}
          </div>
        </section>

        {/* FOOTER ACTION */}
        <section className={styles.bottomAction}>
          <button
            className={styles.primaryButton}
            onClick={() => router.push("/driver/earnings")}
          >
            View Current Earnings
          </button>

          <p>
            AgriOptix · On Time. Every Time.
          </p>
        </section>
      </div>

      {/* BOTTOM NAV */}
      <nav className={styles.bottomNav}>
        <button onClick={() => router.push("/driver/dashboard")}>
          <span>⌂</span>
          Home
        </button>

        <button onClick={() => router.push("/driver/route")}>
          <span>⌁</span>
          Route
        </button>

        <button onClick={() => router.push("/driver/loads")}>
          <span>▣</span>
          Loads
        </button>

        <button
          className={styles.activeNav}
          onClick={() => router.push("/driver/earnings")}
        >
          <span>₹</span>
          Earnings
        </button>

        <button onClick={() => router.push("/driver/profile")}>
  <span>◯</span>
  Profile
</button>
      </nav>
    </main>
  );
}