"use client";

import { useState } from "react";
import styles from "./DriverRegister.module.css";

type DriverForm = {
  fullName: string;
  mobileNumber: string;
  preferredLanguage: string;
  currentLocation: string;
  vehicleType: string;
  vehicleNumber: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  vehicleCapacity: string;
  experience: string;
  availability: string;
  preferredRoutes: string;
  password: string;
  confirmPassword: string;
};

export default function DriverOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState<DriverForm>({
    fullName: "Suresh Reddy",
    mobileNumber: "",
    preferredLanguage: "Telugu",
    currentLocation: "",
    vehicleType: "1-Ton Truck",
    vehicleNumber: "TS 09 AB 1234",
    drivingLicenseNumber: "",
    licenseExpiryDate: "",
    vehicleCapacity: "",
    experience: "",
    availability: "",
    preferredRoutes: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField<K extends keyof DriverForm>(
    field: K,
    value: DriverForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function goToLogin() {
    window.location.href = "/driver/login";
  }

  function validateStepOne() {
    if (!form.fullName.trim()) {
      setMessage("Please enter your full name.");
      return false;
    }

    const mobile = form.mobileNumber.replace(/\D/g, "").slice(-10);

    if (mobile.length !== 10) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return false;
    }

    updateField("mobileNumber", mobile);

    if (!form.preferredLanguage) {
      setMessage("Please select your preferred language.");
      return false;
    }

    return true;
  }

  function validateStepTwo() {
    if (!form.vehicleType.trim()) {
      setMessage("Please select your vehicle type.");
      return false;
    }

    if (!form.vehicleNumber.trim()) {
      setMessage("Please enter your vehicle number.");
      return false;
    }

    return true;
  }

  function validateStepThree() {
    if (!form.experience.trim()) {
      setMessage("Please enter your driving experience.");
      return false;
    }

    if (!form.availability.trim()) {
      setMessage("Please select your availability.");
      return false;
    }

    return true;
  }

  function validateStepFour() {
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }

    return true;
  }

  function handleNext() {
    setMessage("");

    if (currentStep === 1 && !validateStepOne()) {
      return;
    }

    if (currentStep === 2 && !validateStepTwo()) {
      return;
    }

    if (currentStep === 3 && !validateStepThree()) {
      return;
    }

    setCurrentStep((previous) => Math.min(previous + 1, 4));
  }

  function handleBack() {
    setMessage("");
    setCurrentStep((previous) => Math.max(previous - 1, 1));
  }

  async function handleSubmit() {
    setMessage("");

    if (!validateStepFour()) {
      return;
    }

    setIsSubmitting(true);

    const mobile = form.mobileNumber.replace(/\D/g, "").slice(-10);

    const registrationData = {
      fullName: form.fullName,
      mobileNumber: mobile,
      preferredLanguage: form.preferredLanguage,
      currentLocation: form.currentLocation,
      vehicleType: form.vehicleType,
      vehicleNumber: form.vehicleNumber,
      drivingLicenseNumber: form.drivingLicenseNumber,
      licenseExpiryDate: form.licenseExpiryDate,
      vehicleCapacity: form.vehicleCapacity,
      experience: form.experience,
      availability: form.availability,
      preferredRoutes: form.preferredRoutes,
      password: form.password,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/drivers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registrationData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.detail || "Registration failed. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      setMessage(
        "Driver registration successful! Redirecting to login..."
      );

      setTimeout(() => {
        window.location.href = "/driver/login";
      }, 1200);
    } catch (error) {
      console.error("Driver registration error:", error);

      setMessage(
        "Unable to connect to the server. Please make sure the backend is running."
      );

      setIsSubmitting(false);
    }
  }
  function handleSaveAndExit() {
    const { password, confirmPassword, ...safeForm } = form;

    localStorage.setItem(
      "agrioptix_driver_registration",
      JSON.stringify(safeForm)
    );

    setMessage("Your registration details have been saved.");
  }

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>A</div>

          <div>
            <h1>AgriOptix</h1>
            <p className={styles.tagline}>
              Intelligent Farm-to-Market Optimization
            </p>
          </div>
        </div>

        <div className={styles.loginText}>
          Already have an account?
          <button
            type="button"
            className={styles.loginButton}
            onClick={goToLogin}
          >
            Login
          </button>
        </div>
      </header>

      <div className={styles.layout}>

        {/* LEFT PANEL */}
        <aside className={styles.leftPanel}>
          <h2 className={styles.leftTitle}>
            Drive the <span className={styles.greenText}>Future</span> of
            Agriculture
          </h2>

          <p className={styles.leftDescription}>
            Join AgriOptix and help farmers move their fresh produce
            faster, smarter, and more efficiently.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🚚</div>

              <div className={styles.featureText}>
                <strong>Smart Route Planning</strong>
                <span>
                  Get optimized routes based on pickup and delivery
                  locations.
                </span>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>📦</div>

              <div className={styles.featureText}>
                <strong>Verified Loads</strong>
                <span>
                  Receive reliable agricultural transport requests.
                </span>
              </div>
            </div>

            <div className={styles.feature}>
              <div className={styles.featureIcon}>💰</div>

              <div className={styles.featureText}>
                <strong>Transparent Earnings</strong>
                <span>
                  Know your trip details and expected earnings.
                </span>
              </div>
            </div>
          </div>

          <img
            src="/images/agrioptix-truck.png"
            alt="AgriOptix transport truck"
            className={styles.truckImage}
          />
        </aside>

        {/* FORM PANEL */}
        <main className={styles.formPanel}>

          {/* STEPS */}
          <div className={styles.steps}>
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`${styles.step} ${
                  currentStep === step ? styles.activeStep : ""
                }`}
              >
                <div className={styles.stepNumber}>{step}</div>

                <span>
                  {step === 1 && "Basic Details"}
                  {step === 2 && "Vehicle & Documents"}
                  {step === 3 && "Experience"}
                  {step === 4 && "Verification"}
                </span>
              </div>
            ))}
          </div>

          <h2 className={styles.formTitle}>
            {currentStep === 1 && "Tell us about yourself"}
            {currentStep === 2 && "Vehicle & document details"}
            {currentStep === 3 && "Experience & availability"}
            {currentStep === 4 && "Create your driver account"}
          </h2>

          <p className={styles.formSubtitle}>
            {currentStep === 1 &&
              "Enter your basic information to get started."}

            {currentStep === 2 &&
              "Provide the details of the vehicle you will use."}

            {currentStep === 3 &&
              "Tell us about your driving experience and availability."}

            {currentStep === 4 &&
              "Review your information and create a secure password."}
          </p>

          {message && (
            <div
              style={{
                marginBottom: "20px",
                padding: "12px 16px",
                borderRadius: "10px",
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #bbf7d0",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div>
              <h3 className={styles.sectionTitle}>
                Basic Details
              </h3>

              <div className={styles.formGrid}>

                <div className={styles.field}>
                  <label>Full Name</label>

                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) =>
                      updateField("fullName", e.target.value)
                    }
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.field}>
                  <label>Mobile Number</label>

                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) =>
                      updateField("mobileNumber", e.target.value)
                    }
                    placeholder="10-digit mobile number"
                    maxLength={15}
                  />
                </div>

                <div className={styles.field}>
                  <label>Preferred Language</label>

                  <select
                    value={form.preferredLanguage}
                    onChange={(e) =>
                      updateField(
                        "preferredLanguage",
                        e.target.value
                      )
                    }
                  >
                    <option value="Telugu">Telugu</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Current Location</label>

                  <input
                    type="text"
                    value={form.currentLocation}
                    onChange={(e) =>
                      updateField(
                        "currentLocation",
                        e.target.value
                      )
                    }
                    placeholder="City / Village"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div>
              <h3 className={styles.sectionTitle}>
                Vehicle & Documents
              </h3>

              <div className={styles.formGrid}>

                <div className={styles.field}>
                  <label>Vehicle Type</label>

                  <select
                    value={form.vehicleType}
                    onChange={(e) =>
                      updateField("vehicleType", e.target.value)
                    }
                  >
                    <option value="1-Ton Truck">
                      1-Ton Truck
                    </option>

                    <option value="2-Ton Truck">
                      2-Ton Truck
                    </option>

                    <option value="Mini Truck">
                      Mini Truck
                    </option>

                    <option value="Pickup">
                      Pickup
                    </option>

                    <option value="Tractor">
                      Tractor
                    </option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Vehicle Number</label>

                  <input
                    type="text"
                    value={form.vehicleNumber}
                    onChange={(e) =>
                      updateField(
                        "vehicleNumber",
                        e.target.value
                      )
                    }
                    placeholder="TS 09 AB 1234"
                  />
                </div>

                <div className={styles.field}>
                  <label>Driving License Number</label>

                  <input
                    type="text"
                    value={form.drivingLicenseNumber}
                    onChange={(e) =>
                      updateField(
                        "drivingLicenseNumber",
                        e.target.value
                      )
                    }
                    placeholder="Enter license number"
                  />
                </div>

                <div className={styles.field}>
                  <label>License Expiry Date</label>

                  <input
                    type="date"
                    value={form.licenseExpiryDate}
                    onChange={(e) =>
                      updateField(
                        "licenseExpiryDate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div
                  className={`${styles.field} ${styles.fullWidth}`}
                >
                  <label>Vehicle Capacity</label>

                  <input
                    type="text"
                    value={form.vehicleCapacity}
                    onChange={(e) =>
                      updateField(
                        "vehicleCapacity",
                        e.target.value
                      )
                    }
                    placeholder="Example: 1000 kg"
                  />
                </div>

              </div>
            </div>
          )}
          {/* STEP 3 */}
          {currentStep === 3 && (
            <div>
              <h3 className={styles.sectionTitle}>
                Experience & Availability
              </h3>

              <div className={styles.formGrid}>

                <div className={styles.field}>
                  <label>Driving Experience</label>

                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) =>
                      updateField(
                        "experience",
                        e.target.value
                      )
                    }
                    placeholder="Example: 5 years"
                  />
                </div>

                <div className={styles.field}>
                  <label>Availability</label>

                  <select
                    value={form.availability}
                    onChange={(e) =>
                      updateField(
                        "availability",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select availability
                    </option>

                    <option value="Full Time">
                      Full Time
                    </option>

                    <option value="Part Time">
                      Part Time
                    </option>

                    <option value="Weekends">
                      Weekends
                    </option>
                  </select>
                </div>

                <div
                  className={`${styles.field} ${styles.fullWidth}`}
                >
                  <label>Preferred Routes</label>

                  <input
                    type="text"
                    value={form.preferredRoutes}
                    onChange={(e) =>
                      updateField(
                        "preferredRoutes",
                        e.target.value
                      )
                    }
                    placeholder="Example: Hyderabad → Ranga Reddy"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div>
              <h3 className={styles.sectionTitle}>
                Create Account
              </h3>

              <div className={styles.formGrid}>

                <div className={styles.field}>
                  <label>Password</label>

                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      value={form.password}
                      onChange={(e) =>
                        updateField(
                          "password",
                          e.target.value
                        )
                      }
                      placeholder="Minimum 6 characters"
                      style={{
                        width: "100%",
                        paddingRight: "75px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#166534",
                        fontSize: "13px",
                      }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Confirm Password</label>

                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={form.confirmPassword}
                      onChange={(e) =>
                        updateField(
                          "confirmPassword",
                          e.target.value
                        )
                      }
                      placeholder="Re-enter your password"
                      style={{
                        width: "100%",
                        paddingRight: "75px",
                      }}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      style={{
                        position: "absolute",
                        right: "10px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        color: "#166534",
                        fontSize: "13px",
                      }}
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

              </div>

              <div
                style={{
                  marginTop: "24px",
                  padding: "16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <strong>Registration Summary</strong>

                <p>
                  <b>Name:</b> {form.fullName}
                </p>

                <p>
                  <b>Mobile:</b> {form.mobileNumber}
                </p>

                <p>
                  <b>Vehicle:</b> {form.vehicleNumber}
                </p>

                <p>
                  <b>Vehicle Type:</b> {form.vehicleType}
                </p>

                <p>
                  <b>Experience:</b> {form.experience}
                </p>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className={styles.actions}>

            {currentStep > 1 && (
              <button
                type="button"
                className={styles.backButton}
                onClick={handleBack}
              >
                Back
              </button>
            )}

            <button
              type="button"
              className={styles.saveButton}
              onClick={handleSaveAndExit}
            >
              Save & Exit
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleNext}
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                className={styles.nextButton}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Creating Account..."
                  : "Create Driver Account"}
              </button>
            )}

          </div>
        </main>

        {/* RIGHT PANEL */}
        <aside className={styles.rightPanel}>
          <img
            src="/images/driver-road.png"
            alt="Driver on agricultural transport route"
            className={styles.rightImage}
          />

          <h2 className={styles.rightTitle}>
            Move Fresh Produce.
            <br />
            Make an Impact.
          </h2>

          <p className={styles.rightDescription}>
            Every successful delivery helps farmers reduce losses,
            reach buyers faster, and earn better returns.
          </p>

          <h3 className={styles.benefitsTitle}>
            Driver Benefits
          </h3>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>✓</div>

            <div>
              <div className={styles.benefitTitle}>
                Smart Matching
              </div>

              <div className={styles.benefitText}>
                Get transport opportunities that match your
                vehicle and route.
              </div>
            </div>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>✓</div>

            <div>
              <div className={styles.benefitTitle}>
                Less Empty Travel
              </div>

              <div className={styles.benefitText}>
                Optimized routes can reduce unnecessary travel.
              </div>
            </div>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>✓</div>

            <div>
              <div className={styles.benefitTitle}>
                Transparent Work
              </div>

              <div className={styles.benefitText}>
                See pickup, delivery, and trip information clearly.
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer className={styles.footer}>
        © 2026 AgriOptix. Intelligent Farm-to-Market Optimization.
      </footer>
    </div>
  );
}