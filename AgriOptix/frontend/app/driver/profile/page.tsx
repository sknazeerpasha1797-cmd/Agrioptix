"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./DriverProfile.module.css";

type Driver = {
  id?: number;
  full_name?: string;
  fullName?: string;

  mobile_number?: string;
  mobileNumber?: string;

  preferred_language?: string;
  preferredLanguage?: string;

  current_location?: string;
  currentLocation?: string;

  vehicle_type?: string;
  vehicleType?: string;

  vehicle_number?: string;
  vehicleNumber?: string;

  driving_license_number?: string;
  drivingLicenseNumber?: string;

  license_expiry_date?: string;
  licenseExpiryDate?: string;

  vehicle_capacity?: string | number;
  vehicleCapacity?: string | number;

  experience?: string;
  availability?: string;

  preferred_routes?: string;
  preferredRoutes?: string;

  status?: string;
  account_status?: string;
};

type ProfileForm = {
  fullName: string;
  mobileNumber: string;
  preferredLanguage: string;
  currentLocation: string;
  vehicleType: string;
  vehicleNumber: string;
  vehicleCapacity: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  experience: string;
  availability: string;
  preferredRoutes: string;
};

function getDriverValue(
  driver: Driver,
  snakeKey: keyof Driver,
  camelKey: keyof Driver
): string {
  const value = driver[snakeKey] ?? driver[camelKey];

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

export default function DriverProfilePage() {
  const router = useRouter();

  const [driver, setDriver] = useState<Driver | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    mobileNumber: "",
    preferredLanguage: "",
    currentLocation: "",
    vehicleType: "",
    vehicleNumber: "",
    vehicleCapacity: "",
    drivingLicenseNumber: "",
    licenseExpiryDate: "",
    experience: "",
    availability: "",
    preferredRoutes: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      const storedDriver =
        localStorage.getItem("agrioptix_driver") ||
        sessionStorage.getItem("agrioptix_driver");

      if (!storedDriver) {
        router.replace("/driver/login");
        return;
      }

      const parsedDriver: Driver = JSON.parse(storedDriver);

      setDriver(parsedDriver);

      setForm({
        fullName: getDriverValue(
          parsedDriver,
          "full_name",
          "fullName"
        ),
        mobileNumber: getDriverValue(
          parsedDriver,
          "mobile_number",
          "mobileNumber"
        ),
        preferredLanguage: getDriverValue(
          parsedDriver,
          "preferred_language",
          "preferredLanguage"
        ),
        currentLocation: getDriverValue(
          parsedDriver,
          "current_location",
          "currentLocation"
        ),
        vehicleType: getDriverValue(
          parsedDriver,
          "vehicle_type",
          "vehicleType"
        ),
        vehicleNumber: getDriverValue(
          parsedDriver,
          "vehicle_number",
          "vehicleNumber"
        ),
        vehicleCapacity: getDriverValue(
          parsedDriver,
          "vehicle_capacity",
          "vehicleCapacity"
        ),
        drivingLicenseNumber: getDriverValue(
          parsedDriver,
          "driving_license_number",
          "drivingLicenseNumber"
        ),
        licenseExpiryDate: getDriverValue(
          parsedDriver,
          "license_expiry_date",
          "licenseExpiryDate"
        ),
        experience: getDriverValue(
          parsedDriver,
          "experience",
          "experience"
        ),
        availability: getDriverValue(
          parsedDriver,
          "availability",
          "availability"
        ),
        preferredRoutes: getDriverValue(
          parsedDriver,
          "preferred_routes",
          "preferredRoutes"
        ),
      });
    } catch (error) {
      console.error("Unable to load driver profile:", error);
      router.replace("/driver/login");
    }
  }, [router]);

  const initials = useMemo(() => {
    const name = form.fullName.trim();

    if (!name) {
      return "DR";
    }

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("");
  }, [form.fullName]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (!driver) return;

    const updatedDriver: Driver = {
      ...driver,

      full_name: form.fullName,
      mobile_number: form.mobileNumber,
      preferred_language: form.preferredLanguage,
      current_location: form.currentLocation,
      vehicle_type: form.vehicleType,
      vehicle_number: form.vehicleNumber,
      vehicle_capacity: form.vehicleCapacity,
      driving_license_number: form.drivingLicenseNumber,
      license_expiry_date: form.licenseExpiryDate,
      experience: form.experience,
      availability: form.availability,
      preferred_routes: form.preferredRoutes,
    };

    const localDriver = localStorage.getItem("agrioptix_driver");

    if (localDriver) {
      localStorage.setItem(
        "agrioptix_driver",
        JSON.stringify(updatedDriver)
      );
    }

    const sessionDriver = sessionStorage.getItem("agrioptix_driver");

    if (sessionDriver) {
      sessionStorage.setItem(
        "agrioptix_driver",
        JSON.stringify(updatedDriver)
      );
    }

    setDriver(updatedDriver);
    setIsEditing(false);
    setMessage("Profile updated successfully.");

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("agrioptix_driver");
    localStorage.removeItem("agrioptix_driver_token");

    sessionStorage.removeItem("agrioptix_driver");
    sessionStorage.removeItem("agrioptix_driver_token");

    router.replace("/driver/login");
  };

  const accountStatus =
    driver?.status ||
    driver?.account_status ||
    "ACTIVE";

  if (!driver) {
    return (
      <main className={styles.loadingPage}>
        <div className={styles.loader}></div>
        <p>Loading driver profile...</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow}></div>

      <header className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => router.push("/driver/dashboard")}
        >
          ←
        </button>

        <div className={styles.brandBlock}>
          <div className={styles.brand}>AgriOptix</div>
          <div className={styles.subtitle}>Driver Profile</div>
        </div>

        <div className={styles.stepBadge}>PROFILE</div>
      </header>

      <div className={styles.content}>
        {/* PROFILE HERO */}
        <section className={styles.profileHero}>
          <div className={styles.avatar}>{initials}</div>

          <div className={styles.profileIdentity}>
            <span className={styles.eyebrow}>DRIVER ACCOUNT</span>

            <h1>
              {form.fullName || "Driver"}
            </h1>

            <p>
              {form.vehicleType || "Transporter"}{" "}
              {form.vehicleNumber
                ? `• ${form.vehicleNumber}`
                : ""}
            </p>

            <div className={styles.status}>
              <span className={styles.statusDot}></span>
              {accountStatus}
            </div>
          </div>

          <button
            className={styles.editButton}
            onClick={() => {
              setIsEditing(!isEditing);
              setMessage("");
            }}
          >
            {isEditing ? "Cancel" : "✎ Edit Profile"}
          </button>
        </section>

        {message && (
          <div className={styles.successMessage}>
            <span>✓</span>
            {message}
          </div>
        )}

        {/* PERSONAL DETAILS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                PERSONAL INFORMATION
              </span>
              <h2>Driver Details</h2>
            </div>

            <span className={styles.sectionIcon}>👤</span>
          </div>

          <div className={styles.grid}>
            <ProfileField
              label="Full Name"
              value={form.fullName}
              editing={isEditing}
              onChange={(value) =>
                updateField("fullName", value)
              }
            />

            <ProfileField
              label="Mobile Number"
              value={form.mobileNumber}
              editing={isEditing}
              onChange={(value) =>
                updateField("mobileNumber", value)
              }
              type="tel"
            />

            <ProfileField
              label="Preferred Language"
              value={form.preferredLanguage}
              editing={isEditing}
              onChange={(value) =>
                updateField("preferredLanguage", value)
              }
            />

            <ProfileField
              label="Current Location"
              value={form.currentLocation}
              editing={isEditing}
              onChange={(value) =>
                updateField("currentLocation", value)
              }
            />
          </div>
        </section>

        {/* VEHICLE */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                VEHICLE INFORMATION
              </span>
              <h2>Transport Vehicle</h2>
            </div>

            <span className={styles.sectionIcon}>🚚</span>
          </div>

          <div className={styles.grid}>
            <ProfileField
              label="Vehicle Type"
              value={form.vehicleType}
              editing={isEditing}
              onChange={(value) =>
                updateField("vehicleType", value)
              }
            />

            <ProfileField
              label="Vehicle Number"
              value={form.vehicleNumber}
              editing={isEditing}
              onChange={(value) =>
                updateField("vehicleNumber", value)
              }
            />

            <ProfileField
              label="Vehicle Capacity"
              value={form.vehicleCapacity}
              editing={isEditing}
              onChange={(value) =>
                updateField("vehicleCapacity", value)
              }
            />

            <ProfileField
              label="Availability"
              value={form.availability}
              editing={isEditing}
              onChange={(value) =>
                updateField("availability", value)
              }
            />
          </div>
        </section>

        {/* DOCUMENTS */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionLabel}>
                DOCUMENTS
              </span>
              <h2>License Information</h2>
            </div>

            <span className={styles.sectionIcon}>🪪</span>
          </div>

          <div className={styles.grid}>
            <ProfileField
              label="Driving License Number"
              value={form.drivingLicenseNumber}
              editing={isEditing}
              onChange={(value) =>
                updateField(
                  "drivingLicenseNumber",
                  value
                )
              }
            />

            <ProfileField
              label="License Expiry"
              value={form.licenseExpiryDate}
              editing={isEditing}
              onChange={(value) =>
                updateField(
                  "licenseExpiryDate",
                  value
                )
              }
              type="date"
            />

            <ProfileField
              label="Driving Experience"
              value={form.experience}
              editing={isEditing}
              onChange={(value) =>
                updateField("experience", value)
              }
            />

            <ProfileField
              label="Preferred Routes"
              value={form.preferredRoutes}
              editing={isEditing}
              onChange={(value) =>
                updateField("preferredRoutes", value)
              }
            />
          </div>
        </section>

        {/* SAVE */}
        {isEditing && (
          <section className={styles.savePanel}>
            <div>
              <strong>Save your profile changes</strong>
              <p>
                Your updated profile will be stored on this
                demo device.
              </p>
            </div>

            <button
              className={styles.saveButton}
              onClick={handleSave}
            >
              Save Changes
            </button>
          </section>
        )}

        {/* ACCOUNT */}
        <section className={styles.accountSection}>
          <div>
            <span className={styles.sectionLabel}>
              ACCOUNT
            </span>
            <h2>Account & Support</h2>
            <p>
              Manage your driver account or contact
              AgriOptix Operations.
            </p>
          </div>

          <div className={styles.accountActions}>
            <button
              className={styles.supportButton}
              onClick={() =>
                router.push("/driver/support")
              }
            >
              Support & Operations
              <span>→</span>
            </button>

            <button
              className={styles.logoutButton}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </section>

        <div className={styles.demoNote}>
          <span>DEMO</span>
          Profile editing is currently stored locally
          for the prototype. No password or authentication
          secrets are displayed here.
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className={styles.bottomNav}>
        <NavItem
          icon="⌂"
          label="Home"
          onClick={() =>
            router.push("/driver/dashboard")
          }
        />

        <NavItem
          icon="⌖"
          label="Route"
          onClick={() =>
            router.push("/driver/route")
          }
        />

        <NavItem
          icon="▣"
          label="Loads"
          onClick={() =>
            router.push("/driver/loads")
          }
        />

        <NavItem
          icon="₹"
          label="Earnings"
          onClick={() =>
            router.push("/driver/earnings")
          }
        />

        <NavItem
          icon="●"
          label="Profile"
          active
          onClick={() => {}}
        />
      </nav>
    </main>
  );
}

function ProfileField({
  label,
  value,
  editing,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className={styles.field}>
      <label>{label}</label>

      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
        />
      ) : (
        <div className={styles.fieldValue}>
          {value || "Not provided"}
        </div>
      )}
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`${styles.navItem} ${
        active ? styles.navActive : ""
      }`}
      onClick={onClick}
    >
      <span className={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}