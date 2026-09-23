"use client";

import React from "react";

export default function HomePage() {
  const handleGetStarted = () => {
    window.location.href = "/role-selection";
  };

  const handleWatchDemo = () => {
    alert("Welcome to the AgriOptix Demo!");
  };

  return (
    <main className="landing-page">
      <div className="landing-container">

        {/* Complete AgriOptix landing image */}
        <img
          src="/hero-landing.jpg"
          alt="AgriOptix - Smarter Harvest, Better Decisions, Higher Returns"
          className="landing-image"
        />

        {/* =================================================
            INVISIBLE GET STARTED BUTTON
        ================================================= */}
        <button
          type="button"
          className="click-get-started"
          onClick={handleGetStarted}
          aria-label="Get Started"
        />

        {/* =================================================
            INVISIBLE WATCH DEMO BUTTON
        ================================================= */}
        <button
          type="button"
          className="click-watch-demo"
          onClick={handleWatchDemo}
          aria-label="Watch Demo"
        />

      </div>
    </main>
  );
}