"use client";

import { FormEvent, useState } from "react";
import styles from "./DriverLogin.module.css";

export default function DriverLoginPage() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");

    // Remove spaces, +91, brackets, etc.
    const mobile = mobileNumber
      .replace(/\D/g, "")
      .slice(-10);

    // Basic validation
    if (mobile.length !== 10) {
      setMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    if (!password.trim()) {
      setMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/drivers/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: mobile,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Login failed. Please try again."
        );
        setIsLoading(false);
        return;
      }

      /*
       * Save driver information.
       *
       * Remember me ON:
       *   localStorage
       *
       * Remember me OFF:
       *   sessionStorage
       */

      if (rememberMe) {
        localStorage.setItem(
          "agrioptix_driver_token",
          data.access_token
        );

        localStorage.setItem(
          "agrioptix_driver",
          JSON.stringify(data.driver)
        );
      } else {
        sessionStorage.setItem(
          "agrioptix_driver_token",
          data.access_token
        );

        sessionStorage.setItem(
          "agrioptix_driver",
          JSON.stringify(data.driver)
        );
      }

      // Login successful
      window.location.href = "/driver/dashboard";
    } catch (error) {
      console.error("Driver login error:", error);

      setMessage(
        "Unable to connect to the server. Please make sure the backend is running."
      );

      setIsLoading(false);
    }
  }

  function goToRegister() {
    window.location.href = "/driver/onboarding";
  }

  function handleForgotPassword() {
    setMessage(
      "Password recovery will be available soon."
    );
  }

  function handleOTPLogin() {
    setMessage(
      "OTP login will be available soon."
    );
  }

  return (
    <main className={styles.page}>
      {/* ================= HEADER ================= */}

      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            🌿
          </div>

          <span>AgriOptix</span>

          <span className={styles.tagline}>
            Smarter Farms. Better Futures.
          </span>
        </div>

        <div className={styles.registerText}>
          New to AgriOptix?

          <button
            type="button"
            className={styles.registerButton}
            onClick={goToRegister}
          >
            Register
          </button>
        </div>
      </header>

      {/* ================= MAIN LAYOUT ================= */}

      <section className={styles.layout}>

        {/* ================= LEFT PANEL ================= */}

        <aside className={styles.leftPanel}>
          <div>
            <p className={styles.eyebrow}>
              DRIVER / TRANSPORTER
            </p>

            <h1 className={styles.leftTitle}>
              Welcome
              <br />

              <span className={styles.greenText}>
                back to AgriOptix.
              </span>
            </h1>

            <p className={styles.leftDescription}>
              Continue moving fresh produce from farms
              to markets with a trusted transport network.
            </p>

            <div className={styles.features}>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  🚚
                </div>

                <div className={styles.featureText}>
                  Transport
                  <br />
                  Opportunities
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  ₹
                </div>

                <div className={styles.featureText}>
                  Secure
                  <br />
                  Payments
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  📍
                </div>

                <div className={styles.featureText}>
                  Route
                  <br />
                  Support
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  🌱
                </div>

                <div className={styles.featureText}>
                  Grow with
                  <br />
                  AgriOptix
                </div>
              </div>

            </div>
          </div>

          <div className={styles.quoteCard}>
            <div className={styles.quoteIcon}>
              🚛
            </div>

            <div>
              <strong>
                Keep agriculture moving.
              </strong>

              <p>
                Every delivery connects farmers,
                buyers and markets.
              </p>
            </div>
          </div>
        </aside>

        {/* ================= LOGIN FORM ================= */}

        <section className={styles.formPanel}>
          <div className={styles.formContainer}>

            <div className={styles.formIcon}>
              🚚
            </div>

            <h2 className={styles.formTitle}>
              Driver / Transporter Login
            </h2>

            <p className={styles.formSubtitle}>
              Sign in to manage your deliveries,
              routes and transport opportunities.
            </p>

            <form onSubmit={handleLogin}>

              {/* MOBILE NUMBER */}

              <div className={styles.field}>
                <label htmlFor="mobileNumber">
                  Mobile Number
                </label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    +91
                  </span>

                  <input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    placeholder="Enter 10 digit number"
                    maxLength={13}
                    autoComplete="tel"
                    onChange={(event) =>
                      setMobileNumber(
                        event.target.value
                      )
                    }
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className={styles.field}>
                <label htmlFor="password">
                  Password
                </label>

                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    🔒
                  </span>

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    required
                  />

                  <button
                    type="button"
                    className={styles.showButton}
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
              </div>

              {/* OPTIONS */}

              <div className={styles.options}>

                <label className={styles.remember}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className={styles.forgotButton}
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>

              </div>

              {/* MESSAGE */}

              {message && (
                <div className={styles.message}>
                  {message}
                </div>
              )}

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                className={styles.loginButton}
                disabled={isLoading}
              >
                {isLoading
                  ? "Logging in..."
                  : "Login"}

                {!isLoading && (
                  <span>
                    →
                  </span>
                )}
              </button>

            </form>

            {/* OTP */}

            <div className={styles.divider}>
              <span>or</span>
            </div>

            <button
              type="button"
              className={styles.otpButton}
              onClick={handleOTPLogin}
            >
              Login with OTP
            </button>

            {/* REGISTER */}

            <p className={styles.registerPrompt}>
              Don't have an AgriOptix account?

              <button
                type="button"
                className={styles.registerLink}
                onClick={goToRegister}
              >
                Create account
              </button>
            </p>

            {/* SECURITY */}

            <div className={styles.security}>
              🔒 Your information is protected
              with secure authentication.
            </div>

          </div>
        </section>

        {/* ================= RIGHT PANEL ================= */}

        <aside className={styles.rightPanel}>

          <div className={styles.rightIllustration}>

            <div className={styles.sun}></div>

            <div className={styles.hill}></div>

            <div className={styles.road}></div>

            <div className={styles.truck}>
              🚚
            </div>

          </div>

          <h2 className={styles.rightTitle}>
            Your journey
            <br />

            <span>
              continues here.
            </span>
          </h2>

          <p className={styles.rightDescription}>
            Access your transport opportunities,
            delivery assignments and route information
            from one place.
          </p>

          <div className={styles.benefits}>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                ✓
              </div>

              <div>
                <div className={styles.benefitTitle}>
                  Manage deliveries
                </div>

                <div className={styles.benefitText}>
                  View and manage assigned trips.
                </div>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                📍
              </div>

              <div>
                <div className={styles.benefitTitle}>
                  Track your routes
                </div>

                <div className={styles.benefitText}>
                  Get route and delivery information.
                </div>
              </div>
            </div>
            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                ₹
              </div>

              <div>
                <div className={styles.benefitTitle}>
                  Track earnings
                </div>

                <div className={styles.benefitText}>
                  Keep your transport earnings
                  organized.
                </div>
              </div>
            </div>

            <div className={styles.benefit}>
              <div className={styles.benefitIcon}>
                🌱
              </div>

              <div>
                <div className={styles.benefitTitle}>
                  Grow your network
                </div>

                <div className={styles.benefitText}>
                  Build reliable connections
                  across the supply chain.
                </div>
              </div>
            </div>

          </div>

          <div className={styles.bottomMessage}>
            Together for a stronger
            agricultural future.
          </div>

        </aside>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className={styles.footer}>
        <span>
          © AgriOptix — AI-Powered
          Farm-to-Market Platform
        </span>

        <span>
          Farmers · Buyers · Transporters ·
          Sustainable Tomorrow
        </span>
      </footer>

    </main>
  );
}