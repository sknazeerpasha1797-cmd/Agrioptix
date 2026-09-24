"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverSupport.module.css";

type Language = "English" | "हिंदी" | "తెలుగు";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "What should I do if I cannot reach the pickup location?",
    answer:
      "Open Route from the bottom navigation and check the assigned route. If the issue continues, contact the Operations Team for assistance.",
  },
  {
    question: "What happens if the pickup quantity is different?",
    answer:
      "Record the actual received quantity during Pickup Verification. AgriOptix compares the expected and received quantities before the pickup is confirmed.",
  },
  {
    question: "What if the delivery OTP does not work?",
    answer:
      "Do not repeatedly confirm the delivery. Contact Operations so the delivery details can be verified.",
  },
  {
    question: "How are my earnings calculated?",
    answer:
      "The prototype demonstrates Base Fare, Per Kg Bonus, Additional Stop and Fuel Allowance components. Production values can be connected to the settlement system.",
  },
  {
    question: "What if my vehicle breaks down?",
    answer:
      "Move to a safe location if possible and contact the Operations Team immediately. For emergencies, use the emergency assistance option.",
  },
];

export default function DriverSupportPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<any>(null);
  const [language, setLanguage] = useState<Language>("English");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);
  const [message, setMessage] = useState("");

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

  const driverName =
    driver?.full_name ||
    driver?.fullName ||
    driver?.name ||
    "Driver";

  const handleOperationsContact = () => {
    setMessage(
      "Operations Team contact is available in the production deployment."
    );
  };

  const handleEmergency = () => {
    setShowEmergency(false);
    setMessage(
      "Emergency assistance request initiated in demo mode. In production, this action can connect to the operations control room."
    );
  };

  if (!driver) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Loading support...</p>
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
            <div className={styles.brandSub}>
              Driver / Transporter Portal
            </div>
          </div>
        </div>

        <div className={styles.headerTitle}>
          <span>Support & Operations</span>
          <small>09 / 09</small>
        </div>

        <div className={styles.driverBadge}>
          <div className={styles.avatar}>
            {driverName.charAt(0).toUpperCase()}
          </div>

          <div className={styles.driverInfo}>
            <strong>{driverName}</strong>
            <span>Transport Partner</span>
          </div>
        </div>
      </header>

      <div className={styles.content}>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroIcon}>?</div>

          <div className={styles.heroText}>
            <span className={styles.eyebrow}>DRIVER SUPPORT</span>
            <h1>How can we help, {driverName.split(" ")[0]}?</h1>
            <p>
              Get help with routes, loads, pickup, delivery, payments and
              operational issues.
            </p>
          </div>

          <div className={styles.status}>
            <span className={styles.statusDot}></span>
            Operations Online
          </div>
        </section>

        {/* MESSAGE */}
        {message && (
          <div className={styles.message}>
            <span>✓</span>
            <p>{message}</p>

            <button onClick={() => setMessage("")}>×</button>
          </div>
        )}

        {/* QUICK HELP */}
        <section className={styles.section}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>QUICK HELP</span>
              <h2>What do you need?</h2>
            </div>
          </div>

          <div className={styles.quickGrid}>
            <button
              className={styles.quickCard}
              onClick={() => router.push("/driver/route")}
            >
              <div className={styles.quickIcon}>⌁</div>

              <div>
                <strong>Route Problem</strong>
                <span>Navigation or location issue</span>
              </div>

              <b>→</b>
            </button>

            <button
              className={styles.quickCard}
              onClick={() => router.push("/driver/loads")}
            >
              <div className={styles.quickIcon}>▣</div>

              <div>
                <strong>Load Issue</strong>
                <span>Pickup, load or assignment</span>
              </div>

              <b>→</b>
            </button>

            <button
              className={styles.quickCard}
              onClick={() => router.push("/driver/earnings")}
            >
              <div className={styles.quickIcon}>₹</div>

              <div>
                <strong>Payment & Earnings</strong>
                <span>Trip earnings and settlement</span>
              </div>

              <b>→</b>
            </button>

            <button
              className={styles.quickCard}
              onClick={() => setMessage("Vehicle assistance request opened.")}
            >
              <div className={styles.quickIcon}>▱</div>

              <div>
                <strong>Vehicle Issue</strong>
                <span>Breakdown or transport problem</span>
              </div>

              <b>→</b>
            </button>
          </div>
        </section>

        {/* OPERATIONS CONTACT */}
        <section className={styles.operationsCard}>
          <div className={styles.operationsLeft}>
            <div className={styles.operationsIcon}>☎</div>

            <div>
              <span className={styles.sectionLabel}>OPERATIONS TEAM</span>
              <h2>Need direct assistance?</h2>
              <p>
                Our operations team can help with assigned loads, route
                changes, pickup delays and delivery issues.
              </p>
            </div>
          </div>

          <div className={styles.operationsActions}>
            <div className={styles.contactInfo}>
              <span>Operations Desk</span>
              <strong>1800-123-4567</strong>
            </div>

            <button
              className={styles.primaryButton}
              onClick={handleOperationsContact}
            >
              Contact Operations
            </button>
          </div>
        </section>

        {/* EMERGENCY */}
        <section className={styles.emergencyCard}>
          <div className={styles.emergencyIcon}>!</div>

          <div className={styles.emergencyText}>
            <strong>Emergency Assistance</strong>
            <p>
              Use this only for urgent situations involving driver or road
              safety.
            </p>
          </div>

          <button
            className={styles.emergencyButton}
            onClick={() => setShowEmergency(true)}
          >
            Get Emergency Help
          </button>
        </section>

        {/* LANGUAGE */}
        <section className={styles.languageCard}>
          <div>
            <span className={styles.sectionLabel}>LANGUAGE</span>
            <h2>Choose your preferred language</h2>
            <p>Language preference for future voice and support features.</p>
          </div>

          <div className={styles.languageButtons}>
            {(["English", "हिंदी", "తెలుగు"] as Language[]).map(
              (item) => (
                <button
                  key={item}
                  className={
                    language === item
                      ? styles.languageActive
                      : styles.languageButton
                  }
                  onClick={() => setLanguage(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.sectionLabel}>HELP CENTER</span>
              <h2>Frequently Asked Questions</h2>
            </div>

            <span className={styles.faqCount}>
              {faqs.length} guides
            </span>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <div
                  key={faq.question}
                  className={`${styles.faqItem} ${
                    isOpen ? styles.faqOpen : ""
                  }`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() =>
                      setOpenFaq(isOpen ? null : index)
                    }
                  >
                    <span>{faq.question}</span>

                    <b>{isOpen ? "−" : "+"}</b>
                  </button>

                  {isOpen && (
                    <div className={styles.faqAnswer}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* PROTOTYPE NOTE */}
        <div className={styles.prototypeNote}>
          <div className={styles.prototypeIcon}>i</div>

          <div>
            <strong>AgriOptix Support — Prototype</strong>
            <p>
              Contact actions, emergency escalation and multilingual
              support are represented as demo interactions. They can be
              connected to the production operations system, calling
              service and voice-assistance layer.
            </p>
          </div>
        </div>
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

        <button onClick={() => router.push("/driver/earnings")}>
          <span>₹</span>
          Earnings
        </button>

        <button className={styles.activeNav}>
          <span>?</span>
          Support
        </button>
      </nav>

      {/* EMERGENCY MODAL */}
      {showEmergency && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowEmergency(false)}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.modalIcon}>!</div>

            <h2>Emergency Assistance?</h2>

            <p>
              This should only be used for urgent driver or road-safety
              situations.
            </p>

            <div className={styles.emergencyNumber}>
              <span>Operations Emergency</span>
              <strong>1800-123-4567</strong>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowEmergency(false)}
              >
                Cancel
              </button>

              <button
                className={styles.confirmEmergency}
                onClick={handleEmergency}
              >
                Request Assistance
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}