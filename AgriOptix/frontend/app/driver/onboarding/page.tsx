"use client";

import { FormEvent, useState } from "react";
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
};

export default function DriverRegisterPage() {
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
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");

  function updateField(
    field: keyof DriverForm,
    value: string
  ) {
    setForm((previousForm) => ({
      ...previousForm,
      [field]: value,
    }));
  }

  function handleNext(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (currentStep < 4) {
      setCurrentStep((previousStep) => previousStep + 1);
      setMessage("");
      return;
    }

    setMessage("Driver registration details are ready to submit.");

    /*
      Replace this section with your existing backend API request.

      Example:

      const response = await fetch(
        "http://127.0.0.1:8000/api/drivers/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Registration failed");
      }
    */
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((previousStep) => previousStep - 1);
    }
  }

  function handleSaveExit() {
    localStorage.setItem(
      "agrioptix_driver_registration",
      JSON.stringify(form)
    );

    setMessage("Your registration details have been saved.");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}>🌿</div>

          <span>AgriOptix</span>

          <span className={styles.tagline}>
            Smarter Farms. Better Futures.
          </span>
        </div>

        <div className={styles.loginText}>
          Already have an account?

          <button className={styles.loginButton}>
            Login
          </button>
        </div>
      </header>

      <section className={styles.layout}>
        <aside className={styles.leftPanel}>
          <div>
            <h1 className={styles.leftTitle}>
              Join as a
              <br />

              <span className={styles.greenText}>
                Driver / Transporter
              </span>
            </h1>

            <p className={styles.leftDescription}>
              Become a part of the agricultural supply chain.
              Transport fresh produce, earn consistently,
              and grow with AgriOptix.
            </p>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>🚚</div>

                <div className={styles.featureText}>
                  Reliable
                  <br />
                  Transport Network
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🛡️</div>

                <div className={styles.featureText}>
                  Secure
                  <br />
                  Payments
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>📍</div>

                <div className={styles.featureText}>
                  Flexible
                  <br />
                  Opportunities
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>🌱</div>

                <div className={styles.featureText}>
                  Support for
                  <br />
                  Your Journey
                </div>
              </div>
            </div>
          </div>

          <img
            src="/images/agrioptix-truck.png"
            alt="AgriOptix transport truck"
            className={styles.truckImage}
          />
        </aside>

        <section className={styles.formPanel}>
          <div className={styles.steps}>
            <div
              className={`${styles.step} ${
                currentStep >= 1 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepNumber}>
                1
              </div>

              Basic Details
            </div>

            <div
              className={`${styles.step} ${
                currentStep >= 2 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepNumber}>
                2
              </div>

              Vehicle & Documents
            </div>

            <div
              className={`${styles.step} ${
                currentStep >= 3 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepNumber}>
                3
              </div>

              Experience & Availability
            </div>

            <div
              className={`${styles.step} ${
                currentStep >= 4 ? styles.activeStep : ""
              }`}
            >
              <div className={styles.stepNumber}>
                4
              </div>

              Verification
            </div>
          </div>

          <h2 className={styles.formTitle}>
            Driver / Transporter Registration
          </h2>

          <p className={styles.formSubtitle}>
            Fill in your details to get started.
          </p>

          <form onSubmit={handleNext}>
            {currentStep === 1 && (
              <>
                <h3 className={styles.sectionTitle}>
                  Personal Information
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="fullName">
                      Full Name *
                    </label>

                    <input
                      id="fullName"
                      value={form.fullName}
                      placeholder="Enter your full name"
                      onChange={(event) =>
                        updateField(
                          "fullName",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="mobileNumber">
                      Mobile Number *
                    </label>

                    <input
                      id="mobileNumber"
                      value={form.mobileNumber}
                      placeholder="+91 Enter 10 digit number"
                      onChange={(event) =>
                        updateField(
                          "mobileNumber",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="preferredLanguage">
                      Preferred Language *
                    </label>

                    <select
                      id="preferredLanguage"
                      value={form.preferredLanguage}
                      onChange={(event) =>
                        updateField(
                          "preferredLanguage",
                          event.target.value
                        )
                      }
                    >
                      <option value="Telugu">
                        Telugu
                      </option>

                      <option value="Hindi">
                        Hindi
                      </option>

                      <option value="English">
                        English
                      </option>

                      <option value="Tamil">
                        Tamil
                      </option>

                      <option value="Kannada">
                        Kannada
                      </option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="currentLocation">
                      Current Location *
                    </label>

                    <input
                      id="currentLocation"
                      value={form.currentLocation}
                      placeholder="Enter your location"
                      onChange={(event) =>
                        updateField(
                          "currentLocation",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3 className={styles.sectionTitle}>
                  Vehicle Information
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="vehicleType">
                      Vehicle Type *
                    </label>

                    <select
                      id="vehicleType"
                      value={form.vehicleType}
                      onChange={(event) =>
                        updateField(
                          "vehicleType",
                          event.target.value
                        )
                      }
                    >
                      <option value="1-Ton Truck">
                        1-Ton Truck
                      </option>

                      <option value="Mini Truck">
                        Mini Truck
                      </option>

                      <option value="Pickup Van">
                        Pickup Van
                      </option>

                      <option value="3-Ton Truck">
                        3-Ton Truck
                      </option>

                      <option value="6-Ton Truck">
                        6-Ton Truck
                      </option>

                      <option value="Refrigerated Truck">
                        Refrigerated Truck
                      </option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="vehicleNumber">
                      Vehicle Number *
                    </label>

                    <input
                      id="vehicleNumber"
                      value={form.vehicleNumber}
                      placeholder="TS 09 AB 1234"
                      onChange={(event) =>
                        updateField(
                          "vehicleNumber",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="drivingLicenseNumber">
                      Driving License Number *
                    </label>

                    <input
                      id="drivingLicenseNumber"
                      value={form.drivingLicenseNumber}
                      placeholder="Enter license number"
                      onChange={(event) =>
                        updateField(
                          "drivingLicenseNumber",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="licenseExpiryDate">
                      License Expiry Date *
                    </label>

                    <input
                      id="licenseExpiryDate"
                      type="date"
                      value={form.licenseExpiryDate}
                      onChange={(event) =>
                        updateField(
                          "licenseExpiryDate",
                          event.target.value
                        )
                      }
                      required
                    />
                  </div>

                  <div
                    className={`${styles.field} ${styles.fullWidth}`}
                  >
                    <label htmlFor="vehicleCapacity">
                      Vehicle Capacity *
                    </label>

                    <select
                      id="vehicleCapacity"
                      value={form.vehicleCapacity}
                      onChange={(event) =>
                        updateField(
                          "vehicleCapacity",
                          event.target.value
                        )
                      }
                      required
                    >
                      <option value="">
                        Select capacity
                      </option>

                      <option value="500 kg">
                        500 kg
                      </option>

                      <option value="1 Ton">
                        1 Ton
                      </option>

                      <option value="2 Ton">
                        2 Ton
                      </option>

                      <option value="3 Ton">
                        3 Ton
                      </option>

                      <option value="5 Ton">
                        5 Ton
                      </option>

                      <option value="10 Ton">
                        10 Ton
                      </option>
                    </select>
                  </div>
                </div>
              </>
            )}
            )
            {currentStep === 3 && (
              <>
                <h3 className={styles.sectionTitle}>
                  Experience & Availability
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label htmlFor="experience">
                      Driving Experience
                    </label>

                    <select
                      id="experience"
                      defaultValue=""
                    >
                      <option value="">
                        Select experience
                      </option>

                      <option value="0-1">
                        Less than 1 year
                      </option>

                      <option value="1-3">
                        1–3 years
                      </option>

                      <option value="3-5">
                        3–5 years
                      </option>

                      <option value="5+">
                        More than 5 years
                      </option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="availability">
                      Availability
                    </label>

                    <select
                      id="availability"
                      defaultValue=""
                    >
                      <option value="">
                        Select availability
                      </option>

                      <option value="full-time">
                        Full-time
                      </option>

                      <option value="part-time">
                        Part-time
                      </option>

                      <option value="on-demand">
                        On-demand
                      </option>
                    </select>
                  </div>

                  <div
                    className={`${styles.field} ${styles.fullWidth}`}
                  >
                    <label htmlFor="preferredRoutes">
                      Preferred Delivery Routes
                    </label>

                    <input
                      id="preferredRoutes"
                      placeholder="Example: Hyderabad, Ranga Reddy, Sangareddy"
                    />
                  </div>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h3 className={styles.sectionTitle}>
                  Review Your Information
                </h3>

                <div className={styles.formGrid}>
                  <div className={styles.field}>
                    <label>Full Name</label>

                    <input
                      value={form.fullName}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Mobile Number</label>

                    <input
                      value={form.mobileNumber}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Vehicle Type</label>

                    <input
                      value={form.vehicleType}
                      readOnly
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Vehicle Number</label>

                    <input
                      value={form.vehicleNumber}
                      readOnly
                    />
                  </div>

                  <div
                    className={`${styles.field} ${styles.fullWidth}`}
                  >
                    <label>Location</label>

                    <input
                      value={form.currentLocation}
                      readOnly
                    />
                  </div>
                </div>
              </>
            )}

            {message && <p>{message}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.saveButton}
                onClick={handleSaveExit}
              >
                Save & Exit
              </button>

              <div>
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
                  type="submit"
                  className={styles.nextButton}
                >
                  {currentStep === 4
                    ? "Create Account"
                    : "Next →"}
                </button>
              </div>
            </div>
          </form>
        </section>

        <aside className={styles.rightPanel}>
          <img
            src="/images/driver-road.png"
            alt="Driver transporting agricultural produce"
            className={styles.rightImage}
          />

          <h2 className={styles.rightTitle}>
            Drive your way
            <br />
            to a better tomorrow.
          </h2>

          <p className={styles.rightDescription}>
            Join AgriOptix as a driver or transporter and
            help farmers get their produce to market safely,
            on time, and with trust.
          </p>

          <h3 className={styles.benefitsTitle}>
            Why partner with us?
          </h3>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              ✓
            </div>

            <div>
              <div className={styles.benefitTitle}>
                Steady demand
              </div>

              <div className={styles.benefitText}>
                Get access to transport opportunities.
              </div>
            </div>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              ₹
            </div>

            <div>
              <div className={styles.benefitTitle}>
                On-time payments
              </div>

              <div className={styles.benefitText}>
                Transparent and milestone-based payments.
              </div>
            </div>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              📄
            </div>

            <div>
              <div className={styles.benefitTitle}>
                Easy onboarding
              </div>

              <div className={styles.benefitText}>
                Complete registration with minimal paperwork.
              </div>
            </div>
          </div>

          <div className={styles.benefit}>
            <div className={styles.benefitIcon}>
              📍
            </div>

            <div>
              <div className={styles.benefitTitle}>
                GPS tracking
              </div>

              <div className={styles.benefitText}>
                Support safe and secure deliveries.
              </div>
            </div>
          </div>
        </aside>
      </section>

      <footer className={styles.footer}>
        <span>
          © AgriOptix — AI-Powered Farm-to-Market Platform
        </span>

        <span>
          Farmers · Buyers · Transporters · Sustainable Tomorrow
        </span>
      </footer>
    </main>
  );
}