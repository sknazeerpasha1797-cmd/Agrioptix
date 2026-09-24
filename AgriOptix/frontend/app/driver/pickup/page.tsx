"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverPickup.module.css";

type Driver = {
  id: number;
  fullName: string;
};

export default function DriverPickup() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [confirmed, setConfirmed] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [quantity, setQuantity] = useState("798");

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const updatedOtp = [...otp];
    updatedOtp[index] = digit;
    setOtp(updatedOtp);

    if (digit && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirmPickup = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 5) {
      alert("Please enter the 5-digit farmer OTP.");
      return;
    }

    setIsConfirming(true);

    setTimeout(() => {
      setIsConfirming(false);
      setConfirmed(true);
    }, 900);
  };

  const receivedQuantity = Number(quantity) || 0;
  const expectedQuantity = 800;
  const difference = receivedQuantity - expectedQuantity;

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
          onClick={() => router.push("/driver/route")}
        >
          ←
        </button>

        <div className={styles.headerTitle}>
          <span>AGRIOPTIX</span>
          <h1>Pickup Verification</h1>
        </div>

        <div className={styles.stepBadge}>03 / 09</div>
      </header>

      <section className={styles.content}>
        {/* PROGRESS */}
        <div className={styles.progressWrapper}>
          <div className={styles.progressLabels}>
            <span>ROUTE</span>
            <span className={styles.activeLabel}>PICKUP</span>
            <span>TRANSIT</span>
            <span>DELIVERY</span>
          </div>

          <div className={styles.progressTrack}>
            <div className={styles.progressFill}></div>
          </div>
        </div>

        {/* ARRIVAL CARD */}
        <section className={styles.arrivalCard}>
          <div className={styles.arrivalIcon}>📍</div>

          <div>
            <span className={styles.eyebrow}>NEXT STOP</span>
            <h2>Farm A — Ranga Reddy</h2>
            <p>You have arrived at the scheduled pickup location.</p>
          </div>

          <span className={styles.arrivedBadge}>
            ● ARRIVED
          </span>
        </section>

        {/* PRODUCE */}
        <section className={styles.produceCard}>
          <div className={styles.produceHeader}>
            <div className={styles.cropVisual}>🍅</div>

            <div>
              <span className={styles.cardEyebrow}>
                PRODUCE DETAILS
              </span>

              <h2>Tomatoes</h2>

              <p>Farm A • Fresh produce shipment</p>
            </div>
          </div>

          <div className={styles.produceMeta}>
            <div>
              <span>FARMER</span>
              <strong>Farm A</strong>
            </div>

            <div>
              <span>EXPECTED</span>
              <strong>800 kg</strong>
            </div>

            <div>
              <span>DESTINATION</span>
              <strong>Hyderabad</strong>
            </div>
          </div>
        </section>

        {/* WEIGHT RECONCILIATION */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>WEIGHT RECONCILIATION</p>
              <h2>Verify Shipment Quantity</h2>
            </div>
          </div>

          <div className={styles.weightCard}>
            <div className={styles.weightRow}>
              <div>
                <span>EXPECTED QUANTITY</span>
                <strong>800 kg</strong>
              </div>

              <div className={styles.rowIcon}>◎</div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.receivedRow}>
              <div>
                <span>RECEIVED QUANTITY</span>

                <div className={styles.quantityInputWrapper}>
                  <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(event) =>
                      setQuantity(event.target.value)
                    }
                  />

                  <b>kg</b>
                </div>
              </div>

              <div className={styles.scaleIcon}>⚖</div>
            </div>

            <div
              className={`${styles.differenceBox} ${
                difference === 0
                  ? styles.noDifference
                  : styles.hasDifference
              }`}
            >
              <div>
                <span>WEIGHT DIFFERENCE</span>

                <strong>
                  {difference > 0 ? "+" : ""}
                  {difference} kg
                </strong>
              </div>

              <span className={styles.warningIcon}>
                {difference === 0 ? "✓" : "!"}
              </span>
            </div>
          </div>
        </section>

        {/* OTP */}
        <section className={styles.section}>
          <div className={styles.otpHeader}>
            <div>
              <p className={styles.eyebrow}>SECURE HANDOFF</p>
              <h2>Farmer Verification</h2>
            </div>

            <div className={styles.lockIcon}>🔐</div>
          </div>

          <div className={styles.otpCard}>
            <p>
              Ask the farmer for the 5-digit OTP shown on their
              AgriOptix account.
            </p>

            <div className={styles.otpInputs}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  value={digit}
                  maxLength={1}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) =>
                    handleOtpKeyDown(index, event)
                  }
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            <div className={styles.demoOtp}>
              <span>DEMO OTP</span>
              <strong>2 7 4 1 9</strong>
            </div>
          </div>
        </section>

        {/* VERIFICATION SUMMARY */}
        <section className={styles.summaryCard}>
          <div className={styles.summaryIcon}>✓</div>

          <div>
            <span>BEFORE CONFIRMING</span>
            <h3>Review pickup details</h3>

            <div className={styles.checkList}>
              <span>✓ Crop: Tomatoes</span>
              <span>✓ Expected: 800 kg</span>
              <span>✓ Received: {receivedQuantity} kg</span>

              <span>
                {difference === 0 ? "✓" : "⚠"} Difference:{" "}
                {difference} kg
              </span>
            </div>
          </div>
        </section>
      </section>

      {/* BOTTOM ACTION */}
      <div className={styles.bottomAction}>
        {!confirmed ? (
          <button
            className={styles.confirmButton}
            onClick={handleConfirmPickup}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <span className={styles.buttonLoader}></span>
                Verifying Pickup...
              </>
            ) : (
              <>
                Confirm Pickup
                <span>→</span>
              </>
            )}
          </button>
        ) : (
          <button
            className={styles.successButton}
            onClick={() => router.push("/driver/transit")}
          >
            <span>✓</span>
            Pickup Confirmed — Start Transit
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

        <button
          className={`${styles.navItem} ${styles.activeNav}`}
          onClick={() => router.push("/driver/route")}
        >
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