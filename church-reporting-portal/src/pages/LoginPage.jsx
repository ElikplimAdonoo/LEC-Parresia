import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { signInWithGoogle, loginAsDemoRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      await signInWithGoogle();
    } catch (err) {
      setError(err.message || "Sign in failed");
      setLoading(false);
    }
  };

  const handleRoleSelect = (roleKey, targetPath) => {
    loginAsDemoRole(roleKey);
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-6 py-10 text-gray-900">
      <div className="max-w-xs mx-auto w-full my-auto text-center space-y-6">
        {/* Church Logo */}
        <div>
          <img
            src="/logo.jpg"
            alt="LOVE ECONOMY CHURCH"
            className="w-40 h-auto mx-auto object-contain mb-4"
          />
          <h1 className="text-xs font-bold tracking-[0.18em] text-[#1B2A6B] uppercase leading-relaxed">
            PASTORS' REPORTING PORTAL
          </h1>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            The central platform for Love Economy Church pastors to submit and track weekly service attendance, financial stewardship, and ministry growth.
          </p>
        </div>

        {error && (
          <div className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2 text-left">
            {error}
          </div>
        )}

        {/* Portal Access Buttons FIRST */}
        <div className="pt-2">
          <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-3">
            Select Portal Access
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleRoleSelect("BRANCH_PASTOR", "/pastor")}
              className="w-full text-xs text-gray-700 font-medium py-2.5 px-3 border border-gray-200 rounded hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors"
            >
              Branch Pastor Portal
            </button>
            <button
              onClick={() => handleRoleSelect("ZONAL_HEAD", "/zonal")}
              className="w-full text-xs text-gray-700 font-medium py-2.5 px-3 border border-gray-200 rounded hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors"
            >
              Zonal Head Portal
            </button>
            <button
              onClick={() => handleRoleSelect("EXECUTIVE", "/executive")}
              className="w-full text-xs text-gray-700 font-medium py-2.5 px-3 border border-gray-200 rounded hover:border-[#1B2A6B] hover:text-[#1B2A6B] transition-colors"
            >
              Executive Council Portal
            </button>
          </div>
        </div>

        {/* Sign in with Google as LAST option */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2 px-4 border border-gray-200 rounded text-xs font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            {loading ? "Connecting..." : "Sign in with Google"}
          </button>
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400">
        LOVE ECONOMY CHURCH &copy; 2026
      </p>
    </div>
  );
}
