"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./order.module.css";

type Farmer = {
  name?: string;
  farm?: string;
  crop?: string;
  location?: string;
  distance?: number;
  quantity?: number;
  quality?: string;
  price?: number;
  delivery?: string;
  verified?: boolean;
  freshness?: string;
  rating?: number;
};

type TrackingStatus = {
  progress: number;
  location: string;
  eta: string;
};

const trackingPoints: TrackingStatus[] = [
  {
    progress: 22,
    location: "Green Field Organics",
    eta: "45 min",
  },
  {
    progress: 38,
    location: "Miyapur",
    eta: "38 min",
  },
  {
    progress: 54,
    location: "Kukatpally",
    eta: "30 min",
  },
  {
    progress: 69,
    location: "Mehdipatnam",
    eta: "22 min",
  },
  {
    progress: 82,
    location: "Tolichowki",
    eta: "14 min",
  },
  {
    progress: 93,
    location: "Near delivery location",
    eta: "5 min",
  },
];

export default function OrdersPage() {
  const router = useRouter();

  const [farmer, setFarmer] = useState<Farmer | null>(null);

  const [tracking, setTracking] = useState<TrackingStatus>(
    trackingPoints[3]
  );

  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  // Contact information popup
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    try {
      const savedFarmer = localStorage.getItem("selectedFarmer");

      if (savedFarmer) {
        setFarmer(JSON.parse(savedFarmer));
      }
    } catch (error) {
      console.error("Unable to load selected farmer:", error);
    }
  }, []);

  /*
   * Demo real-time tracking.
   * Driver location changes every 4 seconds.
   */
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setTracking((current) => {
        const currentIndex = trackingPoints.findIndex(
          (point) =>
            point.progress === current.progress &&
            point.location === current.location
        );

        const nextIndex =
          currentIndex >= trackingPoints.length - 1
            ? 0
            : currentIndex + 1;

        return trackingPoints[nextIndex];
      });

      setLastUpdated("Just now");
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Close contact panel with Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContactOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const progressWidth = useMemo(() => {
    return `${tracking.progress}%`;
  }, [tracking.progress]);

  const statusText =
    tracking.progress >= 90
      ? "Arriving soon"
      : tracking.progress >= 65
        ? "On the way"
        : "In transit";

  const farmerName = farmer?.name || "Ravi Kumar";
  const farmName = farmer?.farm || "Green Field Organics";
  const crop = farmer?.crop || "Tomato";
  const quantity = farmer?.quantity || 2000;
  const farmerLocation = farmer?.location || "Nalgonda";
  const quality = farmer?.quality || "Grade A";
  const price = farmer?.price || 29;

  const handleRefresh = () => {
    setLastUpdated("Updated just now");

    setTracking((current) => {
      const currentIndex = trackingPoints.findIndex(
        (point) =>
          point.progress === current.progress &&
          point.location === current.location
      );

      const nextIndex =
        currentIndex >= trackingPoints.length - 1
          ? 0
          : currentIndex + 1;

      return trackingPoints[nextIndex];
    });
  };

  const handleBack = () => {
    router.push("/buyer/supply");
  };

  const handleCallDriver = () => {
    window.location.href = "tel:+919876543210";
  };

  const handleContactInfo = () => {
    setContactOpen((current) => !current);
  };

  // NEW: Open Delivery Inspection
  const handleDeliveryInspection = () => {
    router.push("/buyer/delivery-inspection");
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>

        {/* HEADER */}
        <header className={styles.header}>
          <div>
            <button
              className={styles.backButton}
              onClick={handleBack}
              type="button"
            >
              ← Back
            </button>

            <div className={styles.titleRow}>
              <div>
                <p className={styles.eyebrow}>
                  ORDER TRACKING
                </p>

                <h1>Track your delivery</h1>

                <p className={styles.subtitle}>
                  Follow your produce from farm to your delivery location.
                </p>
              </div>

              <div className={styles.liveBadge}>
                <span className={styles.liveDot}></span>
                LIVE
              </div>
            </div>
          </div>
        </header>

        {/* MAIN TRACKING CARD */}
        <section className={styles.trackingCard}>

          <div className={styles.cardTop}>
            <div>
              <p className={styles.smallLabel}>
                CURRENT DELIVERY
              </p>

              <h2>{statusText}</h2>

              <p className={styles.currentLocation}>
                Driver is currently near{" "}
                <strong>{tracking.location}</strong>
              </p>
            </div>

            <button
              className={styles.refreshButton}
              onClick={handleRefresh}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>

          {/* ROUTE */}
          <div className={styles.routeArea}>

            <div className={styles.routeLabels}>

              <div className={styles.routePoint}>
                <span className={styles.locationIcon}>
                  🌾
                </span>

                <div>
                  <span>FROM</span>
                  <strong>{farmName}</strong>
                </div>
              </div>

              <div className={styles.routePoint}>
                <span className={styles.locationIcon}>
                  📍
                </span>

                <div>
                  <span>TO</span>
                  <strong>Your delivery</strong>
                </div>
              </div>

            </div>

            <div className={styles.routeLineWrapper}>

              <div
                className={styles.routeLineBackground}
              ></div>

              <div
                className={styles.routeLineActive}
                style={{ width: progressWidth }}
              ></div>

              <div className={styles.startMarker}>
                <span>🌾</span>
              </div>

              <div
                className={styles.driverMarker}
                style={{ left: progressWidth }}
              >
                🚚
              </div>

              <div className={styles.destinationMarker}>
                <span>📍</span>
              </div>

            </div>

            <div className={styles.routeStatus}>
              <span>Driver started</span>

              <strong>
                {tracking.progress}% completed
              </strong>

              <span>Delivery destination</span>
            </div>

          </div>

          {/* ETA */}
          <div className={styles.etaSection}>

            <div className={styles.etaItem}>

              <span className={styles.etaIcon}>
                ⏱
              </span>

              <div>
                <span>Estimated arrival</span>
                <strong>{tracking.eta}</strong>
              </div>

            </div>

            <div className={styles.etaDivider}></div>

            <div className={styles.etaItem}>

              <span className={styles.etaIcon}>
                📍
              </span>

              <div>
                <span>Current location</span>
                <strong>{tracking.location}</strong>
              </div>

            </div>

          </div>

        </section>

        {/* DRIVER CARD */}
        <section className={styles.driverCard}>

          <div className={styles.driverLeft}>

            <div className={styles.driverAvatar}>
              RK
            </div>

            <div className={styles.driverMainInfo}>

              <p className={styles.smallLabel}>
                YOUR DRIVER
              </p>

              <h3>Rajesh Kumar</h3>

              <div className={styles.driverStatus}>
                <span></span>
                {statusText}
              </div>

            </div>

          </div>

          {/* CONTACT INFO BUTTON */}
          <button
            className={styles.contactButton}
            onClick={handleContactInfo}
            type="button"
            aria-expanded={contactOpen}
          >
            <span className={styles.contactIcon}>
              ☎
            </span>

            <span>
              Contact Info
            </span>

            <span
              className={`${styles.contactArrow} ${
                contactOpen ? styles.contactArrowOpen : ""
              }`}
            >
              ▾
            </span>
          </button>

        </section>

        {/* DRIVER CONTACT PANEL */}
        {contactOpen && (
          <section className={styles.contactPanel}>

            <div className={styles.contactHeader}>

              <div>
                <p className={styles.smallLabel}>
                  DRIVER CONTACT
                </p>

                <h3>Rajesh Kumar</h3>

                <p>
                  Driver assigned to your current delivery.
                </p>
              </div>

              <button
                className={styles.closeContact}
                onClick={() => setContactOpen(false)}
                type="button"
                aria-label="Close contact information"
              >
                ×
              </button>

            </div>

            <div className={styles.contactContent}>

              <div className={styles.contactAvatar}>
                RK
              </div>

              <div className={styles.contactDetails}>

                <div className={styles.contactDetail}>
                  <span>Driver ID</span>
                  <strong>DRV-1048</strong>
                </div>

                <div className={styles.contactDetail}>
                  <span>Mobile Number</span>
                  <strong>+91 98765 43210</strong>
                </div>

                <div className={styles.contactDetail}>
                  <span>Vehicle</span>
                  <strong>Truck</strong>
                </div>

                <div className={styles.contactDetail}>
                  <span>Vehicle Number</span>
                  <strong>TS 09 AB 4821</strong>
                </div>

                <div className={styles.contactDetail}>
                  <span>Driver Rating</span>
                  <strong className={styles.ratingValue}>
                    ★ 4.8
                  </strong>
                </div>

                <div className={styles.contactDetail}>
                  <span>Current Status</span>
                  <strong className={styles.statusValue}>
                    ● {statusText}
                  </strong>
                </div>

              </div>

              <button
                className={styles.callDriverButton}
                onClick={handleCallDriver}
                type="button"
              >
                <span>☎</span>
                Call Driver
              </button>

            </div>

          </section>
        )}

        {/* BOTTOM CARDS */}
        <div className={styles.bottomGrid}>

          {/* ORDER DETAILS */}
          <section className={styles.infoCard}>

            <div className={styles.infoHeader}>

              <div>
                <p className={styles.smallLabel}>
                  ORDER
                </p>

                <h3>Order details</h3>
              </div>

              <span className={styles.orderStatus}>
                In Transit
              </span>

            </div>

            <div className={styles.detailsGrid}>

              <div>
                <span>Produce</span>
                <strong>{crop}</strong>
              </div>

              <div>
                <span>Quantity</span>
                <strong>
                  {quantity.toLocaleString()} kg
                </strong>
              </div>

              <div>
                <span>Quality</span>
                <strong>{quality}</strong>
              </div>

              <div>
                <span>Price</span>
                <strong>₹{price}/kg</strong>
              </div>

            </div>

          </section>

          {/* FARMER */}
          <section className={styles.infoCard}>

            <div className={styles.infoHeader}>

              <div>
                <p className={styles.smallLabel}>
                  SUPPLIER
                </p>

                <h3>Farmer details</h3>
              </div>

              {farmer?.verified !== false && (
                <span className={styles.verified}>
                  ✓ Verified
                </span>
              )}

            </div>

            <div className={styles.farmerDetails}>

              <div className={styles.farmerAvatar}>
                {farmerName
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>

              <div>
                <strong>{farmerName}</strong>
                <span>{farmName}</span>
                <span>{farmerLocation}</span>
              </div>

            </div>

          </section>

        </div>

        {/* DELIVERY INSPECTION ACTION */}
        <section
          style={{
            marginTop: "24px",
            padding: "24px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #eef9ff 0%, #ffffff 100%)",
            border: "1px solid #d7eaf5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "1px",
                color: "#168acb",
              }}
            >
              DELIVERY ARRIVED?
            </p>

            <h3
              style={{
                margin: "7px 0 5px",
                fontSize: "20px",
                color: "#16324f",
              }}
            >
              Inspect your produce before payment
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "#667788",
              }}
            >
              Verify quantity, quality and freshness before confirming the delivery.
            </p>
          </div>

          <button
            onClick={handleDeliveryInspection}
            type="button"
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "14px 22px",
              background: "#079bd3",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 20px rgba(7, 155, 211, 0.20)",
              whiteSpace: "nowrap",
            }}
          >
            Proceed to Delivery Inspection →
          </button>
        </section>

        {/* LIVE UPDATE */}
        <div className={styles.updateBar}>

          <div className={styles.updateLeft}>
            <span className={styles.updateDot}></span>

            <span>
              Live tracking is active
            </span>
          </div>

          <span className={styles.updatedText}>
            {lastUpdated}
          </span>

        </div>

      </div>
    </main>
  );
}