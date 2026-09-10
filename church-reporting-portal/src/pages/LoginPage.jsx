import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getPastoralAccounts, CENTRAL_ZONE_BRANCHES } from "../lib/pastorAccounts";
import { ChevronRight, ArrowLeft, Lock, Building2, Users, ShieldCheck, Check } from "lucide-react";

export function LoginPage() {
  const { loginWithAccount, signInWithGoogle } = useAuth();
  const [selectedPortal, setSelectedPortal] = useState(null); // 'BRANCH_PASTOR' | 'ZONAL_HEAD' | 'EXECUTIVE' | null
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const accounts = getPastoralAccounts();

  // Filter accounts according to chosen portal
  const filteredAccounts = selectedPortal
    ? accounts.filter((acc) => acc.assigned_roles.includes(selectedPortal))
    : [];

  const handleSelectPortal = (portalKey) => {
    setSelectedPortal(portalKey);
    setSelectedAccount(null);
    setPassword("");
    setPasswordError("");
  };

  const handleSelectMinister = (acc) => {
    setSelectedAccount(acc);
    setPassword("");
    setPasswordError("");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!selectedAccount) return;

    // Verify password (default '1234' or customized)
    const validPassword = selectedAccount.password || "1234";
    if (password.trim() !== validPassword.trim()) {
      setPasswordError("Incorrect password. Please enter valid password.");
      return;
    }

    // Successfully authenticate into chosen portal
    loginWithAccount(selectedAccount.id, selectedPortal);

    if (selectedPortal === "EXECUTIVE") {
      navigate("/executive");
    } else if (selectedPortal === "ZONAL_HEAD") {
      navigate("/zonal");
    } else {
      navigate("/pastor");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      setLoading(false);
    }
  };

  const portalTitles = {
    BRANCH_PASTOR: "Branch Pastor Portal",
    ZONAL_HEAD: "Zonal Head Portal",
    EXECUTIVE: "Executive Council Portal",
  };

  const portalSubtitles = {
    BRANCH_PASTOR: "Select your branch to enter and submit weekly reports.",
    ZONAL_HEAD: "Select your zone to monitor branch compliance and growth.",
    EXECUTIVE: "Select apostolic council profile for worldwide oversight.",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between px-6 py-8 text-gray-900">
      <div className="max-w-sm mx-auto w-full my-auto space-y-6">
        {/* Top Church Logo */}
        <div className="text-center space-y-2">
          <img
            src="/logo.jpg"
            alt="LOVE ECONOMY CHURCH"
            className="w-36 h-auto mx-auto object-contain mb-2"
          />
          <h1 className="text-sm font-bold tracking-[0.16em] text-[#1B2A6B] uppercase leading-relaxed">
            PASTORS' REPORTING PORTAL
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed px-2">
            The central platform for Love Economy Church pastors to submit and track weekly service attendance, financial stewardship, and ministry growth.
          </p>
        </div>

        {/* STEP 1: Main Portals Selection (Branch Pastor, Zonal Head, Executive Council) */}
        {!selectedPortal && (
          <div className="space-y-3 pt-2">
            <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mb-2">
              Select Your Portal Access
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => handleSelectPortal("BRANCH_PASTOR")}
                className="w-full text-left p-3.5 border border-gray-200 rounded-lg hover:border-[#1B2A6B] hover:shadow-xs transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#1B2A6B]">
                      Branch Pastor Portal
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Parresia & Central Zone congregations
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B2A6B]" />
              </button>

              <button
                onClick={() => handleSelectPortal("ZONAL_HEAD")}
                className="w-full text-left p-3.5 border border-gray-200 rounded-lg hover:border-[#1B2A6B] hover:shadow-xs transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#1B2A6B]">
                      Zonal Head Portal
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Central Zone leadership & oversight
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B2A6B]" />
              </button>

              <button
                onClick={() => handleSelectPortal("EXECUTIVE")}
                className="w-full text-left p-3.5 border border-gray-200 rounded-lg hover:border-[#1B2A6B] hover:shadow-xs transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1B2A6B]/5 text-[#1B2A6B] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#1B2A6B]">
                      Executive Council Portal
                    </h3>
                    <p className="text-[11px] text-gray-400">
                      Apostolic council & worldwide feed
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#1B2A6B]" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Branch / Account Selection & Password Input */}
        {selectedPortal && (
          <div className="space-y-4 pt-1">
            <button
              onClick={() => handleSelectPortal(null)}
              className="text-xs text-gray-500 hover:text-[#1B2A6B] flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Portals
            </button>

            <div>
              <h2 className="text-sm font-bold text-gray-900">
                {portalTitles[selectedPortal]}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {portalSubtitles[selectedPortal]}
              </p>
            </div>

            {/* List of Units / Branches */}
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                Select Your Name / Branch
              </p>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                {filteredAccounts.map((acc) => {
                  const isSelected = selectedAccount?.id === acc.id;
                  return (
                    <div
                      key={acc.id}
                      onClick={() => handleSelectMinister(acc)}
                      className={`p-3 text-xs cursor-pointer transition-colors flex items-center justify-between ${
                        isSelected
                          ? "bg-[#1B2A6B]/5 border-l-3 border-[#1B2A6B]"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div>
                        <p className={`font-bold ${isSelected ? "text-[#1B2A6B]" : "text-gray-900"}`}>
                          {acc.branch_name}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          {acc.full_name}
                        </p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1B2A6B]" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Password Entry Form */}
            {selectedAccount && (
              <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-gray-100">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-gray-400" /> Enter Password for {selectedAccount.branch_name}
                    </label>
                    <span className="text-[10px] text-gray-400">Default: 1234</span>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. 1234)"
                    className="w-full border border-gray-200 rounded px-3 py-2 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
                    required
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-[11px] text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#1B2A6B] text-white text-xs font-semibold rounded hover:bg-[#152152] transition-colors shadow-xs cursor-pointer"
                >
                  Log into {selectedAccount.branch_name} Portal
                </button>
              </form>
            )}
          </div>
        )}

        {/* Sign in with Google (at bottom) */}
        <div className="pt-3 border-t border-gray-100">
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
