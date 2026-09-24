"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverLoads.module.css";

type Driver = {
  full_name?: string;
  vehicle_number?: string;
};

type LoadStatus = "In Transit" | "Pickup Pending" | "Scheduled";

type Load = {
  id: number;
  loadNumber: string;
  crop: string;
  quantity: number;
  destination: string;
  pickup: string;
  status: LoadStatus;
  eta: string;
  distance: string;
  priority: "HIGH" | "MEDIUM" | "NORMAL";
  pickupTime: string;
  deliveryTime: string;
};

const loads: Load[] = [
  {
    id: 1,
    loadNumber: "AO-LOAD-001",
    crop: "Tomatoes",
    quantity: 1550,
    destination: "Hyderabad",
    pickup: "Ranga Reddy Farm",
    status: "In Transit",
    eta: "2h 15m",
    distance: "85 km",
    priority: "HIGH",
    pickupTime: "08:30 AM",
    deliveryTime: "06:30 PM",
  },
  {
    id: 2,
    loadNumber: "AO-LOAD-002",
    crop: "Onions",
    quantity: 980,
    destination: "Warangal",
    pickup: "Medak Farm Cluster",
    status: "Pickup Pending",
    eta: "5h 30m",
    distance: "142 km",
    priority: "MEDIUM",
    pickupTime: "10:00 AM",
    deliveryTime: "07:30 PM",
  },
  {
    id: 3,
    loadNumber: "AO-LOAD-003",
    crop: "Chillies",
    quantity: 1200,
    destination: "Vijayawada",
    pickup: "Guntur Farm Cluster",
    status: "Scheduled",
    eta: "6h 45m",
    distance: "275 km",
    priority: "NORMAL",
    pickupTime: "12:30 PM",
    deliveryTime: "09:15 PM",
  },
];

const filters = ["All", "In Transit", "Pickup Pending", "Scheduled"];

