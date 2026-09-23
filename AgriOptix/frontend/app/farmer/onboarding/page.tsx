"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Globe2,
  Leaf,
  LockKeyhole,
  MapPin,
  Mic,
  Phone,
  UserRound,
} from "lucide-react";
import { api, useWorkflow } from "../../../lib/store";

const STEPS = ["Basic Details", "Farm & Location", "Crops & Production", "Verification"];

type RegistrationForm = {
  name: string;
  mobile: string;
  language: string;
  password: string;
  village: string;
  farmSize: string;
  landType: string;
  crops: string;
  production: string;
};

const initialForm: RegistrationForm = {
  name: "",
  mobile: "",
  language: "Telugu",
  password: "",
  village: "",
  farmSize: "",
  landType: "Irrigated",
  crops: "",
  production: "",
};

export default function FarmerOnboarding() {
  const router = useRouter();
  const { setWf } = useWorkflow();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<RegistrationForm>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [voiceListening, setVoiceListening] = useState(false);

  const mobileDigits = useMemo(() => form.mobile.replace(/\D/g, ""), [form.mobile]);

  function update<K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setMessage("");
  }

  function validateCurrentStep() {
    if (step === 0) {
      if (!form.name.trim()) return "Please enter your full name.";
      if (!/^\d{10}$/.test(mobileDigits)) return "Enter a valid 10-digit mobile number.";
      if (form.password.length < 8) return "Password must contain at least 8 characters.";
    }
    if (step === 1) {
      if (!form.village.trim()) return "Please enter your village / farm location.";
      if (!form.farmSize.trim()) return "Please enter your farm size.";
    }
    if (step === 2) {
      if (!form.crops.trim()) return "Please enter at least one crop.";
      if (!form.production.trim()) return "Please enter your expected production.";
    }
    return "";
  }

  function nextStep() {
    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setStep((current) => Math.min(3, current + 1));
  }

  function previousStep() {
    setError("");
    setMessage("");
    setStep((current) => Math.max(0, current - 1));
  }

  function useLocation() {
    setError("");
    if (!navigator.geolocation) {
      setError("Current location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        update(
          "village",
          `Lat ${position.coords.latitude.toFixed(5)}, Lng ${position.coords.longitude.toFixed(5)}`
        );
        setMessage("Current location added.");
      },
      () => setError("Location permission was not granted.")
    );
  }

  function speakLocation() {
    const SpeechRecognition =
      (window as typeof window & { webkitSpeechRecognition?: any; SpeechRecognition?: any })
        .SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported by this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = form.language === "Telugu" ? "te-IN" : "en-IN";
    recognition.interimResults = false;
    setVoiceListening(true);
    recognition.onresult = (event: any) => {
      const text = event.results?.[0]?.[0]?.transcript || "";
      if (text) update("village", text);
      setVoiceListening(false);
    };
    recognition.onerror = () => {
      setVoiceListening(false);
      setError("Voice input could not be completed.");
    };
    recognition.onend = () => setVoiceListening(false);
    recognition.start();
  }

  async function submitRegistration(event?: FormEvent) {
    event?.preventDefault();
    const validation = validateCurrentStep();
    if (validation) {
      setError(validation);
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const result = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: form.name.trim(),
          mobile: mobileDigits,
          language: form.language,
          password: form.password,
          village: form.village.trim(),
          farm_size: form.farmSize.trim(),
          land_type: form.landType,
          crops: form.crops.trim(),
          production: form.production.trim(),
        }),
      });

      setWf({
        role: "farmer",
        farmer: {
          name: form.name.trim(),
          mobile: mobileDigits,
          language: form.language,
          village: form.village.trim(),
          crops: form.crops.trim(),
        },
      });

      setMessage(result.message || "Registration successful. Redirecting to login…");
      window.setTimeout(() => router.push("/login"), 700);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
      setSaving(false);
    }
  }

  return (
    <main className="farmer-register-page">
      <section className="register-visual" aria-label="AgriOptix farmer introduction">
        <img src="/agri-registration-visual.png" alt="AgriOptix farmer in a field" />
      </section>

      <section className="register-card-wrap">
        <div className="register-card">
          <header className="register-topbar">
            <button className="brand-link" onClick={() => router.push("/")} aria-label="AgriOptix home">
              <span className="register-logo"><Leaf size={20} /></span>
              <span><strong>AgriOptix</strong><small>Smarter Farms. Better Futures.</small></span>
            </button>
            <span className="login-link-copy">
              Already have an account? <button onClick={() => router.push("/login")}>Login</button>
            </span>
          </header>

          <div className="register-progress" aria-label="Registration progress">
            {STEPS.map((label, index) => (
              <div className={`progress-item ${index <= step ? "active" : ""}`} key={label}>
                <div className="progress-node">{index < step ? <Check size={15} /> : index + 1}</div>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="register-content">
            <div className="register-form-column">
              <span className="register-eyebrow">FARMER REGISTRATION</span>
              <h1>Farmer Registration</h1>
              <p className="register-subtitle">Your journey to better markets starts here.</p>

              <form onSubmit={step === 3 ? submitRegistration : (e) => { e.preventDefault(); nextStep(); }}>
                {step === 0 && (
                  <div className="field-grid">
                    <Field icon={<UserRound size={17} />} label="Full Name" required>
                      <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Enter your full name" autoComplete="name" />
                    </Field>
                    <Field icon={<Phone size={17} />} label="Mobile Number" required>
                      <div className="mobile-input">
                        <span>+91</span>
                        <input value={form.mobile.replace(/^\+?91\s?/, "")} onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="Enter 10 digit number" inputMode="numeric" autoComplete="tel" />
                      </div>
                    </Field>
                    <Field icon={<Globe2 size={17} />} label="Preferred Language" required>
                      <select value={form.language} onChange={(e) => update("language", e.target.value)}>
                        <option>Telugu</option><option>English</option><option>Hindi</option><option>Kannada</option><option>Marathi</option>
                      </select>
                    </Field>
                    <Field icon={<LockKeyhole size={17} />} label="Create Password" required>
                      <div className="password-input">
                        <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Minimum 8 characters" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                      </div>
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div className="stack-fields">
                    <Field icon={<MapPin size={17} />} label="Village / Farm Location" required>
                      <input value={form.village} onChange={(e) => update("village", e.target.value)} placeholder="Kothur, Mahabubnagar" />
                    </Field>
                    <div className="quick-row">
                      <button type="button" className="quick-action" onClick={useLocation}><MapPin size={19} /><span><b>Use Current Location</b><small>Use your device location</small></span></button>
                      <button type="button" className="quick-action" onClick={speakLocation}><Mic size={19} /><span><b>{voiceListening ? "Listening…" : "Speak Location"}</b><small>Voice input</small></span></button>
                    </div>
                    <div className="field-grid two">
                      <Field label="Farm Size (acres)" required><input value={form.farmSize} onChange={(e) => update("farmSize", e.target.value)} placeholder="e.g. 3.5" inputMode="decimal" /></Field>
                      <Field label="Land Type"><select value={form.landType} onChange={(e) => update("landType", e.target.value)}><option>Irrigated</option><option>Rainfed</option><option>Mixed</option></select></Field>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="stack-fields">
                    <Field icon={<Leaf size={17} />} label="Crops You Grow" required><input value={form.crops} onChange={(e) => update("crops", e.target.value)} placeholder="Tomato, Chilli, Onion" /></Field>
                    <Field label="Expected Production" required><input value={form.production} onChange={(e) => update("production", e.target.value)} placeholder="e.g. 5,000 kg per season" /></Field>
                    <div className="info-box"><Leaf size={18} /><div><b>Production details</b><span>These details help AgriOptix prepare better market, quality and logistics recommendations.</span></div></div>
                  </div>
                )}

                {step === 3 && (
                  <div className="review-panel">
                    <div className="review-title"><Check size={19} /> Review your registration</div>
                    <ReviewRow label="Full Name" value={form.name} />
                    <ReviewRow label="Mobile Number" value={`+91 ${mobileDigits}`} />
                    <ReviewRow label="Language" value={form.language} />
                    <ReviewRow label="Location" value={form.village} />
                    <ReviewRow label="Farm Size" value={`${form.farmSize} acres`} />
                    <ReviewRow label="Land Type" value={form.landType} />
                    <ReviewRow label="Crops" value={form.crops} />
                    <ReviewRow label="Production" value={form.production} />
                    <div className="verification-note"><LockKeyhole size={17} /><span>Your password is sent only to the existing authentication endpoint and is not stored in this browser workflow.</span></div>
                  </div>
                )}

                {error && <div className="form-message error">{error}</div>}
                {message && <div className="form-message success">{message}</div>}

                <div className="register-actions">
                  <button type="button" className="save-exit" onClick={() => router.push("/login")}>Save &amp; Exit</button>
                  {step > 0 && <button type="button" className="back-button" onClick={previousStep}><ArrowLeft size={17} /> Back</button>}
                  <button className="next-button" type="submit" disabled={saving}>
                    {saving ? "Creating account…" : step === 3 ? "Create Account" : "Next"} <ArrowRight size={17} />
                  </button>
                </div>
                <div className="secure-note"><LockKeyhole size={13} /> Your information is sent securely to the existing AgriOptix API.</div>
              </form>
            </div>

            <aside className="register-side-info">
              <div className="side-mini-art"><Leaf size={20} /></div>
              <h2>More than a platform,<br />it’s your farming partner.</h2>
              <p>We help you get the best price, reduce losses and connect with reliable buyers — so you can focus on what you do best.</p>
              <div className="side-rule" />
              <h3>What you’ll get</h3>
              {[
                ["AI quality assessment", "Know your produce quality"],
                ["Shelf-life prediction", "Sell before value is lost"],
                ["Best market matching", "Higher net realization"],
                ["Smart logistics", "Lower transport cost"],
                ["Secure payments", "On time, every time"],
              ].map(([title, text]) => <div className="benefit" key={title}><span><Check size={15} /></span><div><b>{title}</b><small>{text}</small></div></div>)}
              <div className="side-signoff">Together for a<br /><strong>stronger agriculture</strong> <Leaf size={16} /></div>
            </aside>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .farmer-register-page{min-height:100vh;background:#f5f8f4;display:grid;grid-template-columns:minmax(330px,.92fr) minmax(680px,1.55fr);font-family:"DM Sans",sans-serif;color:#183126}
        .register-visual{min-height:100vh;overflow:hidden;background:#e7f0e5;position:sticky;top:0;height:100vh}
        .register-visual img{width:100%;height:100%;object-fit:cover;object-position:left center;display:block}
        .register-card-wrap{padding:30px 28px;display:flex;align-items:center;justify-content:center;min-height:100vh}
        .register-card{width:min(100%,1080px);background:rgba(255,255,255,.96);border:1px solid #e3eae2;border-radius:24px;box-shadow:0 24px 70px rgba(29,57,39,.10);overflow:hidden}
        .register-topbar{display:flex;justify-content:space-between;align-items:center;padding:25px 32px 17px;border-bottom:1px solid #edf1ec;margin:0}
        .brand-link{border:0;background:transparent;padding:0;display:flex;align-items:center;gap:10px;color:#163326;cursor:pointer;text-align:left}.brand-link strong{display:block;font:800 24px/1 Manrope}.brand-link small{display:block;color:#597166;font-size:10px;margin-top:5px}.register-logo{width:39px;height:39px;border-radius:50%;background:#149b60;color:#fff;display:grid;place-items:center}.login-link-copy{font-size:12px;color:#63766b}.login-link-copy button{border:0;background:transparent;color:#148052;font-weight:800;cursor:pointer;margin-left:4px}
        .register-progress{display:grid;grid-template-columns:repeat(4,1fr);padding:24px 32px 12px;gap:10px}.progress-item{position:relative;text-align:center;color:#84938a;font-size:10px;font-weight:700}.progress-item:not(:last-child)::after{content:"";position:absolute;height:2px;background:#e6ece6;top:15px;left:58%;right:-42%;z-index:0}.progress-item.active:not(:last-child)::after{background:#80b78d}.progress-node{width:30px;height:30px;border-radius:50%;background:#eff3ef;color:#6e7e74;display:grid;place-items:center;margin:0 auto 7px;position:relative;z-index:1}.progress-item.active{color:#177c50}.progress-item.active .progress-node{background:#148f5b;color:#fff;box-shadow:0 0 0 5px #e4f3e9}
        .register-content{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(250px,.78fr);min-height:650px}.register-form-column{padding:26px 32px 32px}.register-eyebrow{font-size:10px;letter-spacing:1.8px;font-weight:800;color:#6b7c72}.register-form-column h1{font:800 31px/1.15 Manrope;letter-spacing:-.8px;color:#133326;margin:10px 0 5px}.register-subtitle{font-size:13px;color:#718078;margin:0 0 26px}.field-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px 22px}.field-grid.two{gap:15px}.stack-fields{display:grid;gap:18px}.field{display:block}.field-label{display:flex;align-items:center;gap:7px;color:#264337;font-size:11px;font-weight:700;margin-bottom:7px}.field-label svg{color:#5b776b}.required{color:#de725c}.field input,.field select{width:100%;height:49px;border:1px solid #dce5dc;background:#fbfcfb;border-radius:10px;padding:0 13px;outline:none;color:#263a31;font-size:12px;transition:.18s}.field input:focus,.field select:focus{border-color:#75ae87;box-shadow:0 0 0 3px #e6f3e9}.mobile-input{height:49px;border:1px solid #dce5dc;background:#fbfcfb;border-radius:10px;display:flex;align-items:center;padding-left:13px}.mobile-input span{font-size:12px;color:#5c7066;border-right:1px solid #dce5dc;padding-right:10px}.mobile-input input{border:0;background:transparent;height:46px;box-shadow:none!important}.password-input{position:relative}.password-input input{padding-right:42px}.password-input button{position:absolute;right:10px;top:50%;transform:translateY(-50%);border:0;background:transparent;color:#708178;cursor:pointer}.quick-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.quick-action{border:1px solid #e0e8e0;background:#fff;border-radius:11px;padding:12px;display:flex;align-items:center;gap:10px;text-align:left;color:#2d493b;cursor:pointer}.quick-action svg{color:#148a57;flex:none}.quick-action b{display:block;font-size:11px}.quick-action small{display:block;color:#829087;font-size:9px;margin-top:3px}.info-box{background:#f1f8ee;border:1px solid #e0eedb;border-radius:12px;padding:15px;display:flex;gap:10px;color:#47724f}.info-box div{display:grid;gap:4px}.info-box b{font-size:12px}.info-box span{font-size:10px;line-height:1.5;color:#728078}.review-panel{border:1px solid #e2e9e2;border-radius:14px;background:#fbfcfb;overflow:hidden}.review-title{padding:14px 16px;background:#edf7ed;color:#1a744a;font-weight:800;font-size:12px;display:flex;gap:8px;align-items:center}.review-row{display:flex;justify-content:space-between;gap:18px;padding:12px 16px;border-top:1px solid #edf1ed;font-size:11px}.review-row span{color:#78867e}.review-row b{text-align:right;color:#2c4035;max-width:60%}.verification-note{margin:13px 16px 16px;padding:11px 12px;border-radius:9px;background:#f2f6f2;color:#69786f;font-size:10px;line-height:1.45;display:flex;gap:8px}.form-message{margin-top:17px;padding:11px 13px;border-radius:9px;font-size:11px}.form-message.error{background:#fff1ee;color:#a34f3d;border:1px solid #f4d7cf}.form-message.success{background:#edf9ef;color:#28734a;border:1px solid #d5ecd9}.register-actions{display:flex;align-items:center;gap:10px;margin-top:24px}.save-exit,.back-button{border:0;background:transparent;color:#5d7467;font-weight:700;font-size:11px;cursor:pointer;padding:11px 2px}.back-button{display:flex;align-items:center;gap:5px;margin-left:auto}.next-button{min-width:190px;margin-left:auto;border:0;border-radius:11px;background:#14965e;color:#fff;padding:14px 20px;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 10px 22px #14965e25}.next-button:disabled{opacity:.65;cursor:not-allowed}.secure-note{margin-top:13px;text-align:center;color:#7b8980;font-size:9px;display:flex;align-items:center;justify-content:center;gap:5px}.register-side-info{background:linear-gradient(180deg,#f0f8ef,#fbfdf9);border-left:1px solid #e7eee7;padding:36px 27px 25px;position:relative}.side-mini-art{width:42px;height:42px;border-radius:50%;background:#dcefdc;color:#168754;display:grid;place-items:center;margin-bottom:17px}.register-side-info h2{font:800 19px/1.28 Manrope;color:#163a2b;margin:0 0 13px}.register-side-info p{font-size:11px;line-height:1.65;color:#66766d;margin:0}.side-rule{width:30px;height:2px;background:#15945d;margin:20px 0}.register-side-info h3{font:800 13px Manrope;margin:0 0 16px}.benefit{display:flex;gap:9px;margin:13px 0}.benefit>span{width:28px;height:28px;border-radius:50%;background:#dff1e1;color:#158253;display:grid;place-items:center;flex:none}.benefit b{display:block;font-size:10px;color:#345143}.benefit small{display:block;font-size:9px;color:#7a887f;margin-top:3px}.side-signoff{margin-top:31px;color:#27794f;font-size:12px;font-style:italic;line-height:1.35}.side-signoff strong{font-weight:800}.side-signoff svg{vertical-align:middle;margin-left:4px}
        @media(max-width:1050px){.farmer-register-page{grid-template-columns:1fr}.register-visual{display:none}.register-card-wrap{padding:20px}.register-card{max-width:850px}}
        @media(max-width:760px){.register-card-wrap{padding:0}.register-card{border-radius:0;min-height:100vh}.register-topbar{padding:20px}.login-link-copy{font-size:10px}.register-progress{padding:20px 15px 8px}.register-content{grid-template-columns:1fr}.register-side-info{display:none}.register-form-column{padding:23px 20px 30px}.field-grid{grid-template-columns:1fr}.quick-row{grid-template-columns:1fr}.register-actions{flex-wrap:wrap}.next-button{width:100%;order:4}.back-button{margin-left:0}.save-exit{margin-right:auto}.register-form-column h1{font-size:27px}}
      `}</style>
    </main>
  );
}

function Field({ label, icon, required, children }: { label: string; icon?: React.ReactNode; required?: boolean; children: React.ReactNode }) {
  return <label className="field"><span className="field-label">{icon}{label}{required && <em className="required">*</em>}</span>{children}</label>;
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div className="review-row"><span>{label}</span><b>{value || "—"}</b></div>;
}
