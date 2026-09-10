import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, BookmarkCheck, Users, AlertCircle, ArrowRight, ShieldCheck, User, Shield } from "lucide-react";

export const LoginPage = () => {
  const { signInWithGoogle, loginAsDemo } = useAuth();
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

  const handleDemo = (roleKey, path) => {
    loginAsDemo(roleKey);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 sm:px-6 relative overflow-hidden py-12">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-4 ring-4 ring-indigo-500/20">
            <BookOpen className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Community Reading Hub</h1>
          <p className="text-xs text-indigo-400 font-bold tracking-widest uppercase mt-1">
            Inspired by MyBible & Ministry Literature
          </p>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-sm leading-relaxed">
            Read ministry literature, listen with continuous Voice TTS reader, and join structured reading plans.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Interactive Preview Roles */}
        <div className="space-y-3 mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 px-1 flex items-center justify-between">
            <span>Explore Frontend Design (1-Click)</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">Instant Preview</span>
          </div>

          <button
            onClick={() => handleDemo("MEMBER", "/")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-indigo-500/50 text-left transition-all group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <User className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Enter as Church Member / Reader
                </div>
                <div className="text-[11px] text-zinc-400">Library, In-App MyBible Reader, TTS & Plans</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
          </button>

          <button
            onClick={() => handleDemo("ADMIN", "/admin")}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-amber-500/50 text-left transition-all group shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                  Enter as Library Admin Supervisor
                </div>
                <div className="text-[11px] text-zinc-400">Upload Books, User Moderation & Analytics</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <span className="relative bg-zinc-900 px-3 text-[11px] uppercase tracking-wider text-zinc-500 font-semibold">
            Or Sign In with Live Account
          </span>
        </div>

        {/* Google OAuth Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={signingIn}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-zinc-100 text-zinc-900 font-semibold py-3 px-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 text-xs"
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
          <span>{signingIn ? "Connecting..." : "Continue with Google Account"}</span>
        </button>

        <div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-zinc-800/80 text-center">
          <div className="p-2 rounded-xl bg-zinc-800/40">
            <Headphones className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
            <span className="text-[10px] text-zinc-400 font-medium block">Voice TTS</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-800/40">
            <BookmarkCheck className="w-4 h-4 text-purple-400 mx-auto mb-1" />
            <span className="text-[10px] text-zinc-400 font-medium block">Auto Save</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-800/40">
            <Users className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
            <span className="text-[10px] text-zinc-400 font-medium block">Community</span>
          </div>
        </div>
      </div>
    </div>
  );
};