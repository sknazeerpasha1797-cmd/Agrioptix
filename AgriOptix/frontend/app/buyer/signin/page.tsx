"use client";

import Link from "next/link";
import { useState } from "react";
import "./signin.css";

export default function BuyerSignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // SIGN IN
  // =====================================================

  const handleSignIn = () => {
    setError("");
    setSuccess("");

    const enteredEmail = email.trim().toLowerCase();

    if (!enteredEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Get account created during buyer onboarding
    const savedAccount = localStorage.getItem("buyerAccount");

    if (!savedAccount) {
      setError(
        "No buyer account found. Please create a buyer account first."
      );
      return;
    }

    let account: any;

    try {
      account = JSON.parse(savedAccount);
    } catch {
      setError(
        "Your buyer account data is invalid. Please create your account again."
      );
      return;
    }

    // Support common email field names
    const registeredEmail = String(
      account.email ??
        account.emailAddress ??
        account.email_address ??
        ""
    )
      .trim()
      .toLowerCase();

    // Support common password field names
    const registeredPassword = String(
      account.password ?? ""
    );

    if (!registeredEmail) {
      setError(
        "No email was found in your buyer account."
      );
      return;
    }

    if (enteredEmail !== registeredEmail) {
      setError(
        "Email address is not registered."
      );
      return;
    }

    if (password !== registeredPassword) {
      setError(
        "Incorrect password. Please try again."
      );
      return;
    }

    // =====================================================
    // LOGIN SUCCESS
    // =====================================================

    setLoading(true);

    localStorage.setItem(
      "buyerLoggedIn",
      "true"
    );

    localStorage.setItem(
      "buyerEmail",
      registeredEmail
    );

    // Save useful account information
    if (account.fullName) {
      localStorage.setItem(
        "buyerName",
        account.fullName
      );
    }

    if (account.company) {
      localStorage.setItem(
        "buyerCompany",
        account.company
      );
    }

    if (rememberMe) {
      localStorage.setItem(
        "buyerRememberMe",
        "true"
      );
    } else {
      localStorage.removeItem(
        "buyerRememberMe"
      );
    }

    setSuccess(
      "Login successful. Opening your dashboard..."
    );

    // Navigate to buyer home
    setTimeout(() => {
      window.location.href = "/buyer/home";
    }, 500);
  };


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  const handleForgotPassword = () => {
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError(
        "Enter your registered email address first."
      );
      return;
    }

    const savedAccount =
      localStorage.getItem("buyerAccount");

    if (!savedAccount) {
      setError(
        "No buyer account was found."
      );
      return;
    }

    try {
      const account = JSON.parse(savedAccount);

      const registeredEmail = String(
        account.email ??
          account.emailAddress ??
          account.email_address ??
          ""
      )
        .trim()
        .toLowerCase();

      if (
        email.trim().toLowerCase() !==
        registeredEmail
      ) {
        setError(
          "This email address is not registered."
        );
        return;
      }

      setSuccess(
        "Your account was found. Password reset can be connected to the backend later."
      );
    } catch {
      setError(
        "Unable to read your account information."
      );
    }
  };


  // =====================================================
  // INPUT HANDLERS
  // =====================================================

  const handleEmailChange = (
    value: string
  ) => {
    setEmail(value);
    setError("");
    setSuccess("");
  };

  const handlePasswordChange = (
    value: string
  ) => {
    setPassword(value);
    setError("");
    setSuccess("");
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="signin-page">

      <div className="signin-container">

        {/* =================================================
            LEFT BLUE PANEL
        ================================================= */}

        <section className="signin-left">

          <div className="brand">

            <div className="brand-icon">
              ✦
            </div>

            <div>
              <div className="brand-name">
                AgriOptix
              </div>

              <div className="brand-tagline">
                Farm-to-Market Intelligence
              </div>
            </div>

          </div>


          <div className="left-content">

            <div className="portal-label">
              BUYER PORTAL
            </div>

            <h1>
              Welcome
              <br />
              <span>back.</span>
            </h1>

            <p className="left-description">
              Access your AgriOptix buyer account
              and continue managing your agricultural
              procurement.
            </p>


            <div className="features">

              <div className="feature">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Smart sourcing
                  </h3>

                  <p>
                    Find quality produce from
                    verified suppliers.
                  </p>
                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Smart procurement
                  </h3>

                  <p>
                    Manage requirements and
                    source efficiently.
                  </p>
                </div>

              </div>


              <div className="feature">

                <div className="feature-icon">
                  ✓
                </div>

                <div>
                  <h3>
                    Track every order
                  </h3>

                  <p>
                    Monitor sourcing and delivery
                    in one place.
                  </p>
                </div>

              </div>

            </div>

          </div>


          <div className="copyright">
            © 2026 AgriOptix
          </div>

        </section>


        {/* =================================================
            RIGHT SIGN-IN PANEL
        ================================================= */}

        <section className="signin-right">

          <div className="signin-header">

            <div>

              <div className="form-label">
                BUYER ACCOUNT
              </div>

              <h2>
                Sign in
              </h2>

              <p>
                Enter your registered account
                details to continue.
              </p>

            </div>


            <div className="user-icon">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="25"
                height="25"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M4 21C4.7 17.3 7.4 15.3 12 15.3C16.6 15.3 19.3 17.3 20 21"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>

            </div>

          </div>


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group">

            <label>
              Email address
              <span>*</span>
            </label>

            <div className="input-wrapper">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="19"
                height="19"
              >
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M3 7L12 13L21 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
              </svg>


              <input
                type="email"
                value={email}
                onChange={(e) =>
                  handleEmailChange(
                    e.target.value
                  )
                }
                placeholder="name@company.com"
                autoComplete="email"
              />

            </div>

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="form-group">

            <div className="password-heading">

              <label>
                Password
                <span>*</span>
              </label>

              <button
                type="button"
                className="forgot-button"
                onClick={
                  handleForgotPassword
                }
              >
                Forgot password?
              </button>

            </div>


            <div className="input-wrapper">

              <svg
                viewBox="0 0 24 24"
                fill="none"
                width="19"
                height="19"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M8 10V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V10"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>


              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  handlePasswordChange(
                    e.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
              />


              <button
                type="button"
                className="show-button"
                onClick={() =>
                  setShowPassword(
                    (previous) =>
                      !previous
                  )
                }
              >
                {showPassword
                  ? "Hide"
                  : "Show"}
              </button>

            </div>

          </div>


          {/* =================================================
              REMEMBER ME
          ================================================= */}

          <label className="remember-row">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) =>
                setRememberMe(
                  e.target.checked
                )
              }
            />

            <span>
              Remember me
            </span>

          </label>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="message error-message">

              <div className="message-icon">
                !
              </div>

              <div>
                {error}
              </div>

            </div>
          )}


          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="message success-message">

              <div className="message-icon">
                ✓
              </div>

              <div>
                {success}
              </div>

            </div>
          )}


          {/* =================================================
              SIGN IN
          ================================================= */}

          <button
            type="button"
            className="signin-button"
            onClick={handleSignIn}
            disabled={loading}
          >

            <span>
              {loading
                ? "Signing in..."
                : "Sign In"}
            </span>

            {!loading && (
              <span className="arrow">
                →
              </span>
            )}

          </button>


          {/* =================================================
              CREATE ACCOUNT
              IMPORTANT:
              REAL NEXT.JS LINK
          ================================================= */}

          <div className="create-account">

            <span>
              Don't have a buyer account?
            </span>

            <Link
              href="/buyer/onboarding"
              className="create-link"
            >
              Create account
            </Link>

          </div>


          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="security-note">

            <span>
              🔒
            </span>

            <p>
              Your account information is
              securely protected.
            </p>

          </div>

        </section>

      </div>

    </main>
  );
}