"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, Phone, UserRound } from "lucide-react";
import { api, useWorkflow } from "../../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { setWf } = useWorkflow();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function login(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!identifier.trim()) return setError("Enter your mobile number or email.");
    if (!password) return setError("Enter your password.");

    setLoading(true);
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      if (result.access_token) {
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem("agrioptix.access_token", result.access_token);
      }
      if (result.farmer) setWf({ role: "farmer", farmer: result.farmer });
      else setWf({ role: "farmer" });
      router.push("/farmer/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
      setLoading(false);
    }
  }

  return (
    <main className="agri-login-page">
      <section className="login-visual"><img src="/agri-login-visual.png" alt="Farmer using AgriOptix in a field" /></section>
      <section className="login-panel-wrap">
        <div className="login-panel">
          <div className="login-brand-row">
            <button className="login-brand" onClick={() => router.push("/")}>
              <span className="login-logo"><Leaf size={22} /></span>
              <span><strong>AgriOptix</strong><small>Smarter Farms. Better Futures.</small></span>
            </button>
            <button className="register-top-link" onClick={() => router.push("/farmer/onboarding")}>Register</button>
          </div>

          <div className="login-heading">
            <h1>Welcome Back, <span>Farmer!</span></h1>
            <p>Login to your account</p>
          </div>

          <div className="login-toggle">
            <button className="active"><UserRound size={17} /> Login</button>
            <button onClick={() => router.push("/farmer/onboarding")}><UserRound size={17} /> Register</button>
          </div>

          <form onSubmit={login} className="login-form">
            <label>
              <span>Mobile Number / Email <button type="button" className="forgot-inline" onClick={() => setError("Password recovery is not available in the current backend.")}>Forgot?</button></span>
              <div className="login-input"><Phone size={18} /><input value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="Enter your mobile number or email" autoComplete="username" /></div>
            </label>
            <label>
              <span>Password</span>
              <div className="login-input"><LockKeyhole size={18} /><input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </label>

            <div className="login-options">
              <label className="remember"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /><span>Remember me</span></label>
              <button type="button" onClick={() => setError("Password recovery is not available in the current backend.")}>Forgot password?</button>
            </div>

            {error && <div className="login-error">{error}</div>}
            <button className="login-submit" disabled={loading}>{loading ? "Signing in…" : "Login"} <ArrowRight size={18} /></button>
          </form>

          <div className="login-divider"><span>Or login with</span></div>
          <div className="alt-login"><button type="button" onClick={() => setError("Google login is not configured in the current backend.")}>G<span>oogle</span></button><button type="button" onClick={() => setError("OTP login is not configured in the current backend.")}>OTP</button><button type="button" onClick={() => setError("Biometric login is not configured in the current backend.")}>Biometric</button></div>

          <div className="new-user-card"><span className="new-user-icon"><Leaf size={18} /></span><div><b>New to AgriOptix?</b><small>Join the platform and get better value for your harvest.</small></div><button onClick={() => router.push("/farmer/onboarding")}>Register now <ArrowRight size={14} /></button></div>
        </div>
      </section>

      <style jsx global>{`
        .agri-login-page{min-height:100vh;background:#f5f8f4;display:grid;grid-template-columns:minmax(430px,1.08fr) minmax(520px,.92fr);font-family:"DM Sans",sans-serif;color:#183126}.login-visual{min-height:100vh;overflow:hidden;background:#dcebdd}.login-visual img{display:block;width:100%;height:100%;object-fit:cover;object-position:left center}.login-panel-wrap{display:flex;align-items:center;justify-content:center;padding:28px}.login-panel{width:min(100%,620px);background:rgba(255,255,255,.97);border:1px solid #e1e9e1;border-radius:22px;padding:30px 36px 28px;box-shadow:0 25px 70px rgba(28,56,38,.10)}.login-brand-row{display:flex;align-items:center;justify-content:space-between}.login-brand{display:flex;align-items:center;gap:10px;border:0;background:transparent;padding:0;cursor:pointer;text-align:left;color:#163326}.login-logo{width:43px;height:43px;border-radius:50%;background:#149b60;color:white;display:grid;place-items:center}.login-brand strong{display:block;font:800 25px/1 Manrope}.login-brand small{display:block;font-size:10px;color:#60736a;margin-top:5px}.register-top-link{border:0;background:transparent;color:#188153;font-weight:800;cursor:pointer}.login-heading{margin:43px 0 24px}.login-heading h1{font:800 33px/1.1 Manrope;letter-spacing:-.8px;margin:0;color:#153b2b}.login-heading h1 span{color:#168653}.login-heading p{font-size:13px;color:#6c7b72;margin:9px 0 0}.login-toggle{display:grid;grid-template-columns:1fr 1fr;background:#edf2ee;border-radius:30px;padding:3px;margin-bottom:25px}.login-toggle button{border:0;background:transparent;border-radius:26px;padding:12px;color:#607168;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}.login-toggle button.active{background:#138b58;color:#fff;box-shadow:0 6px 16px #138b5825}.login-form{display:grid;gap:19px}.login-form label>span{display:flex;justify-content:space-between;align-items:center;font-size:11px;font-weight:800;color:#294638;margin-bottom:7px}.forgot-inline{border:0;background:transparent;color:#398366;font-size:10px;cursor:pointer}.login-input{height:54px;border:1px solid #dce5dd;background:#fbfcfb;border-radius:11px;display:flex;align-items:center;padding:0 13px;gap:10px;color:#668076}.login-input:focus-within{border-color:#75ae87;box-shadow:0 0 0 3px #e6f3e9}.login-input input{border:0;outline:0;background:transparent;flex:1;color:#23372d;font-size:12px}.login-input button{border:0;background:transparent;color:#708178;cursor:pointer;display:grid;place-items:center}.login-options{display:flex;align-items:center;justify-content:space-between;font-size:10px;color:#547066}.remember{display:flex!important;align-items:center;gap:7px!important;margin:0!important;font-weight:500!important}.remember input{accent-color:#168c59;width:17px;height:17px}.login-options>button{border:0;background:transparent;color:#398366;cursor:pointer;font-size:10px}.login-error{background:#fff0ed;border:1px solid #f1d5ce;color:#a34d3d;border-radius:9px;padding:10px 12px;font-size:10px}.login-submit{border:0;background:#138d59;color:#fff;border-radius:11px;padding:15px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;box-shadow:0 10px 24px #138d5925}.login-submit:disabled{opacity:.65;cursor:not-allowed}.login-divider{display:flex;align-items:center;gap:12px;color:#7b8880;font-size:10px;margin:26px 0 15px}.login-divider::before,.login-divider::after{content:"";height:1px;background:#e3e9e3;flex:1}.alt-login{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.alt-login button{height:55px;border:1px solid #e5ebe5;background:#fff;border-radius:11px;color:#50645a;font-size:10px;cursor:pointer}.alt-login button:first-child{font-size:18px;color:#4285f4}.alt-login button:first-child span{font-size:10px;color:#4f6359;margin-left:2px}.new-user-card{margin-top:22px;background:#edf8ef;border-radius:13px;padding:13px;display:flex;align-items:center;gap:10px}.new-user-icon{width:34px;height:34px;border-radius:50%;background:#d8efdc;color:#178253;display:grid;place-items:center;flex:none}.new-user-card>div{flex:1}.new-user-card b{display:block;font-size:10px;color:#315446}.new-user-card small{display:block;color:#708077;font-size:9px;margin-top:3px}.new-user-card button{border:0;background:transparent;color:#168052;font-size:10px;font-weight:800;display:flex;align-items:center;gap:4px;cursor:pointer;white-space:nowrap}
        @media(max-width:980px){.agri-login-page{grid-template-columns:1fr}.login-visual{display:none}.login-panel-wrap{min-height:100vh;padding:18px}.login-panel{max-width:650px}}
        @media(max-width:560px){.login-panel{border-radius:0;min-height:100vh;padding:24px 19px}.login-heading{margin-top:35px}.login-heading h1{font-size:28px}.alt-login{gap:7px}.new-user-card{align-items:flex-start}.new-user-card button{margin-top:2px}}
      `}</style>
    </main>
  );
}
