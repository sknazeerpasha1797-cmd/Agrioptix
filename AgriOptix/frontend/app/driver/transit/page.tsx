"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverTransit.module.css";

type Driver = {
  id?: number;
  full_name?: string;
  mobile_number?: string;
  vehicle_type?: string;
  vehicle_number?: string;
};

export default function DriverTransitPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [navigationActive, setNavigationActive] = useState(true);
  const [progress, setProgress] = useState(62);
  const [etaMinutes, setEtaMinutes] = useState(135);
  const [gpsPulse, setGpsPulse] = useState(true);

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

  // Demo telemetry simulation.
  // This does NOT represent real GPS tracking.
  useEffect(() => {
    if (!navigationActive) return;

    const interval = setInterval(() => {
      setGpsPulse((prev) => !prev);

      setProgress((prev) => {
        if (prev >= 95) return 62;
        return prev + 1;
      });

      setEtaMinutes((prev) => {
        if (prev <= 120) return 135;
        return prev - 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [navigationActive]);

  const etaText = useMemo(() => {
    const hours = Math.floor(etaMinutes / 60);
    const minutes = etaMinutes % 60;

    return `${hours}h ${minutes.toString().padStart(2, "0")}m`;
  }, [etaMinutes]);

  const driverName =
    driver?.full_name?.split(" ")[0] || "Driver";

  const handleStartStopNavigation = () => {
    setNavigationActive((prev) => !prev);
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>AgriOptix</div>
          <div className={styles.moduleTitle}>In Transit</div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.step}>04 / 09</div>

          <div className={styles.avatar}>
            {driverName.charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.progressLabels}>
          <span className={styles.completed}>Route</span>
          <span className={styles.completed}>Pickup</span>
          <span className={styles.active}>Transit</span>
          <span>Delivery</span>
        </div>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <section className={styles.content}>
        {/* Greeting */}
        <div className={styles.greeting}>
          <div>
            <p className={styles.eyebrow}>ACTIVE TRIP</p>
            <h1>You're on the way, {driverName} 👋</h1>
            <p>
              Keep the load moving safely. Your route is being monitored in
              demo mode.
            </p>
          </div>

          <div
            className={`${styles.gpsStatus} ${
              gpsPulse ? styles.gpsActive : ""
            }`}
          >
            <span className={styles.gpsDot} />
            GPS
          </div>
        </div>

        {/* Map */}
        <section className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <div>
              <span className={styles.smallLabel}>LIVE LOCATION</span>
              <h2>NH65, Telangana</h2>
            </div>

            <div className={styles.navigationBadge}>
              {navigationActive ? "● Navigation Active" : "Navigation Paused"}
            </div>
          </div>

          <div className={styles.map}>
            {/* Map grid */}
            <div className={styles.mapGrid} />

            {/* Roads */}
            <div className={`${styles.road} ${styles.roadOne}`} />
            <div className={`${styles.road} ${styles.roadTwo}`} />
            <div className={`${styles.road} ${styles.roadThree}`} />

            {/* Route */}
            <svg
              className={styles.routeSvg}
              viewBox="0 0 600 330"
              preserveAspectRatio="none"
            >
              <path
                d="M45 275 C130 240, 125 155, 220 175 C315 195, 320 90, 410 110 C475 125, 505 80, 555 55"
                className={styles.routeShadow}
              />

              <path
                d="M45 275 C130 240, 125 155, 220 175 C315 195, 320 90, 410 110 C475 125, 505 80, 555 55"
                className={styles.routeLine}
              />
            </svg>

            {/* Start */}
            <div className={`${styles.mapPoint} ${styles.startPoint}`}>
              <span />
            </div>

            {/* Current */}
            <div
              className={styles.currentLocation}
              style={{
                left: `${Math.min(45 + progress * 0.35, 82)}%`,
                top: `${Math.max(64 - progress * 0.32, 25)}%`,
              }}
            >
              <div className={styles.currentPulse} />
              <div className={styles.vehicleMarker}>🚚</div>
            </div>

            {/* Destination */}
            <div className={`${styles.mapPoint} ${styles.destinationPoint}`}>
              <span>📍</span>
            </div>

            <div className={styles.mapLabelStart}>Farm A</div>
            <div className={styles.mapLabelCurrent}>You</div>
            <div className={styles.mapLabelDestination}>
              Aggregation Point
            </div>

            <div className={styles.mapControls}>
              <button
                type="button"
                onClick={() => setProgress((prev) => Math.min(prev + 5, 95))}
                aria-label="Zoom in"
              >
                +
              </button>

              <button
                type="button"
                onClick={() => setProgress((prev) => Math.max(prev - 5, 10))}
                aria-label="Zoom out"
              >
                −
              </button>
            </div>

            <div className={styles.demoBadge}>DEMO TELEMETRY</div>
          </div>
        </section>

        {/* Main trip information */}
        <div className={styles.infoGrid}>
          {/* Current location */}
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>📍</div>

            <div>
              <span>Current Location</span>
              <strong>NH65, Telangana</strong>
              <small>GPS signal available</small>
            </div>
          </div>

          {/* ETA */}
          <div className={styles.infoCard}>
            <div className={styles.iconBox}>⏱</div>

            <div>
              <span>Estimated Arrival</span>
              <strong>{etaText}</strong>
              <small>To next stop</small>
            </div>
          </div>
        </div>

        {/* Next stop */}
        <section className={styles.nextStopCard}>
          <div className={styles.stopIcon}>2</div>

          <div className={styles.stopContent}>
            <span className={styles.smallLabel}>NEXT STOP</span>

            <h2>Aggregation Point</h2>

            <p>
              Consolidate the farm loads before continuing to the Hyderabad
              buyer.
            </p>

            <div className={styles.stopMeta}>
              <span>🚚 Active Load</span>
              <span>🌾 Tomatoes</span>
              <span>800 kg</span>
            </div>
          </div>

          <div className={styles.stopArrow}>→</div>
        </section>

        {/* Route progress */}
        <section className={styles.routeProgressCard}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.smallLabel}>TRIP PROGRESS</span>
              <h2>Farm A → Aggregation Point</h2>
            </div>

            <strong>{progress}%</strong>
          </div>

          <div className={styles.progressBar}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.progressMeta}>
            <span>Farm A</span>
            <span>Aggregation Point</span>
          </div>
        </section>

        {/* Vehicle information */}
        {driver && (
          <section className={styles.vehicleCard}>
            <div>
              <span>VEHICLE</span>
              <strong>
                {driver.vehicle_type || "Transport Vehicle"}
              </strong>
            </div>

            <div>
              <span>REGISTRATION</span>
              <strong>{driver.vehicle_number || "—"}</strong>
            </div>

            <div>
              <span>STATUS</span>
              <strong className={styles.statusText}>On Trip</strong>
            </div>
          </section>
        )}

        {/* Actions */}
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.routeButton}
            onClick={() => router.push("/driver/route")}
          >
            <span>🗺️</span>
            View Route Details
          </button>

          <button
            type="button"
            className={styles.navigationButton}
            onClick={handleStartStopNavigation}
          >
            {navigationActive ? "⏸ Pause Navigation" : "▶ Resume Navigation"}
          </button>

          <button
            type="button"
            className={styles.deliveryButton}
            onClick={() => router.push("/driver/delivery")}
          >
            Continue to Delivery →
          </button>
        </div>

        {/* Safety note */}
        <div className={styles.safetyNote}>
          <span>🛡️</span>
          <p>
            Drive safely. Do not interact with the app while the vehicle is
            moving.
          </p>
        </div>
      </section>

      {/* Bottom navigation */}
      <nav className={styles.bottomNav}>
        <button onClick={() => router.push("/driver/dashboard")}>
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button
          className={styles.navActive}
          onClick={() => router.push("/driver/route")}
        >
          <span>⌁</span>
          <small>Route</small>
        </button>

        <button onClick={() => router.push("/driver/dashboard")}>
          <span>▣</span>
          <small>Loads</small>
        </button>

        <button onClick={() => router.push("/driver/earnings")}>
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