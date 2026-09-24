"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverRoute.module.css";

type Driver = {
  id: number;
  fullName: string;
  mobileNumber: string;
  vehicleType?: string;
  vehicleNumber?: string;
};

type Stop = {
  id: number;
  number: string;
  type: "pickup" | "aggregation" | "delivery";
  title: string;
  subtitle: string;
  time: string;
  distance: string;
  crop?: string;
  quantity?: string;
  status: "next" | "upcoming" | "destination";
};

const routeStops: Stop[] = [
  {
    id: 1,
    number: "01",
    type: "pickup",
    title: "Farm A",
    subtitle: "Pickup • Ranga Reddy",
    time: "08:30 AM",
    distance: "12 km",
    crop: "Tomatoes",
    quantity: "800 kg",
    status: "next",
  },
  {
    id: 2,
    number: "02",
    type: "pickup",
    title: "Farm B",
    subtitle: "Pickup • Telangana",
    time: "10:00 AM",
    distance: "18 km",
    crop: "Tomatoes",
    quantity: "750 kg",
    status: "upcoming",
  },
  {
    id: 3,
    number: "03",
    type: "aggregation",
    title: "Aggregation Point",
    subtitle: "Consolidation • Hyderabad",
    time: "11:30 AM",
    distance: "25 km",
    status: "upcoming",
  },
  {
    id: 4,
    number: "04",
    type: "delivery",
    title: "Buyer — Hyderabad",
    subtitle: "Final Delivery • Hyderabad",
    time: "06:30 PM",
    distance: "85 km",
    status: "destination",
  },
];

