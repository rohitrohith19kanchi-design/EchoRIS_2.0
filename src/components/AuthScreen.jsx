
import { useState } from "react";
import { motion } from "motion/react";
import { authAPI, saveToken } from "../lib/api";
import logoImg from "../assets/echoris_orbs.png";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response =
        mode === "login"
          ? await authAPI.login({ email, password })
          : await authAPI.register({
              display_name: displayName,
              email,
              password,
            });

      saveToken(response.token);
      onAuthenticated(response.user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#07080e] px-5 py-12 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.13),transparent_55%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img
            src={logoImg}
            alt="EchoRIS"
            className="w-24 h-24 object-contain mx-auto mb-4"
          />

          <h1 className="font-serif text-4xl tracking-[0.12em] text-amber-100">
            EchoRIS
          </h1>

          <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">
            A relational memory archive
          </p>
        </div>

        <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#121526] to-[#090b14] p-7 sm:p-9 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
          <div className="flex border-b border-white/10 mb-7">
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`flex-1 pb-3 text-sm transition ${
                mode === "login"
                  ? "text-amber-200 border-b-2 border-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => switchMode("register")}
              className={`flex-1 pb-3 text-sm transition ${
                mode === "register"
                  ? "text-amber-200 border-b-2 border-amber-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="font-serif text-2xl text-amber-50 mb-2">
            {mode === "login"
              ? "Welcome Back"
              : "Begin Your Archive"}
          </h2>

          <p className="text-sm text-slate-400 mb-7">
            {mode === "login"
              ? "Return to the moments you've preserved."
              : "Create a private space for your memories."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-slate-300 mb-2">
                  Display Name
                </label>
                <input
                  required
                  maxLength={80}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400/60"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400/60"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-2">
                Password
              </label>
              <input
                required
                type="password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-amber-400/60"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-rose-500/20 bg-rose-950/30 p-3 text-sm text-rose-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-500/25 via-violet-600/30 to-purple-700/30 py-3.5 text-sm font-semibold text-amber-100 transition hover:border-amber-300 hover:text-white disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Enter Your Archive"
                  : "Create My Archive"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          Your memories belong to you.
        </p>
      </motion.div>
    </div>
  );
}