export default function DriverLoadsPage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);

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

  const filteredLoads = useMemo(() => {
    if (activeFilter === "All") {
      return loads;
    }

    return loads.filter((load) => load.status === activeFilter);
  }, [activeFilter]);

  const inTransitCount = loads.filter(
    (load) => load.status === "In Transit"
  ).length;

  const pendingCount = loads.filter(
    (load) => load.status === "Pickup Pending"
  ).length;

  const scheduledCount = loads.filter(
    (load) => load.status === "Scheduled"
  ).length;

  const openLoad = (load: Load) => {
    setSelectedLoad(load);
  };

  const continueLoad = (load: Load) => {
    if (load.status === "In Transit") {
      router.push("/driver/transit");
      return;
    }

    if (load.status === "Pickup Pending") {
      router.push("/driver/pickup");
      return;
    }

    router.push("/driver/route");
  };

  return (
    <main className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <div className={styles.brand}>AgriOptix</div>
          <div className={styles.moduleTitle}>Active Loads</div>
        </div>

        <div className={styles.headerRight}>
          <span>07 / 09</span>

          <div className={styles.avatar}>
            {(driver?.full_name || "D").charAt(0).toUpperCase()}
          </div>
        </div>
      </header>

      <section className={styles.content}>
        {/* Heading */}
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>TRANSPORT OPERATIONS</p>
            <h1>Active Loads</h1>
            <p>
              Track your assigned produce loads and upcoming pickups.
            </p>
          </div>

          <div className={styles.loadCount}>
            <strong>{loads.length}</strong>
            <span>Active Loads</span>
          </div>
        </div>

        {/* Summary */}
        <section className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>🚚</div>

            <div>
              <span>In Transit</span>
              <strong>{inTransitCount}</strong>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>📦</div>

            <div>
              <span>Pickup Pending</span>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>🗓️</div>

            <div>
              <span>Scheduled</span>
              <strong>{scheduledCount}</strong>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className={styles.filters}>
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={
                activeFilter === filter ? styles.filterActive : ""
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Load list */}
        <section className={styles.loadList}>
          {filteredLoads.map((load) => (
            <article
              key={load.id}
              className={`${styles.loadCard} ${
                load.status === "In Transit"
                  ? styles.activeLoad
                  : ""
              }`}
            >
              {/* Card header */}
              <div className={styles.cardHeader}>
                <div className={styles.loadIdentity}>
                  <div className={styles.cropIcon}>
                    {load.crop === "Tomatoes"
                      ? "🍅"
                      : load.crop === "Onions"
                      ? "🧅"
                      : "🌶️"}
                  </div>

                  <div>
                    <span className={styles.loadNumber}>
                      {load.loadNumber}
                    </span>

                    <h2>{load.crop}</h2>
                  </div>
                </div>

                <div
                  className={`${styles.statusBadge} ${
                    load.status === "In Transit"
                      ? styles.transit
                      : load.status === "Pickup Pending"
                      ? styles.pending
                      : styles.scheduled
                  }`}
                >
                  <span />
                  {load.status}
                </div>
              </div>

              {/* Load details */}
              <div className={styles.mainDetails}>
                <div className={styles.quantity}>
                  <span>LOAD QUANTITY</span>
                  <strong>
                    {load.quantity.toLocaleString("en-IN")} kg
                  </strong>
                </div>

                <div>
                  <span>DESTINATION</span>
                  <strong>{load.destination}</strong>
                </div>

                <div>
                  <span>ETA</span>
                  <strong>{load.eta}</strong>
                </div>
              </div>

              {/* Route */}
              <div className={styles.route}>
                <div className={styles.routePoint}>
                  <span className={styles.greenDot} />

                  <div>
                    <small>PICKUP</small>
                    <strong>{load.pickup}</strong>
                    <em>{load.pickupTime}</em>
                  </div>
                </div>

                <div className={styles.routeConnector} />

                <div className={styles.routePoint}>
                  <span className={styles.orangeDot} />

                  <div>
                    <small>DELIVERY</small>
                    <strong>{load.destination}</strong>
                    <em>{load.deliveryTime}</em>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <div className={styles.metadata}>
                  <span>📍 {load.distance}</span>

                  <span>
                    Priority:
                    <b
                      className={
                        load.priority === "HIGH"
                          ? styles.high
                          : load.priority === "MEDIUM"
                          ? styles.medium
                          : styles.normal
                      }
                    >
                      {load.priority}
                    </b>
                  </span>
                </div>

                <button
                  type="button"
                  className={styles.viewButton}
                  onClick={() => openLoad(load)}
                >
                  View Load
                </button>
              </div>
            </article>
          ))}

          {filteredLoads.length === 0 && (
            <div className={styles.emptyState}>
              <div>📦</div>
              <h2>No loads found</h2>
              <p>There are no loads matching this status.</p>
            </div>
          )}
        </section>

        {/* Load detail drawer */}
        {selectedLoad && (
          <div
            className={styles.overlay}
            onClick={() => setSelectedLoad(null)}
          >
            <section
              className={styles.detailPanel}
              onClick={(event) => event.stopPropagation()}
            >
              <div className={styles.detailHandle} />

              <div className={styles.detailHeader}>
                <div>
                  <span className={styles.eyebrow}>LOAD DETAILS</span>
                  <h2>{selectedLoad.loadNumber}</h2>
                </div>

                <button
                  type="button"
                  className={styles.closeButton}
                  onClick={() => setSelectedLoad(null)}
                >
                  ×
                </button>
              </div>

              <div className={styles.detailCrop}>
                <div className={styles.largeCropIcon}>
                  {selectedLoad.crop === "Tomatoes"
                    ? "🍅"
                    : selectedLoad.crop === "Onions"
                    ? "🧅"
                    : "🌶️"}
                </div>

                <div>
                  <span>PRODUCE</span>
                  <strong>{selectedLoad.crop}</strong>
                </div>

                <div
                  className={`${styles.statusBadge} ${
                    selectedLoad.status === "In Transit"
                      ? styles.transit
                      : selectedLoad.status === "Pickup Pending"
                      ? styles.pending
                      : styles.scheduled
                  }`}
                >
                  {selectedLoad.status}
                </div>
              </div>

              <div className={styles.detailGrid}>
                <div>
                  <span>Quantity</span>
                  <strong>
                    {selectedLoad.quantity.toLocaleString("en-IN")} kg
                  </strong>
                </div>

                <div>
                  <span>Distance</span>
                  <strong>{selectedLoad.distance}</strong>
                </div>

                <div>
                  <span>ETA</span>
                  <strong>{selectedLoad.eta}</strong>
                </div>

                <div>
                  <span>Priority</span>
                  <strong>{selectedLoad.priority}</strong>
                </div>
              </div>

              <div className={styles.detailRoute}>
                <div>
                  <small>FROM</small>
                  <strong>{selectedLoad.pickup}</strong>
                </div>

                <span>→</span>

                <div>
                  <small>TO</small>
                  <strong>{selectedLoad.destination}</strong>
                </div>
              </div>

              <button
                type="button"
                className={styles.continueButton}
                onClick={() => continueLoad(selectedLoad)}
              >
                {selectedLoad.status === "In Transit"
                  ? "Continue Trip →"
                  : selectedLoad.status === "Pickup Pending"
                  ? "Start Pickup →"
                  : "View Route →"}
              </button>
            </section>
          </div>
        )}
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

        <button className={styles.navActive}>
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