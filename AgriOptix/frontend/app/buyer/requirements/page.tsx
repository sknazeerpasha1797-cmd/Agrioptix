"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./requirements.css";

export default function RequirementsPage() {
  const router = useRouter();

  const [crop, setCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quality, setQuality] = useState("Grade A");
  const [location, setLocation] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submitRequirement = () => {
    setError("");

    if (!crop) {
      setError("Please select a crop.");
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Please enter a valid quantity.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter the delivery location.");
      return;
    }

    if (!deliveryDate) {
      setError("Please select a delivery date.");
      return;
    }

    if (!maxPrice || Number(maxPrice) <= 0) {
      setError("Please enter your maximum price per kg.");
      return;
    }

    setSaving(true);

    const requirement = {
      id: `REQ-${Date.now()}`,
      crop,
      quantity: Number(quantity),
      quality,
      location: location.trim(),
      deliveryDate,
      maxPrice: Number(maxPrice),
      notes: notes.trim(),
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    try {
      const existing =
        localStorage.getItem("buyerRequirements");

      const requirements = existing
        ? JSON.parse(existing)
        : [];

      requirements.push(requirement);

      localStorage.setItem(
        "buyerRequirements",
        JSON.stringify(requirements)
      );

      // Save latest requirement separately
      localStorage.setItem(
        "latestBuyerRequirement",
        JSON.stringify(requirement)
      );

      setTimeout(() => {
        router.push("/buyer/supply");
      }, 500);
    } catch (err) {
      console.error(err);

      setSaving(false);

      setError(
        "Unable to save the requirement. Please try again."
      );
    }
  };

  return (
    <main className="requirements-page">

      <div className="requirements-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="requirements-header">

          <button
            type="button"
            className="back-button"
            onClick={() => router.push("/buyer/home")}
          >
            ←
          </button>

          <div className="requirements-brand">

            <div className="requirements-logo">
              ◒
            </div>

            <div>
              <strong>
                AgriOptix
              </strong>

              <small>
                Buyer Portal
              </small>
            </div>

          </div>

          <div className="step-indicator">
            STEP 1 OF 2
          </div>

        </header>


        {/* =================================================
            PAGE TITLE
        ================================================= */}

        <section className="requirements-title">

          <p>
            NEW REQUIREMENT
          </p>

          <h1>
            What produce do you need?
          </h1>

          <span>
            Tell us your requirements and we'll find
            suitable farmers and available produce.
          </span>

        </section>


        {/* =================================================
            FORM
        ================================================= */}

        <section className="requirement-card">

          <div className="form-section-heading">

            <span>
              01
            </span>

            <div>
              <h2>
                Produce details
              </h2>

              <p>
                Specify the crop, quantity and quality you need.
              </p>
            </div>

          </div>


          <div className="requirement-grid">

            {/* CROP */}

            <div className="requirement-field">

              <label>
                Crop <b>*</b>
              </label>

              <select
                value={crop}
                onChange={(e) => {
                  setCrop(e.target.value);
                  setError("");
                }}
              >

                <option value="">
                  Select crop
                </option>

                <option value="Tomato">
                  Tomato
                </option>

                <option value="Potato">
                  Potato
                </option>

                <option value="Onion">
                  Onion
                </option>

                <option value="Carrot">
                  Carrot
                </option>

                <option value="Cabbage">
                  Cabbage
                </option>

                <option value="Chilli">
                  Chilli
                </option>

                <option value="Mango">
                  Mango
                </option>

                <option value="Banana">
                  Banana
                </option>

                <option value="Rice">
                  Rice
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            {/* QUANTITY */}

            <div className="requirement-field">

              <label>
                Quantity <b>*</b>
              </label>

              <div className="input-with-unit">

                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 2000"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError("");
                  }}
                />

                <span>
                  kg
                </span>

              </div>

            </div>


            {/* QUALITY */}

            <div className="requirement-field">

              <label>
                Quality / Grade <b>*</b>
              </label>

              <select
                value={quality}
                onChange={(e) =>
                  setQuality(e.target.value)
                }
              >

                <option value="Grade A">
                  Grade A
                </option>

                <option value="Grade B">
                  Grade B
                </option>

                <option value="Premium">
                  Premium
                </option>

                <option value="Standard">
                  Standard
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              DELIVERY SECTION
          ================================================= */}

          <div className="form-section-heading second-heading">

            <span>
              02
            </span>

            <div>
              <h2>
                Delivery requirements
              </h2>

              <p>
                Tell us where and when you need the produce.
              </p>
            </div>

          </div>


          <div className="requirement-grid">

            {/* LOCATION */}

            <div className="requirement-field full-field">

              <label>
                Delivery location <b>*</b>
              </label>

              <input
                type="text"
                placeholder="City, State"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* DELIVERY DATE */}

            <div className="requirement-field">

              <label>
                Required by <b>*</b>
              </label>

              <input
                type="date"
                value={deliveryDate}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(e) => {
                  setDeliveryDate(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* MAX PRICE */}

            <div className="requirement-field">

              <label>
                Maximum price <b>*</b>
              </label>

              <div className="input-with-unit">

                <span className="currency">
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setError("");
                  }}
                />

                <span>
                  /kg
                </span>

              </div>

            </div>

          </div>


          {/* =================================================
              NOTES
          ================================================= */}

          <div className="requirement-field notes-field">

            <label>
              Additional requirements
              <span>
                Optional
              </span>
            </label>

            <textarea
              placeholder="Example: Fresh harvest, no visible damage, packed in 25 kg crates..."
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              rows={4}
            />

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="requirement-error">

              <span>
                !
              </span>

              <p>
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              SUMMARY
          ================================================= */}

          <div className="requirement-summary">

            <div>

              <span>
                YOUR REQUEST
              </span>

              <strong>
                {crop || "Select a crop"}
              </strong>

            </div>

            <div>

              <span>
                QUANTITY
              </span>

              <strong>
                {quantity
                  ? `${quantity} kg`
                  : "—"}
              </strong>

            </div>

            <div>

              <span>
                QUALITY
              </span>

              <strong>
                {quality}
              </strong>

            </div>

            <div>

              <span>
                MAX PRICE
              </span>

              <strong>
                {maxPrice
                  ? `₹${maxPrice}/kg`
                  : "—"}
              </strong>

            </div>

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="requirement-actions">

            <button
              type="button"
              className="cancel-button"
              onClick={() =>
                router.push("/buyer/home")
              }
            >
              Cancel
            </button>

            <button
              type="button"
              className="submit-requirement"
              onClick={submitRequirement}
              disabled={saving}
            >

              {saving
                ? "Finding matches..."
                : "Find Matching Farmers"}

              {!saving && (
                <span>
                  →
                </span>
              )}

            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="requirements-footer">

          <span>
            🔒 Your requirement is securely saved
          </span>

          <span>
            AgriOptix • Better Decisions. Fresher Produce.
          </span>

        </footer>

      </div>

    </main>
  );
}