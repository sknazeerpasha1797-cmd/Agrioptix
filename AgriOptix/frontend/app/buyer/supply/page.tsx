"use client";

import { useEffect, useMemo, useState } from "react";
import "./supply.css";

type Requirement = {
  crop: string;
  quantity: number;
  quality: string;
  location: string;
  deliveryWindow: string;
  maxPrice: number;
};

type Farmer = {
  id: number;
  name: string;
  farm: string;
  crop: string;
  location: string;
  distance: number;
  quantity: number;
  quality: string;
  price: number;
  delivery: string;
  verified: boolean;
  fresh: boolean;
  rating: number;
};

type MatchResult = {
  score: number;
  exact: boolean;
  reasons: string[];
  warnings: string[];
};

const farmers: Farmer[] = [
  {
    id: 1,
    name: "Arjun Rao",
    farm: "Fresh Harvest Farms",
    crop: "Tomato",
    location: "Hyderabad, Telangana",
    distance: 78,
    quantity: 2400,
    quality: "Grade A",
    price: 27,
    delivery: "2 days",
    verified: true,
    fresh: true,
    rating: 4.9,
  },
  {
    id: 2,
    name: "Suresh Reddy",
    farm: "Green Valley Farms",
    crop: "Tomato",
    location: "Vikarabad, Telangana",
    distance: 92,
    quantity: 2000,
    quality: "Grade A",
    price: 26,
    delivery: "3 days",
    verified: true,
    fresh: true,
    rating: 4.8,
  },
  {
    id: 3,
    name: "Mahesh Kumar",
    farm: "Sunrise Agro Farm",
    crop: "Tomato",
    location: "Medak, Telangana",
    distance: 118,
    quantity: 1800,
    quality: "Grade B",
    price: 24,
    delivery: "4 days",
    verified: true,
    fresh: true,
    rating: 4.7,
  },
  {
    id: 4,
    name: "Ravi Kumar",
    farm: "Green Field Organics",
    crop: "Tomato",
    location: "Nalgonda, Telangana",
    distance: 145,
    quantity: 3200,
    quality: "Grade A",
    price: 29,
    delivery: "2 days",
    verified: true,
    fresh: false,
    rating: 4.6,
  },
  {
    id: 5,
    name: "Anil Kumar",
    farm: "Sri Lakshmi Farms",
    crop: "Tomato",
    location: "Warangal, Telangana",
    distance: 165,
    quantity: 2600,
    quality: "Grade B",
    price: 25,
    delivery: "5 days",
    verified: true,
    fresh: true,
    rating: 4.5,
  },
  {
    id: 6,
    name: "Vijay Reddy",
    farm: "Sun Fresh Agriculture",
    crop: "Onion",
    location: "Mahbubnagar, Telangana",
    distance: 190,
    quantity: 3000,
    quality: "Grade A",
    price: 31,
    delivery: "4 days",
    verified: true,
    fresh: true,
    rating: 4.4,
  },
];

const defaultRequirement: Requirement = {
  crop: "Tomato",
  quantity: 2000,
  quality: "Grade A",
  location: "Hyderabad",
  deliveryWindow: "2-4 days",
  maxPrice: 30,
};

function getRequirement(): Requirement {
  if (typeof window === "undefined") {
    return defaultRequirement;
  }

  try {
    const keys = [
      "buyerRequirement",
      "buyerRequirements",
      "requirement",
      "latestRequirement",
    ];

    for (const key of keys) {
      const saved = localStorage.getItem(key);

      if (!saved) continue;

      const data = JSON.parse(saved);

      return {
        crop: data.crop || data.product || defaultRequirement.crop,
        quantity:
          Number(data.quantity) || defaultRequirement.quantity,
        quality:
          data.quality ||
          data.grade ||
          defaultRequirement.quality,
        location:
          data.location ||
          data.deliveryLocation ||
          defaultRequirement.location,
        deliveryWindow:
          data.deliveryWindow ||
          data.delivery ||
          defaultRequirement.deliveryWindow,
        maxPrice:
          Number(
            data.maxPrice ||
              data.price ||
              data.maxPricePerKg
          ) || defaultRequirement.maxPrice,
      };
    }
  } catch {
    // Use default requirement
  }

  return defaultRequirement;
}