export default function DriverRoute() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [routeStarted, setRouteStarted] = useState(false);

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

  const startNavigation = () => {
    setIsStarting(true);

    setTimeout(() => {
      setIsStarting(false);
      setRouteStarted(true);
    }, 900);
  };

  const goToPickup = () => {
    router.push("/driver/pickup");
  };

  if (!driver) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/driver/dashboard")}
          aria-label="Back to dashboard"
        >
          ←
        </button>

        <div className={styles.headerTitle}>
          <span>AGRIOPTIX</span>
          <h1>Today&apos;s Route</h1>
        </div>

        <button
          className={styles.helpButton}
          onClick={() => router.push("/driver/profile")}
          aria-label="Help"
        >
          ?
        </button>
      </header>

      <section className={styles.content}>
        {/* ROUTE SUMMARY */}
        <section className={styles.routeSummary}>
          <div>
            <p className={styles.eyebrow}>OPTIMIZED EXECUTION PLAN</p>

            <h2>Hyderabad Supply Route</h2>

            <p className={styles.summaryText}>
              AgriOptix has organized your pickups, aggregation and
              final delivery into one optimized trip.
            </p>
          </div>

          <div className={styles.summaryStats}>
            <div>
              <strong>4</strong>
              <span>Stops</span>
            </div>

            <div>
              <strong>140</strong>
              <span>Total km</span>
            </div>

            <div>
              <strong>08:30</strong>
              <span>Start</span>
            </div>
          </div>
        </section>

        {/* MAP */}
        <section className={styles.mapCard}>
          <div className={styles.mapHeader}>
            <div>
              <span>LIVE ROUTE PREVIEW</span>
              <h2>Optimized Farm → Market Path</h2>
            </div>

            <div className={styles.optimizedBadge}>
              <span>✓</span>
              Optimized
            </div>
          </div>

          <div className={styles.map}>
            {/* Decorative map background */}
            <div className={styles.mapGrid}></div>

            <div className={styles.roadOne}></div>
            <div className={styles.roadTwo}></div>
            <div className={styles.roadThree}></div>

            {/* Route line */}
            <div className={styles.routePath}></div>

            {/* Stop 1 */}
            <div className={`${styles.mapStop} ${styles.stopOne}`}>
              <span className={styles.stopMarkerGreen}>1</span>
              <div className={styles.mapLabel}>
                <strong>Farm A</strong>
                <small>12 km</small>
              </div>
            </div>

            {/* Stop 2 */}
            <div className={`${styles.mapStop} ${styles.stopTwo}`}>
              <span className={styles.stopMarkerGreen}>2</span>
              <div className={styles.mapLabel}>
                <strong>Farm B</strong>
                <small>18 km</small>
              </div>
            </div>

            {/* Stop 3 */}
            <div className={`${styles.mapStop} ${styles.stopThree}`}>
              <span className={styles.stopMarkerAmber}>3</span>
              <div className={styles.mapLabel}>
                <strong>Aggregation</strong>
                <small>25 km</small>
              </div>
            </div>

            {/* Stop 4 */}
            <div className={`${styles.mapStop} ${styles.stopFour}`}>
              <span className={styles.stopMarkerBlue}>4</span>
              <div className={styles.mapLabel}>
                <strong>Hyderabad Buyer</strong>
                <small>85 km</small>
              </div>
            </div>

            <div className={styles.currentVehicle}>
              🚚
            </div>

            <div className={styles.mapLocation}>
              📍 Telangana
            </div>
          </div>

          <div className={styles.mapLegend}>
            <span>
              <i className={styles.greenLegend}></i>
              Pickup
            </span>

            <span>
              <i className={styles.amberLegend}></i>
              Aggregation
            </span>

            <span>
              <i className={styles.blueLegend}></i>
              Buyer
            </span>
          </div>
        </section>

        {/* ROUTE TIMELINE */}
        <section className={styles.stopsSection}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>SEQUENTIAL STOPS</p>
              <h2>Your Route</h2>
            </div>

            <span className={styles.stopCount}>4 Stops</span>
          </div>

          <div className={styles.timeline}>
            {routeStops.map((stop, index) => (
              <div className={styles.timelineItem} key={stop.id}>
                <div className={styles.timelineRail}>
                  <div
                    className={`${styles.timelineNumber} ${
                      stop.status === "next"
                        ? styles.timelineNumberActive
                        : stop.status === "destination"
                        ? styles.timelineNumberDestination
                        : ""
                    }`}
                  >
                    {stop.number}
                  </div>

                  {index < routeStops.length - 1 && (
                    <div className={styles.timelineLine}></div>
                  )}
                </div>

                <article
                  className={`${styles.stopCard} ${
                    stop.status === "next"
                      ? styles.nextStopCard
                      : ""
                  }`}
                >
                  <div className={styles.stopCardTop}>
                    <div>
                      <div className={styles.stopType}>
                        {stop.type === "pickup" && "PICKUP"}
                        {stop.type === "aggregation" &&
                          "CONSOLIDATION"}
                        {stop.type === "delivery" && "DELIVERY"}
                      </div>

                      <h3>{stop.title}</h3>

                      <p>{stop.subtitle}</p>
                    </div>

                    {stop.status === "next" && (
                      <span className={styles.nextBadge}>
                        NEXT STOP
                      </span>
                    )}
                  </div>

                  <div className={styles.stopDetails}>
                    <div>
                      <span>TIME</span>
                      <strong>🕐 {stop.time}</strong>
                    </div>

                    <div>
                      <span>DISTANCE</span>
                      <strong>📍 {stop.distance}</strong>
                    </div>

                    {stop.crop && (
                      <div>
                        <span>CROP</span>
                        <strong>🍅 {stop.crop}</strong>
                      </div>
                    )}

                    {stop.quantity && (
                      <div>
                        <span>LOAD</span>
                        <strong>{stop.quantity}</strong>
                      </div>
                    )}
                  </div>

                  {stop.status === "next" && (
                    <button
                      className={styles.stopAction}
                      onClick={goToPickup}
                    >
                      View Pickup Verification
                      <span>→</span>
                    </button>
                  )}
                </article>
              </div>
            ))}
          </div>
        </section>

        {/* OPTIMIZATION EXPLANATION */}
        <section className={styles.intelligenceCard}>
          <div className={styles.intelligenceIcon}>✦</div>

          <div>
            <span>AGRIOPTIX INTELLIGENCE</span>

            <h2>Why this route?</h2>

            <p>
              The route is designed around pickup timing, vehicle
              capacity, aggregation, distance and the final buyer
              delivery window — helping fresh produce move with
              less unnecessary travel and delay.
            </p>

            <div className={styles.intelligencePoints}>
              <span>✓ Multi-farm aggregation</span>
              <span>✓ Delivery window aligned</span>
              <span>✓ Reduced unnecessary travel</span>
            </div>
          </div>
        </section>
      </section>

      {/* BOTTOM ACTION */}
      <div className={styles.bottomAction}>
        {!routeStarted ? (
          <button
            className={styles.startButton}
            onClick={startNavigation}
            disabled={isStarting}
          >
            {isStarting ? (
              <>
                <span className={styles.buttonLoader}></span>
                Starting Navigation...
              </>
            ) : (
              <>
                Start Navigation
                <span>→</span>
              </>
            )}
          </button>
        ) : (
          <button
            className={styles.navigationStartedButton}
            onClick={goToPickup}
          >
            <span>✓</span>
            Navigation Started — Continue to Pickup
            <span>→</span>
          </button>
        )}
      </div>

      {/* BOTTOM NAV */}
      <nav className={styles.bottomNav}>
        <button
          className={styles.navItem}
          onClick={() => router.push("/driver/dashboard")}
        >
          <span>⌂</span>
          <small>Home</small>
        </button>

        <button className={`${styles.navItem} ${styles.activeNav}`}>
          <span>⌁</span>
          <small>Route</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => router.push("/driver/loads")}
        >
          <span>▣</span>
          <small>Loads</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => router.push("/driver/earnings")}
        >
          <span>₹</span>
          <small>Earnings</small>
        </button>

        <button
          className={styles.navItem}
          onClick={() => router.push("/driver/profile")}
        >
          <span>♙</span>
          <small>Profile</small>
        </button>
      </nav>
    </main>
  );
}