"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyerLogin() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");

  function login() {
    const savedProfile = localStorage.getItem("buyerProfile");

    if (!identifier.trim()) {
      setError("Please enter your mobile number or email.");
      return;
    }

    if (!savedProfile) {
      setError(
        "No buyer account found. Please register first."
      );
      return;
    }

    const profile = JSON.parse(savedProfile);

    const matches =
      identifier.trim() === profile.mobile ||
      identifier.trim().toLowerCase() ===
        profile.email?.toLowerCase();

    if (!matches) {
      setError(
        "Mobile number or email does not match the registered buyer."
      );
      return;
    }

    router.push("/buyer/home");
  }

  return (
    <main className="login-page">

      {/* LEFT */}

      <section className="login-left">

        <div className="login-brand">
          <div className="login-logo">A</div>
          <span>AgriOptix</span>
        </div>

        <div className="login-hero">

          <p>BUYER PORTAL</p>

          <h1>
            Welcome
            <br />
            <span>back.</span>
          </h1>

          <div className="login-line" />

          <p className="login-description">
            Access your agricultural procurement workspace,
            manage sourcing and stay connected with your supply
            network.
          </p>

        </div>

        <div className="login-footer">
          Smart agriculture. Better procurement.
        </div>

      </section>

      {/* RIGHT */}

      <section className="login-right">

        <div className="login-card">

          <div className="login-card-top">

            <span>BUYER LOGIN</span>

            <div className="login-secure">
              🔒 Secure
            </div>

          </div>

          <h2>Sign in to AgriOptix</h2>

          <p className="login-subtitle">
            Enter the mobile number or email used during
            registration.
          </p>

          <label>
            Mobile Number / Email
          </label>

          <input
            type="text"
            value={identifier}
            placeholder="Enter mobile number or email"
            onChange={(event) => {
              setIdentifier(event.target.value);
              setError("");
            }}
          />

          {error && (
            <div className="login-error">
              ⚠ {error}
            </div>
          )}

          <button
            className="login-button"
            type="button"
            onClick={login}
          >
            Login →
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="register-button"
            type="button"
            onClick={() =>
              router.push("/buyer/onboarding")
            }
          >
            Create new buyer account
          </button>

          <p className="login-note">
            Don't have an account? Register as a buyer to
            start sourcing through AgriOptix.
          </p>

        </div>

      </section>

      <style jsx>{`
        * {
          box-sizing: border-box;
        }

        .login-page {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 45% 55%;
          background: #f5f8fc;
          color: #102a56;
        }

        .login-left {
          min-height: 100vh;
          padding: 40px 9%;
          background:
            radial-gradient(
              circle at 20% 15%,
              rgba(37, 99, 235, 0.12),
              transparent 30%
            ),
            linear-gradient(
              145deg,
              #eef6ff,
              #e1efff
            );
          display: flex;
          flex-direction: column;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 20px;
          font-weight: 800;
        }

        .login-logo {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #2563eb;
          color: white;
        }

        .login-hero {
          margin-top: auto;
          margin-bottom: auto;
        }

        .login-hero > p:first-child {
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.7px;
        }

        .login-hero h1 {
          margin: 14px 0;
          font-size: clamp(55px, 7vw, 85px);
          line-height: 0.95;
          letter-spacing: -4px;
        }

        .login-hero h1 span {
          color: #2563eb;
        }

        .login-line {
          width: 55px;
          height: 4px;
          margin: 25px 0;
          border-radius: 5px;
          background: #2563eb;
        }

        .login-description {
          max-width: 430px;
          color: #617997;
          font-size: 14px;
          line-height: 1.8;
        }

        .login-footer {
          color: #7188a4;
          font-size: 10px;
          border-top: 1px solid #cdddf0;
          padding-top: 18px;
        }

        .login-right {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 30px;
          background: white;
        }

        .login-card {
          width: min(450px, 100%);
          padding: 40px;
          border: 1px solid #dce5ef;
          border-radius: 18px;
          background: white;
          box-shadow:
            0 20px 50px rgba(30, 60, 100, 0.08);
        }

        .login-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .login-card-top > span {
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .login-secure {
          padding: 7px 10px;
          border-radius: 20px;
          background: #f0faf3;
          color: #25803e;
          font-size: 9px;
          font-weight: 800;
        }

        .login-card h2 {
          margin: 25px 0 8px;
          font-size: 29px;
          letter-spacing: -1px;
        }

        .login-subtitle {
          margin: 0 0 30px;
          color: #71839b;
          font-size: 12px;
          line-height: 1.6;
        }

        .login-card label {
          display: block;
          margin-bottom: 8px;
          color: #29466d;
          font-size: 11px;
          font-weight: 800;
        }

        .login-card input {
          width: 100%;
          height: 50px;
          padding: 0 14px;
          border: 1px solid #ccd9e8;
          border-radius: 10px;
          outline: none;
          font-family: inherit;
          font-size: 12px;
          color: #18375e;
        }

        .login-card input:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.08);
        }

        .login-error {
          margin-top: 12px;
          padding: 11px;
          border-radius: 9px;
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #be123c;
          font-size: 10px;
          font-weight: 700;
        }

        .login-button {
          width: 100%;
          height: 48px;
          margin-top: 18px;
          border: none;
          border-radius: 10px;
          background: #2563eb;
          color: white;
          font-family: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .login-button:hover {
          background: #1d4ed8;
        }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 25px 0;
          color: #a0adbc;
          font-size: 9px;
        }

        .divider::before,
        .divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e4eaf1;
        }

        .register-button {
          width: 100%;
          height: 48px;
          border: 1px solid #cbd9e8;
          border-radius: 10px;
          background: white;
          color: #2563eb;
          font-family: inherit;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .register-button:hover {
          background: #f5f9ff;
        }

        .login-note {
          margin: 20px 0 0;
          color: #8a98a9;
          font-size: 9px;
          line-height: 1.6;
          text-align: center;
        }

        @media (max-width: 750px) {
          .login-page {
            display: block;
          }

          .login-left {
            min-height: 42vh;
            padding: 25px;
          }

          .login-hero {
            margin: 55px 0 35px;
          }

          .login-hero h1 {
            font-size: 55px;
            letter-spacing: -3px;
          }

          .login-footer {
            display: none;
          }

          .login-right {
            min-height: 58vh;
            padding: 25px 18px;
          }

          .login-card {
            padding: 28px 22px;
          }
        }
      `}</style>

    </main>
  );
}