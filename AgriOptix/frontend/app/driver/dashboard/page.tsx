"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverDashboard.module.css";

type Driver = {
  id: number;
  fullName: string;
  mobileNumber: string;
  vehicleType?: string;
  vehicleNumber?: string;
};

type DashboardData = {
  driver: Driver;
  stats: {
    active_trips: number;
    completed_trips: number;
    total_distance_km: number;
    estimated_earnings: number;
    rating: number;
  };
  active_trip: {
    id?: number;
    pickup?: string;
    destination?: string;
    crop?: string;
    quantity_kg?: number;
    distance_km?: number;
    estimated_earnings?: number;
    priority?: string;
  } | null;
  available_jobs: {
    id: number;
    pickup: string;
    destination: string;
    crop: string;
    quantity_kg: number;
    distance_km: number;
    estimated_earnings: number;
    priority: string;
  }[];
};

export default function DriverDashboard() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedDriver =
      localStorage.getItem("agrioptix_driver") ||
      sessionStorage.getItem("agrioptix_driver");

    if (!storedDriver) {
      router.replace("/driver/login");
      return;
    }

    try {
      const parsedDriver: Driver = JSON.parse(storedDriver);
      setDriver(parsedDriver);

      fetch(
        `http://127.0.0.1:8000/api/drivers/${parsedDriver.id}/dashboard`
      )
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to load dashboard");
          }

          return response.json();
        })
        .then((data) => {
          setDashboard(data);
        })
        .catch((error) => {
          console.error("Dashboard error:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error("Invalid driver session:", error);
      router.replace("/driver/login");
    }
  }, [router]);

  const navigate = (path: string) => {
    router.push(path);
  };

  if (loading || !driver) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingLogo}>A</div>
          <h2>Loading AgriOptix</h2>
          <p>Preparing your transporter dashboard...</p>
          <div className={styles.loader}></div>
        </div>
      </main>
    );
  }

  const firstName = driver.fullName?.split(" ")[0] || "Driver";

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brandSection}>
          <div className={styles.logo}>A</div>

          <div>
            <div className={styles.brandName}>AgriOptix</div>
            <div className={styles.moduleName}>Driver / Transporter</div>
          </div>
        </div>

        <button
          className={styles.profileButton}
          onClick={() => navigate("/driver/profile")}
          aria-label="Open profile"
        >
          <span className={styles.profileAvatar}>
            {firstName.charAt(0).toUpperCase()}
          </span>
        </button>
      </header>

      {/* MAIN CONTENT */}
      <section className={styles.content}>
        {/* GREETING */}
        <div className={styles.greetingSection}>
          <div>
            <p className={styles.eyebrow}>ON TIME. EVERY TIME.</p>

            <h1>
              Good morning, {firstName} <span>👋</span>
            </h1>

            <p className={styles.subtitle}>
              Your optimized farm-to-market journey starts here.
            </p>
          </div>

          <div className={styles.driverBadge}>
            <span className={styles.onlineDot}></span>
            Available
          </div>
        </div>

        {/* KPI GRID */}
        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.greenIcon}`}>
              🚚
            </div>

            <div>
              <p>Today&apos;s Assigned Loads</p>
              <strong>
                {dashboard?.stats?.active_trips || 3}
              </strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.blueIcon}`}>
              ⏱
            </div>

            <div>
              <p>Next Pickup</p>
              <strong>08:30 AM</strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.goldIcon}`}>
              ₹
            </div>

            <div>
              <p>Today&apos;s Earnings</p>
              <strong>₹6,850</strong>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.purpleIcon}`}>
              📍
            </div>

            <div>
              <p>Active Route</p>
              <strong>Hyderabad</strong>
            </div>
          </article>
        </section>

        {/* ACTIVE TRIP */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>LIVE OPERATION</p>
              <h2>Active Trip</h2>
            </div>

            <span className={styles.liveBadge}>
              <span></span>
              LIVE
            </span>
          </div>

          <div className={styles.tripCard}>
            <div className={styles.tripTop}>
              <div className={styles.tripCrop}>
                <div className={styles.cropIcon}>🍅</div>

                <div>
                  <span>Current Shipment</span>
                  <h3>
                    {dashboard?.active_trip?.crop || "Tomatoes"}
                  </h3>
                </div>
              </div>

              <span className={styles.priorityBadge}>
                HIGH PRIORITY
              </span>
            </div>

            <div className={styles.tripRoute}>
              <div className={styles.routePoint}>
                <span className={styles.routeDotPickup}></span>

                <div>
                  <small>PICKUP</small>
                  <strong>
                    {dashboard?.active_trip?.pickup ||
                      "Ranga Reddy Farm"}
                  </strong>
                </div>
              </div>

              <div className={styles.routeLine}></div>

              <div className={styles.routePoint}>
                <span className={styles.routeDotDestination}></span>

                <div>
                  <small>DESTINATION</small>
                  <strong>
                    {dashboard?.active_trip?.destination ||
                      "Hyderabad Buyer"}
                  </strong>
                </div>
              </div>
            </div>

            <div className={styles.tripMetrics}>
              <div>
                <span>LOAD</span>
                <strong>
                  {(
                    dashboard?.active_trip?.quantity_kg || 1550
                  ).toLocaleString()}{" "}
                  kg
                </strong>
              </div>

              <div>
                <span>DISTANCE</span>
                <strong>
                  {dashboard?.active_trip?.distance_km || 65} km
                </strong>
              </div>

              <div>
                <span>ETA</span>
                <strong>2h 15m</strong>
              </div>
            </div>

            <button
              className={styles.primaryButton}
              onClick={() => navigate("/driver/route")}
            >
              View Active Route
              <span>→</span>
            </button>
          </div>
        </section>

        {/* NEXT ACTION */}
        <section className={styles.nextAction}>
          <div className={styles.nextActionIcon}>✓</div>

          <div className={styles.nextActionText}>
            <span>NEXT ACTION</span>
            <h3>Continue your optimized journey</h3>
            <p>
              Follow the AgriOptix route and complete your next
              pickup verification.
            </p>
          </div>

          <button
            className={styles.secondaryButton}
            onClick={() => navigate("/driver/route")}
          >
            Continue Trip
            <span>→</span>
          </button>
        </section>

        {/* AVAILABLE JOBS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <p className={styles.sectionEyebrow}>AGRIOPTIX MATCHING</p>
              <h2>Available Loads</h2>
            </div>

            <button
              className={styles.textButton}
              onClick={() => navigate("/driver/loads")}
            >
              View All →
            </button>
          </div>

          <div className={styles.jobsGrid}>
            {(dashboard?.available_jobs || []).map((job) => (
              <article className={styles.jobCard} key={job.id}>
                <div className={styles.jobHeader}>
                  <div className={styles.jobCrop}>
                    <span>🌾</span>
                    <strong>{job.crop}</strong>
                  </div>

                  <span
                    className={
                      job.priority === "HIGH"
                        ? styles.highPriority
                        : styles.normalPriority
                    }
                  >
                    {job.priority}
                  </span>
                </div>

                <div className={styles.jobInfo}>
                  <div>
                    <span>LOAD</span>
                    <strong>
                      {job.quantity_kg.toLocaleString()} kg
                    </strong>
                  </div>

                  <div>
                    <span>ROUTE</span>
                    <strong>{job.distance_km} km</strong>
                  </div>

                  <div>
                    <span>EARNINGS</span>
                    <strong>₹{job.estimated_earnings}</strong>
                  </div>
                </div>

                <div className={styles.jobRoute}>
                  <span>{job.pickup}</span>
                  <span>→</span>
                  <span>{job.destination}</span>
                </div>

                <button
                  className={styles.jobButton}
                  onClick={() => navigate("/driver/loads")}
                >
                  View Load
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* CORE VALUE */}
        <section className={styles.valueBanner}>
          <div className={styles.valueIcon}>⚡</div>

          <div>
            <span>AGRIOPTIX INTELLIGENCE</span>

            <h2>
              Smarter Farms. Better Futures.
            </h2>

            <p>
              Your loads, pickup sequence, route, ETA and delivery
              workflow are designed to work together — helping fresh
              produce move efficiently from farm to market.
            </p>
          </div>
        </section>
      </section>

      {/* BOTTOM NAVIGATION */}
      <nav className={styles.bottomNav}>
        <button
          className={`${styles.navItem} ${styles.activeNav}`}
          onClick={() => navigate("/driver/dashboard")}
        >
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => navigate("/driver/route")}
        >
          <span>⌁</span>
          <small>Route</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => navigate("/driver/loads")}
        >
          <span>▣</span>
          <small>Loads</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => navigate("/driver/earnings")}
        >
          <span>₹</span>
          <small>Earnings</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => navigate("/driver/profile")}
        >
          <span>♙</span>
          <small>Profile</small>
        </button>
      </nav>
    </main>
  );
}