function calculateMatch(
  farmer: Farmer,
  requirement: Requirement
): MatchResult {
  let score = 0;

  const reasons: string[] = [];
  const warnings: string[] = [];

  const cropMatch =
    farmer.crop.toLowerCase().trim() ===
    requirement.crop.toLowerCase().trim();

  const qualityMatch =
    farmer.quality.toLowerCase().trim() ===
    requirement.quality.toLowerCase().trim();

  const quantityMatch =
    farmer.quantity >= requirement.quantity;

  const priceMatch =
    farmer.price <= requirement.maxPrice;

  if (cropMatch) {
    score += 35;
    reasons.push("Exact crop match");
  } else {
    warnings.push(`Crop is ${farmer.crop}`);
  }

  if (quantityMatch) {
    score += 20;
    reasons.push("Required quantity available");
  } else if (
    farmer.quantity >= requirement.quantity * 0.75
  ) {
    score += 13;
    reasons.push("Quantity is close to requirement");
    warnings.push("Slight quantity shortage");
  } else {
    score += 5;
    warnings.push("Quantity below requirement");
  }

  if (qualityMatch) {
    score += 15;
    reasons.push("Required quality available");
  } else {
    score += 7;
    warnings.push(
      `${farmer.quality} instead of ${requirement.quality}`
    );
  }

  if (priceMatch) {
    score += 15;
    reasons.push("Within your price limit");
  } else if (
    farmer.price <= requirement.maxPrice * 1.1
  ) {
    score += 9;
    warnings.push("Slightly above price limit");
  } else {
    score += 3;
    warnings.push("Above price limit");
  }

  if (farmer.distance <= 100) {
    score += 7;
    reasons.push("Good delivery distance");
  } else if (farmer.distance <= 150) {
    score += 4;
    reasons.push("Reasonable delivery distance");
  } else {
    score += 2;
    warnings.push("Farther delivery distance");
  }

  if (farmer.verified) {
    score += 4;
    reasons.push("Verified supplier");
  }

  const exact =
    cropMatch &&
    quantityMatch &&
    qualityMatch &&
    priceMatch;

  return {
    score: Math.min(Math.round(score), 100),
    exact,
    reasons,
    warnings,
  };
}

