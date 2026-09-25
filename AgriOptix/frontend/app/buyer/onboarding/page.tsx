"use client";

import { useState } from "react";
import "./buyer.css";

export default function BuyerOnboarding() {
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [agree, setAgree] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // CREATE BUYER ACCOUNT
  // =====================================================

  const createBuyerAccount = () => {
    setError("");
    setSuccess("");

    // Full name
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    // Company
    if (!company.trim()) {
      setError("Please enter your company or business name.");
      return;
    }

    // Email
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Phone
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    const cleanPhone = phone.replace(/\D/g, "");

    if (cleanPhone.length < 10) {
      setError("Please enter a valid phone number.");
      return;
    }

    // Location
    if (!location.trim()) {
      setError("Please enter your business location.");
      return;
    }

    // Password
    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    // Confirm password
    if (!confirmPassword) {
      setError("Please confirm your password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Terms
    if (!agree) {
      setError(
        "Please agree to the Terms & Conditions and Privacy Policy."
      );
      return;
    }

    setLoading(true);

    // =====================================================
    // SAVE ACCOUNT
    // =====================================================

    const buyerAccount = {
      fullName: fullName.trim(),
      company: company.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanPhone,
      location: location.trim(),
      password: password,
      createdAt: new Date().toISOString(),
      role: "buyer",
    };

    try {
      localStorage.setItem(
        "buyerAccount",
        JSON.stringify(buyerAccount)
      );

      // Make sure previous login is cleared
      localStorage.removeItem("buyerLoggedIn");
      localStorage.removeItem("buyerEmail");

      setSuccess(
        "Your buyer account has been created successfully."
      );

      // =====================================================
      // GO TO SIGN IN
      // =====================================================

      setTimeout(() => {
        window.location.assign("/buyer/signin");
      }, 700);

    } catch (error) {
      console.error(error);

      setLoading(false);

      setError(
        "Unable to create the account. Please try again."
      );
    }
  };


  // =====================================================
  // SIGN IN NAVIGATION
  // =====================================================

  const goToSignIn = () => {
    window.location.assign("/buyer/signin");
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="buyer-page">

      <div className="buyer-container">


        {/* =================================================
            LEFT BLUE PANEL
        ================================================= */}

        <section className="buyer-left">

          <div className="buyer-brand">

            <div className="buyer-brand-icon">
              ✦
            </div>

            <div>

              <div className="buyer-brand-name">
                AgriOptix
              </div>

              <div className="buyer-brand-subtitle">
                Farm-to-Market Intelligence
              </div>

            </div>

          </div>


          <div className="buyer-left-content">

            <div className="buyer-eyebrow">
              BUYER ONBOARDING
            </div>

            <h1>
              Source smarter.
              <br />
              <span>Buy better.</span>
            </h1>

            <p>
              Join AgriOptix and connect with
              reliable agricultural suppliers,
              quality produce and smarter
              procurement.
            </p>


            {/* FEATURE 1 */}

            <div className="buyer-feature">

              <div className="buyer-feature-number">
                01
              </div>

              <div>

                <h3>
                  Verified Suppliers
                </h3>

                <p>
                  Discover trusted agricultural
                  producers.
                </p>

              </div>

            </div>


            {/* FEATURE 2 */}

            <div className="buyer-feature">

              <div className="buyer-feature-number">
                02
              </div>

              <div>

                <h3>
                  Smart Procurement
                </h3>

                <p>
                  Find produce based on your
                  exact requirements.
                </p>

              </div>

            </div>


            {/* FEATURE 3 */}

            <div className="buyer-feature">

              <div className="buyer-feature-number">
                03
              </div>

              <div>

                <h3>
                  Track Every Order
                </h3>

                <p>
                  Manage sourcing and delivery
                  in one place.
                </p>

              </div>

            </div>

          </div>


          <div className="buyer-left-footer">
            © 2026 AgriOptix
          </div>

        </section>


        {/* =================================================
            RIGHT FORM
        ================================================= */}

        <section className="buyer-right">

          <div className="buyer-form-header">

            <div>

              <div className="buyer-form-label">
                CREATE ACCOUNT
              </div>

              <h2>
                Buyer onboarding
              </h2>

              <p>
                Tell us about yourself and your
                business.
              </p>

            </div>


            <div className="buyer-user-icon">
              👤
            </div>

          </div>


          {/* =================================================
              SECTION 01
          ================================================= */}

          <div className="buyer-section-title">

            <span>01</span>

            <strong>
              Personal & Business details
            </strong>

          </div>


          <div className="buyer-grid">


            {/* FULL NAME */}

            <div className="buyer-field">

              <label>
                Full name <b>*</b>
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* COMPANY */}

            <div className="buyer-field">

              <label>
                Company / business name <b>*</b>
              </label>

              <input
                type="text"
                placeholder="Enter business name"
                value={company}
                onChange={(e) => {
                  setCompany(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* EMAIL */}

            <div className="buyer-field">

              <label>
                Email address <b>*</b>
              </label>

              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* PHONE */}

            <div className="buyer-field">

              <label>
                Phone number <b>*</b>
              </label>

              <input
                type="tel"
                placeholder="+91 00000 00000"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError("");
                }}
              />

            </div>


            {/* LOCATION */}

            <div className="buyer-field buyer-full">

              <label>
                Business location <b>*</b>
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

          </div>


          {/* =================================================
              SECTION 02
          ================================================= */}

          <div className="buyer-section-title buyer-security-title">

            <span>02</span>

            <strong>
              Account security
            </strong>

          </div>


          <div className="buyer-grid">


            {/* PASSWORD */}

            <div className="buyer-field">

              <label>
                Password <b>*</b>
              </label>

              <div className="buyer-password">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

              <small>
                Use at least 8 characters with
                a combination of letters and numbers.
              </small>

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="buyer-field">

              <label>
                Confirm password <b>*</b>
              </label>

              <div className="buyer-password">

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(
                      e.target.value
                    );
                    setError("");
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="buyer-message buyer-error">

              <span>!</span>

              <p>
                {error}
              </p>

            </div>

          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (

            <div className="buyer-message buyer-success">

              <span>✓</span>

              <p>
                {success}
              </p>

            </div>

          )}


          {/* =================================================
              TERMS
          ================================================= */}

          <label className="buyer-terms">

            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => {
                setAgree(e.target.checked);
                setError("");
              }}
            />

            <span>
              I agree to the{" "}

              <button
                type="button"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                Terms & Conditions
              </button>

              {" "}and{" "}

              <button
                type="button"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                Privacy Policy
              </button>

            </span>

          </label>


          {/* =================================================
              CREATE ACCOUNT BUTTON
          ================================================= */}

          <button
            type="button"
            className="buyer-submit"
            onClick={createBuyerAccount}
            disabled={loading}
          >

            <span>
              {loading
                ? "Creating account..."
                : "Create Buyer Account"}
            </span>

            {!loading && (
              <span className="buyer-submit-arrow">
                →
              </span>
            )}

          </button>


          {/* =================================================
              SIGN IN
              THIS IS THE IMPORTANT PART
          ================================================= */}

          <div
            className="buyer-signin-row"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
              marginTop: "20px",
              paddingBottom: "10px",
            }}
          >

            <span>
              Already have an account?
            </span>

            <button
              type="button"
              onClick={goToSignIn}
              style={{
                border: "none",
                background: "transparent",
                color: "#087fcf",
                fontWeight: 800,
                cursor: "pointer",
                padding: 0,
                fontSize: "inherit",
              }}
            >
              Sign in
            </button>

          </div>


        </section>

      </div>

    </main>
  );
}