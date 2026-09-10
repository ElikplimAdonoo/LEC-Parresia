import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Church, ShieldCheck, AlertCircle, ArrowRight, UserCheck, Shield, Crown } from "lucide-react";

export const LoginPage = () => {
  const { signInWithGoogle, loginAsDemoRole } = useAuth();
  const [error, setError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      setSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Failed to sign in with Google.");
      setSigningIn(false);
    }
  };

  const handleDemoLogin = (role, path) => {
    loginAsDemoRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden py-12">
      {/* Soft atmospheric gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl border border-stone-200/80 p-8 sm:p-10 rounded-3xl shadow-xl shadow-stone-200/50 relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900 flex items-center justify-center text-white shadow-lg shadow-teal-700/25 mb-4 ring-4 ring-teal-100">
            <Church className="w-8 h-8 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            Church Reporting Portal
          </h1>
          <p className="text-xs text-teal-700 font-bold tracking-widest uppercase mt-1">
            Centralized Pastoral Reporting System
          </p>
          <p className="text-xs sm:text-sm text-stone-500 mt-2 max-w-sm leading-relaxed">
            Submit Sunday Mega Gathering & Midweek TTLHA Cell reports with sermon audio, metrics, and compliance tracking.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Interactive Preview Roles */}
        <div className="space-y-3 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-1 flex items-center justify-between">
            <span>Instant Role Preview</span>
            <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-200 font-semibold">
              Live WebApp
            </span>
          </div>

          <button
            onClick={() => handleDemoLogin("BRANCH_PASTOR", "/submit")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/90 hover:bg-teal-50/50 border border-stone-200/80 hover:border-teal-300 text-left transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100/80 border border-teal-200 flex items-center justify-center text-teal-700 group-hover:scale-105 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-teal-800 transition-colors">
                  Enter as Branch Pastor
                </div>
                <div className="text-[11px] text-stone-500">Dynamic Sunday & Midweek Submission Form</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => handleDemoLogin("ZONAL_HEAD", "/zonal")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/90 hover:bg-amber-50/50 border border-stone-200/80 hover:border-amber-300 text-left transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100/80 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                  Enter as Zonal Head
                </div>
                <div className="text-[11px] text-stone-500">Zone-wide Branch Aggregations & Compliance</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => handleDemoLogin("EXECUTIVE", "/executive")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-stone-50/90 hover:bg-rose-50/50 border border-stone-200/80 hover:border-rose-300 text-left transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100/80 border border-rose-200 flex items-center justify-center text-rose-700 group-hover:scale-105 transition-transform">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900 group-hover:text-rose-800 transition-colors">
                  Enter as Executive Council ("Daddy")
                </div>
                <div className="text-[11px] text-stone-500">Telemetry, Recharts & Gemini AI Intelligence</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200" />
          </div>
          <span className="relative bg-white px-3 text-[11px] uppercase tracking-wider text-stone-400 font-semibold">
            Or Sign In with Google
          </span>
        </div>

        {/* Google OAuth Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 bg-stone-900 hover:bg-stone-800 text-white font-semibold py-3 px-4 rounded-2xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{signingIn ? "Connecting to Google..." : "Continue with Google Account"}</span>
        </button>

        <div className="mt-8 pt-6 border-t border-stone-200/80 flex items-center justify-center gap-2 text-stone-500 text-xs">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Protected by Role-Based Access Security</span>
        </div>
      </div>
    </div>
  );
};