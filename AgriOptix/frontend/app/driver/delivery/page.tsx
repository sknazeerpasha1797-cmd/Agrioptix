"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverDelivery.module.css";

type Driver = {
  full_name?: string;
  vehicle_number?: string;
};

export default function DriverDeliveryPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [receivedQuantity, setReceivedQuantity] = useState("1548");
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const expectedQuantity = 1550;
  const received = Number(receivedQuantity) || 0;
  const difference = received - expectedQuantity;

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

  const confirmDelivery = () => {
    if (received <= 0) return;

    setIsConfirming(true);

    setTimeout(() => {
      setIsConfirming(false);
      setConfirmed(true);
    }, 900);
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>AgriOptix</div>
          <div className={styles.moduleTitle}>Delivery & Verification</div>
        </div>

        <div className={styles.headerRight}>
          <span>05 / 09</span>

          <div className={styles.avatar}>
            {(driver?.full_name || "D").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className={styles.progressContainer}>
        <div className={styles.progressLabels}>
          <span className={styles.completed}>Route</span>
          <span className={styles.completed}>Pickup</span>
          <span className={styles.completed}>Transit</span>
          <span className={styles.active}>Delivery</span>
        </div>

        <div className={styles.progressTrack}>
          <div className={styles.progressFill} />
        </div>
      </div>

      <section className={styles.content}>
        {/* Heading */}
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>FINAL VERIFICATION</p>
            <h1>Delivery Verification</h1>
            <p>
              Verify the quantity, quality and freshness before completing the
              delivery.
            </p>
          </div>

          <div className={styles.arrivedBadge}>
            <span />
            ARRIVED
          </div>
        </div>

        {/* Destination */}
        <section className={styles.destinationCard}>
          <div className={styles.destinationIcon}>📍</div>

          <div>
            <span className={styles.label}>DELIVERY DESTINATION</span>
            <h2>Hyderabad Buyer</h2>
            <p>Hyderabad, Telangana</p>
          </div>

          <div className={styles.time}>
            <span>ARRIVED</span>
            <strong>06:28 PM</strong>
          </div>
        </section>

        {/* Produce */}
        <section className={styles.produceCard}>
          <div className={styles.produceHeader}>
            <div>
              <span className={styles.label}>LOAD</span>
              <h2>Tomatoes</h2>
            </div>

            <div className={styles.gradeBadge}>GRADE A</div>
          </div>

          <div className={styles.loadDetails}>
            <div>
              <span>Origin</span>
              <strong>Farm A</strong>
            </div>

            <div>
              <span>Vehicle</span>
              <strong>{driver?.vehicle_number || "—"}</strong>
            </div>

            <div>
              <span>Load</span>
              <strong>Tomatoes</strong>
            </div>
          </div>
        </section>

        {/* Quantity */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <div className={styles.number}>01</div>

            <div>
              <span>QUANTITY VERIFICATION</span>
              <h2>Confirm delivered quantity</h2>
            </div>
          </div>

          <div className={styles.quantityGrid}>
            <div className={styles.quantityBox}>
              <span>Expected</span>
              <strong>{expectedQuantity.toLocaleString()} kg</strong>
            </div>

            <div className={styles.quantityBox}>
              <span>Received</span>

              <div className={styles.inputWrapper}>
                <input
                  type="number"
                  min="0"
                  value={receivedQuantity}
                  onChange={(e) => setReceivedQuantity(e.target.value)}
                  disabled={confirmed}
                />

                <b>kg</b>
              </div>
            </div>

            <div
              className={`${styles.quantityBox} ${
                difference === 0
                  ? styles.match
                  : difference < 0
                  ? styles.loss
                  : styles.extra
              }`}
            >
              <span>Difference</span>

              <strong>
                {difference > 0 ? "+" : ""}
                {difference} kg
              </strong>
            </div>
          </div>

          <div className={styles.quantityNote}>
            {difference === 0 ? (
              <>
                <span>✓</span>
                Quantity matches the expected delivery.
              </>
            ) : (
              <>
                <span>!</span>
                Quantity difference detected. Please verify the received
                weight.
              </>
            )}
          </div>
        </section>

        {/* Quality */}
        <section className={styles.sectionCard}>
          <div className={styles.sectionTitle}>
            <div className={styles.number}>02</div>

            <div>
              <span>QUALITY VERIFICATION</span>
              <h2>Produce quality assessment</h2>
            </div>
          </div>

          <div className={styles.qualityGrid}>
            <div className={styles.qualityItem}>
              <div className={styles.check}>✓</div>

              <div>
                <strong>Quantity Verified</strong>
                <span>Weight checked at delivery</span>
              </div>
            </div>

            <div className={styles.qualityItem}>
              <div className={styles.check}>✓</div>

              <div>
                <strong>Quality Verified</strong>
                <span>Produce condition accepted</span>
              </div>
            </div>

            <div className={styles.qualityItem}>
              <div className={styles.check}>✓</div>

              <div>
                <strong>Freshness Verified</strong>
                <span>Freshness within expected range</span>
              </div>
            </div>
          </div>
        </section>

        {/* Grade */}
        <section className={styles.gradeCard}>
          <div className={styles.gradeIcon}>★</div>

          <div className={styles.gradeContent}>
            <span className={styles.label}>DELIVERY GRADE</span>
            <h2>Grade A</h2>
            <p>Freshness and quality requirements satisfied.</p>
          </div>

          <div className={styles.gradeScore}>A</div>
        </section>

        {/* Confirmation */}
        {!confirmed ? (
          <section className={styles.confirmCard}>
            <div>
              <span className={styles.label}>READY TO COMPLETE?</span>

              <h2>Confirm Delivery</h2>

              <p>
                Once confirmed, this delivery can move to settlement and
                earnings calculation.
              </p>
            </div>

            <button
              type="button"
              onClick={confirmDelivery}
              disabled={isConfirming || received <= 0}
              className={styles.confirmButton}
            >
              {isConfirming ? "Confirming..." : "✓ Confirm Delivery"}
            </button>
          </section>
        ) : (
          <section className={styles.successCard}>
            <div className={styles.successIcon}>✓</div>

            <div>
              <span>DELIVERY COMPLETED</span>
              <h2>Delivery Successfully Confirmed</h2>

              <p>
                1,548 kg of Grade A tomatoes delivered at 06:28 PM.
              </p>
            </div>

            <button
              type="button"
              className={styles.earningsButton}
              onClick={() => router.push("/driver/earnings")}
            >
              View Earnings →
            </button>
          </section>
        )}

        {/* Demo information */}
        <div className={styles.demoNote}>
          <span>DEMO FLOW</span>
          <p>
            Delivery verification is currently simulated for the AgriOptix
            prototype. Production settlement can connect this step to the
            backend transaction system.
          </p>
        </div>
      </section>

      {/* Bottom navigation */}
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