export default function BuyerSupplyPage() {
  const [requirement, setRequirement] =
    useState<Requirement>(defaultRequirement);

  const [selectedFarmer, setSelectedFarmer] =
    useState<Farmer | null>(null);

  const [showAll, setShowAll] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    setRequirement(getRequirement());
  }, []);

  const evaluatedFarmers = useMemo(() => {
    return farmers
      .map((farmer) => ({
        farmer,
        match: calculateMatch(farmer, requirement),
      }))
      .sort((a, b) => {
        if (b.match.score !== a.match.score) {
          return b.match.score - a.match.score;
        }

        return b.farmer.rating - a.farmer.rating;
      });
  }, [requirement]);

  const exactMatches = evaluatedFarmers.filter(
    (item) => item.match.exact
  );

  const approximateMatches = evaluatedFarmers.filter(
    (item) => !item.match.exact && item.match.score >= 55
  );

  const bestMatch =
    exactMatches[0] ||
    approximateMatches[0] ||
    evaluatedFarmers[0];

  const visibleApproximate = showAll
    ? approximateMatches
    : approximateMatches.slice(0, 4);

  const handleSelectFarmer = (farmer: Farmer) => {
    setSelectedFarmer(farmer);

    localStorage.setItem(
      "selectedFarmer",
      JSON.stringify(farmer)
    );

    setMessage(
      `${farmer.name} has been selected as your preferred supplier.`
    );
  };

  const handleViewDetails = (farmer: Farmer) => {
    setSelectedFarmer(farmer);

    setMessage(
      `Viewing details for ${farmer.name} from ${farmer.farm}.`
    );
  };

  const handleBack = () => {
    window.location.assign("/buyer/home");
  };

  const handleCreateAnother = () => {
    window.location.assign("/buyer/requirements");
  };

  return (
    <main className="supply-page">

      <div className="supply-container">

        {/* HEADER */}

        <header className="supply-topbar">

          <button
            className="supply-logo"
            onClick={handleBack}
          >
            <span className="logo-leaf">🌿</span>

            <span className="logo-text">
              <strong>AgriOptix</strong>
              <small>
                Smarter Farms. Better Futures.
              </small>
            </span>
          </button>

          <button
            className="back-button"
            onClick={handleBack}
          >
            ← Dashboard
          </button>

        </header>


        {/* PAGE INTRO */}

        <section className="page-heading">

          <div>
            <span className="eyebrow">
              SMART SUPPLIER MATCHING
            </span>

            <h1>
              Find the right farmers for your requirement
            </h1>

            <p>
              AgriOptix compares available farmers using
              crop, quantity, quality, price, distance,
              freshness and supplier verification.
            </p>
          </div>

        </section>


        {/* REQUIREMENT */}

        <section className="requirement-summary">

          <div className="requirement-heading">

            <div className="requirement-icon">
              🌱
            </div>

            <div>
              <span>Your requirement</span>

              <h2>
                {requirement.crop}
              </h2>
            </div>

            <div className="requirement-status">
              Requirement analyzed ✓
            </div>

          </div>


          <div className="requirement-items">

            <div className="requirement-item">
              <span>Quantity</span>
              <strong>
                {requirement.quantity.toLocaleString()} kg
              </strong>
            </div>

            <div className="requirement-item">
              <span>Quality</span>
              <strong>
                {requirement.quality}
              </strong>
            </div>

            <div className="requirement-item">
              <span>Delivery location</span>
              <strong>
                {requirement.location}
              </strong>
            </div>

            <div className="requirement-item">
              <span>Maximum price</span>
              <strong>
                ₹{requirement.maxPrice}/kg
              </strong>
            </div>

            <div className="requirement-item">
              <span>Delivery window</span>
              <strong>
                {requirement.deliveryWindow}
              </strong>
            </div>

          </div>

        </section>


        {/* RESULT OVERVIEW */}

        <section className="result-overview">

          <div className="overview-card">
            <div className="overview-icon green">
              ✓
            </div>

            <div>
              <strong>
                {exactMatches.length}
              </strong>

              <span>
                Exact matches
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon yellow">
              ≈
            </div>

            <div>
              <strong>
                {approximateMatches.length}
              </strong>

              <span>
                Approximate matches
              </span>
            </div>
          </div>

          <div className="overview-card">
            <div className="overview-icon blue">
              🚚
            </div>

            <div>
              <strong>
                {evaluatedFarmers.length}
              </strong>

              <span>
                Farmers analyzed
              </span>
            </div>
          </div>

        </section>


        {/* AGRIOPTIX RECOMMENDATION */}

        {bestMatch && (

          <section className="recommendation-card">

            <div className="recommendation-top">

              <div className="recommendation-title">

                <span className="star-icon">
                  ⭐
                </span>

                <div>
                  <span>
                    AGRIOPTIX RECOMMENDATION
                  </span>

                  <h2>
                    Best overall supplier
                  </h2>
                </div>

              </div>

              <div className="recommendation-score">
                <strong>
                  {bestMatch.match.score}%
                </strong>

                <span>
                  MATCH
                </span>
              </div>

            </div>


            <div className="recommendation-body">

              <div className="recommended-farmer">

                <div className="farmer-avatar large">
                  🍅
                </div>

                <div>

                  <span className="recommended-label">
                    ★ RECOMMENDED FARMER
                  </span>

                  <h3>
                    {bestMatch.farmer.name}
                  </h3>

                  <p>
                    {bestMatch.farmer.farm}
                  </p>

                  <span className="farmer-location">
                    📍 {bestMatch.farmer.location}
                    {" • "}
                    {bestMatch.farmer.distance} km away
                  </span>

                </div>

              </div>


              <div className="recommendation-reason">

                <strong>
                  Why AgriOptix recommends this farmer
                </strong>

                <div className="reason-grid">

                  {bestMatch.match.reasons
                    .slice(0, 4)
                    .map((reason, index) => (
                      <span key={index}>
                        ✓ {reason}
                      </span>
                    ))}

                </div>

              </div>

            </div>


            <div className="recommended-stats">

              <div>
                <span>AVAILABLE</span>
                <strong>
                  {bestMatch.farmer.quantity.toLocaleString()} kg
                </strong>
              </div>

              <div>
                <span>QUALITY</span>
                <strong>
                  {bestMatch.farmer.quality}
                </strong>
              </div>

              <div>
                <span>PRICE</span>
                <strong>
                  ₹{bestMatch.farmer.price}/kg
                </strong>
              </div>

              <div>
                <span>DELIVERY</span>
                <strong>
                  {bestMatch.farmer.delivery}
                </strong>
              </div>

              <div>
                <span>RATING</span>
                <strong>
                  ⭐ {bestMatch.farmer.rating}
                </strong>
              </div>

            </div>


            <div className="recommendation-actions">

              <button
                className="secondary-button"
                onClick={() =>
                  handleViewDetails(bestMatch.farmer)
                }
              >
                View Details
              </button>

              <button
                className="primary-button"
                onClick={() =>
                  handleSelectFarmer(bestMatch.farmer)
                }
              >
                Select Recommended Farmer →
              </button>

            </div>

          </section>

        )}


        {/* EXACT MATCHES */}

        <section className="match-section">

          <div className="section-header">

            <div>
              <div className="section-title">

                <span className="section-check">
                  ✓
                </span>

                <h2>
                  Exact Matches
                </h2>

                <span className="count-badge green">
                  {exactMatches.length}
                </span>

              </div>

              <p>
                Farmers meeting the main crop, quantity,
                quality and price requirements.
              </p>
            </div>

            <span className="section-pill exact-pill">
              Exact requirement match
            </span>

          </div>


          {exactMatches.length > 0 ? (

            <div className="farmer-grid">

              {exactMatches.map(
                ({ farmer, match }) => (

                  <FarmerCard
                    key={farmer.id}
                    farmer={farmer}
                    match={match}
                    onView={() =>
                      handleViewDetails(farmer)
                    }
                    onSelect={() =>
                      handleSelectFarmer(farmer)
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="empty-card">

              <div>
                🔎
              </div>

              <h3>
                No exact matches found
              </h3>

              <p>
                We found some close alternatives below.
              </p>

            </div>

          )}

        </section>


        {/* APPROXIMATE MATCHES */}

        <section className="match-section approximate-section">

          <div className="section-header">

            <div>
              <div className="section-title">

                <span className="section-check yellow">
                  ≈
                </span>

                <h2>
                  Approximate Matches
                </h2>

                <span className="count-badge yellow">
                  {approximateMatches.length}
                </span>

              </div>

              <p>
                Farmers who are close to your requirement
                but differ in one or more criteria.
              </p>
            </div>

            <span className="section-pill approximate-pill">
              Close alternatives
            </span>

          </div>


          {approximateMatches.length > 0 ? (

            <div className="farmer-grid">

              {visibleApproximate.map(
                ({ farmer, match }) => (

                  <FarmerCard
                    key={farmer.id}
                    farmer={farmer}
                    match={match}
                    approximate
                    onView={() =>
                      handleViewDetails(farmer)
                    }
                    onSelect={() =>
                      handleSelectFarmer(farmer)
                    }
                  />

                )
              )}

            </div>

          ) : (

            <div className="empty-card">

              <div>
                🌾
              </div>

              <h3>
                No approximate matches
              </h3>

              <p>
                Try increasing your price range or
                delivery window.
              </p>

            </div>

          )}


          {approximateMatches.length > 4 && (

            <div className="show-all-wrapper">

              <button
                className="show-all-button"
                onClick={() =>
                  setShowAll(!showAll)
                }
              >
                {showAll
                  ? "Show fewer farmers ↑"
                  : `Show all ${approximateMatches.length} farmers ↓`}
              </button>

            </div>

          )}

        </section>


        {/* MESSAGE */}

        {message && (

          <div className="selection-message">

            <div className="message-icon">
              ✓
            </div>

            <div>
              <strong>
                Supplier action
              </strong>

              <p>
                {message}
              </p>
            </div>

            <button
              onClick={() => setMessage("")}
            >
              ×
            </button>

          </div>

        )}


        {/* BOTTOM ACTIONS */}

        <section className="bottom-actions">

          <button
            className="change-button"
            onClick={handleCreateAnother}
          >
            ← Change Requirement
          </button>

          {selectedFarmer && (

            <button
              className="continue-button"
              onClick={() =>
                window.location.assign(
                  "/buyer/orders"
                )
              }
            >
              Continue with Supplier →
            </button>

          )}

        </section>


        <footer className="supply-footer">

          <div className="footer-brand">
            🌿 <strong>AgriOptix</strong>
          </div>

          <span>
            Better decisions. Fresher produce.
          </span>

        </footer>

      </div>

    </main>
  );
}


/* =========================================================
   FARMER CARD
   ========================================================= */

function FarmerCard({
  farmer,
  match,
  approximate = false,
  onView,
  onSelect,
}: {
  farmer: Farmer;
  match: MatchResult;
  approximate?: boolean;
  onView: () => void;
  onSelect: () => void;
}) {
  return (
    <article
      className={`farmer-card ${
        match.score >= 90
          ? "excellent"
          : match.score >= 75
          ? "good"
          : "average"
      }`}
    >

      <div className="farmer-card-top">

        <div className="farmer-info">

          <div className="farmer-avatar">
            🍅
          </div>

          <div>

            <h3>
              {farmer.name}
            </h3>

            <p>
              {farmer.farm}
            </p>

            <span>
              📍 {farmer.location}
            </span>

          </div>

        </div>


        <div className="card-match">

          <strong>
            {match.score}%
          </strong>

          <span>
            {approximate
              ? "Approx. match"
              : "Exact match"}
          </span>

        </div>

      </div>


      <div className="farmer-data">

        <div>
          <span>Available</span>
          <strong>
            {farmer.quantity.toLocaleString()} kg
          </strong>
        </div>

        <div>
          <span>Quality</span>
          <strong>
            {farmer.quality}
          </strong>
        </div>

        <div>
          <span>Price</span>
          <strong>
            ₹{farmer.price}/kg
          </strong>
        </div>

        <div>
          <span>Delivery</span>
          <strong>
            {farmer.delivery}
          </strong>
        </div>

      </div>


      <div className="farmer-tags">

        {farmer.verified && (
          <span className="tag green">
            ✓ Verified
          </span>
        )}

        {farmer.fresh && (
          <span className="tag green">
            ✓ Fresh harvest
          </span>
        )}

        <span className="tag blue">
          ⭐ {farmer.rating}
        </span>

        <span className="tag gray">
          📍 {farmer.distance} km
        </span>

      </div>


      <div className="card-reasons">

        {match.reasons
          .slice(0, 2)
          .map((reason, index) => (
            <span key={index}>
              ✓ {reason}
            </span>
          ))}

        {match.warnings
          .slice(0, 1)
          .map((warning, index) => (
            <span
              className="warning"
              key={`warning-${index}`}
            >
              ! {warning}
            </span>
          ))}

      </div>


      <div className="card-actions">

        <button
          className="view-button"
          onClick={onView}
        >
          View Details
        </button>

        <button
          className="select-button"
          onClick={onSelect}
        >
          Select Farmer →
        </button>

      </div>

    </article>
  );
}