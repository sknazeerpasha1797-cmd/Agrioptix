"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./buyer.css";

type BuyerForm = {
  ownerName: string;
  mobile: string;
  email: string;
  language: string;
  location: string;
  businessName: string;
  businessType: string;
  crops: string;
};

const steps = [
  "Basic Details",
  "Business",
  "Procurement",
  "Review",
];

export default function BuyerOnboarding() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  const [form, setForm] = useState<BuyerForm>({
    ownerName: "",
    mobile: "",
    email: "",
    language: "English",
    location: "",
    businessName: "",
    businessType: "",
    crops: "",
  });

  function update(field: keyof BuyerForm, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  }

  function validate() {
    if (step === 1) {
      if (!form.ownerName.trim()) {
        setError("Please enter your full name.");
        return false;
      }

      if (!/^\d{10}$/.test(form.mobile)) {
        setError("Please enter a valid 10 digit mobile number.");
        return false;
      }

      if (!form.location.trim()) {
        setError("Please enter your location.");
        return false;
      }
    }

    if (step === 2) {
      if (!form.businessName.trim()) {
        setError("Please enter your business name.");
        return false;
      }

      if (!form.businessType) {
        setError("Please select your business type.");
        return false;
      }
    }

    if (step === 3) {
      if (!form.crops.trim()) {
        setError("Please enter the crops or produce you procure.");
        return false;
      }
    }

    return true;
  }

  function nextStep() {
    if (!validate()) return;

    if (step < 4) {
      setStep((current) => current + 1);
      return;
    }

    localStorage.setItem("buyerProfile", JSON.stringify(form));

    router.push("/buyer/home");
  }

  function previousStep() {
    setError("");

    if (step > 1) {
      setStep((current) => current - 1);
    }
  }

  return (
    <div className="buyer-page">

      {/* LEFT BRAND PANEL */}

      <aside className="buyer-left">
        <div className="brand">
          <div className="brand-logo">A</div>
          <span>AgriOptix</span>
        </div>

        <div className="left-content">
          <p className="eyebrow">BUYER REGISTRATION</p>

          <h1>
            Source fresh.
            <br />
            <span>Buy smarter.</span>
          </h1>

          <p className="left-description">
            Connect with farmers, discover fresh agricultural produce
            and manage your procurement through AgriOptix.
          </p>

          <div className="left-features">
            <div>
              <strong>✓ Verified farmers</strong>
              <p>Connect with trusted agricultural suppliers.</p>
            </div>

            <div>
              <strong>✓ Smart procurement</strong>
              <p>Find produce according to your requirements.</p>
            </div>

            <div>
              <strong>✓ Connected logistics</strong>
              <p>Keep sourcing and delivery organized.</p>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER */}

      <main className="buyer-main">

        <div className="registration-container">

          <div className="top-header">
            <div>
              <p className="small-label">BUYER PORTAL</p>

              <h2>Create your buyer account</h2>
            </div>

            <button
              className="login-link"
              type="button"
              onClick={() => router.push("/buyer/login")}
            >
              Already registered? <b>Login</b>
            </button>
          </div>

          {/* STEPS */}

          <div className="steps">

            {steps.map((label, index) => {
              const number = index + 1;

              return (
                <div className="step-item" key={label}>

                  <div
                    className={`step-circle ${
                      step >= number ? "active" : ""
                    }`}
                  >
                    {step > number ? "✓" : number}
                  </div>

                  <span
                    className={
                      step >= number ? "step-text active" : "step-text"
                    }
                  >
                    {label}
                  </span>

                  {number < steps.length && (
                    <div
                      className={
                        step > number
                          ? "step-line active"
                          : "step-line"
                      }
                    />
                  )}

                </div>
              );
            })}

          </div>

          {/* FORM CARD */}

          <section className="registration-card">

            <div className="card-header">

              <div>
                <span className="step-count">
                  STEP {step} OF 4
                </span>

                <h3>
                  {step === 1 && "Tell us about you"}
                  {step === 2 && "Tell us about your business"}
                  {step === 3 && "Your procurement requirements"}
                  {step === 4 && "Review your information"}
                </h3>

                <p>
                  {step === 1 &&
                    "Enter your basic contact information."}

                  {step === 2 &&
                    "Tell us about the business you represent."}

                  {step === 3 &&
                    "Tell us what agricultural produce you purchase."}

                  {step === 4 &&
                    "Check your details before completing registration."}
                </p>
              </div>

              <div className="secure-badge">
                🔒 Secure
              </div>

            </div>

            {/* STEP 1 */}

            {step === 1 && (
              <div className="form-grid">

                <Field
                  label="Owner / Contact Name"
                  required
                  value={form.ownerName}
                  placeholder="Enter your full name"
                  onChange={(value) =>
                    update("ownerName", value)
                  }
                />

                <Field
                  label="Mobile Number"
                  required
                  value={form.mobile}
                  placeholder="10 digit mobile number"
                  onChange={(value) =>
                    update("mobile", value.replace(/\D/g, "").slice(0, 10))
                  }
                />

                <Field
                  label="Email Address"
                  value={form.email}
                  placeholder="you@example.com"
                  onChange={(value) =>
                    update("email", value)
                  }
                />

                <div className="field">
                  <label>Preferred Language</label>

                  <select
                    value={form.language}
                    onChange={(event) =>
                      update("language", event.target.value)
                    }
                  >
                    <option>English</option>
                    <option>Telugu</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <Field
                  label="Current Location"
                  required
                  value={form.location}
                  placeholder="City / town / district"
                  full
                  onChange={(value) =>
                    update("location", value)
                  }
                />

              </div>
            )}

            {/* STEP 2 */}

            {step === 2 && (
              <div className="form-grid">

                <Field
                  label="Business Name"
                  required
                  value={form.businessName}
                  placeholder="Example: Hyderabad Fresh Mart"
                  full
                  onChange={(value) =>
                    update("businessName", value)
                  }
                />

                <div className="field">

                  <label>
                    Business Type <span>*</span>
                  </label>

                  <select
                    value={form.businessType}
                    onChange={(event) =>
                      update(
                        "businessType",
                        event.target.value
                      )
                    }
                  >
                    <option value="">
                      Select business type
                    </option>

                    <option>Retailer</option>
                    <option>Wholesaler</option>
                    <option>Supermarket</option>
                    <option>Restaurant</option>
                    <option>Food Processor</option>
                    <option>Distributor</option>
                    <option>Other</option>
                  </select>

                </div>

                <div className="info-box">
                  <strong>Why do we ask?</strong>

                  <p>
                    Your business type helps AgriOptix understand
                    your procurement requirements.
                  </p>
                </div>

              </div>
            )}

            {/* STEP 3 */}

            {step === 3 && (
              <div className="single-field">

                <label>
                  Produce / Crops You Procure <span>*</span>
                </label>

                <textarea
                  value={form.crops}
                  onChange={(event) =>
                    update("crops", event.target.value)
                  }
                  placeholder="Example: Tomato, Onion, Potato, Chilli"
                  rows={6}
                />

                <div className="helper">
                  ✓ You can update these requirements later.
                </div>

              </div>
            )}

            {/* STEP 4 */}

            {step === 4 && (
              <div className="review-grid">

                <Review
                  label="Owner / Contact"
                  value={form.ownerName}
                />

                <Review
                  label="Mobile"
                  value={form.mobile}
                />

                <Review
                  label="Email"
                  value={form.email || "Not provided"}
                />

                <Review
                  label="Language"
                  value={form.language}
                />

                <Review
                  label="Location"
                  value={form.location}
                />

                <Review
                  label="Business"
                  value={form.businessName}
                />

                <Review
                  label="Business Type"
                  value={form.businessType}
                />

                <Review
                  label="Procurement"
                  value={form.crops}
                  full
                />

              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="error">
                ⚠ {error}
              </div>
            )}

            {/* BUTTONS */}

            <div className="actions">

              {step > 1 ? (
                <button
                  className="back-button"
                  type="button"
                  onClick={previousStep}
                >
                  ← Back
                </button>
              ) : (
                <button
                  className="back-button"
                  type="button"
                  onClick={() =>
                    router.push("/buyer/login")
                  }
                >
                  Already registered?
                </button>
              )}

              <button
                className="continue-button"
                type="button"
                onClick={nextStep}
              >
                {step === 4
                  ? "Complete Registration"
                  : "Continue →"}
              </button>

            </div>

            <div className="privacy">
              🔒 Your information is securely stored in your
              AgriOptix buyer profile.
            </div>

          </section>

        </div>

      </main>

      {/* RIGHT PANEL */}

      <aside className="buyer-right">

        <div className="right-card">

          <div className="right-icon">
            🛒
          </div>

          <p className="small-label">
            WHY AGRIOPTIX
          </p>

          <h2>
            Make every
            <br />
            purchase <span>smarter.</span>
          </h2>

          <p className="right-description">
            Build a reliable agricultural procurement network
            with better supply visibility.
          </p>

          <div className="right-benefit">
            <b>01</b>
            <div>
              <strong>Verified connections</strong>
              <p>Connect with farmers and suppliers.</p>
            </div>
          </div>

          <div className="right-benefit">
            <b>02</b>
            <div>
              <strong>Better visibility</strong>
              <p>Organize your procurement requirements.</p>
            </div>
          </div>

          <div className="right-benefit">
            <b>03</b>
            <div>
              <strong>Simple execution</strong>
              <p>Keep sourcing and delivery connected.</p>
            </div>
          </div>

        </div>

      </aside>

    </div>
  );
}

function Field({
  label,
  required,
  value,
  placeholder,
  onChange,
  full = false,
}: {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  full?: boolean;
}) {
  return (
    <div className={`field ${full ? "full" : ""}`}>
      <label>
        {label} {required && <span>*</span>}
      </label>

      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
}

function Review({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div className={`review-item ${full ? "full" : ""}`}>
      <span>{label}</span>
      <strong>{value || "Not provided"}</strong>
    </div>
  );
}