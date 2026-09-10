import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AppShell } from "../components/layout/AppShell";
import { LogOut } from "lucide-react";

export function ProfilePage() {
  const { user, profile, signOut, loginAsDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const roleTitle = {
    BRANCH_PASTOR: "Branch Pastor",
    ZONAL_HEAD: "Zonal Head",
    EXECUTIVE: "Executive Council ('Daddy')",
  }[profile?.role] || "Member";

  return (
    <AppShell title="Profile & Settings">
      <div className="space-y-6 pt-2">
        <div className="flex items-center gap-3.5 py-3 border-b border-gray-100">
          <div className="w-11 h-11 rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/20 flex items-center justify-center text-[#1B2A6B] font-semibold text-sm">
            {(profile?.full_name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-gray-900 truncate">
              {profile?.full_name || "User"}
            </h2>
            <p className="text-xs text-gray-400 truncate">{user?.email || "No email"}</p>
            <span className="inline-block mt-1 text-[10px] uppercase font-semibold tracking-wider text-[#1B2A6B]">
              {roleTitle}
            </span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
            Account Details
          </p>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100 text-xs">
            <div className="flex justify-between py-2.5">
              <span className="text-gray-500">Branch</span>
              <span className="text-gray-900 font-medium">{profile?.branches?.name || "—"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-gray-500">Phone</span>
              <span className="text-gray-900 font-medium">{profile?.phone || "—"}</span>
            </div>
            <div className="flex justify-between py-2.5">
              <span className="text-gray-500">Role Type</span>
              <span className="text-gray-900 font-medium">{roleTitle}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Switch Role Preview
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => { loginAsDemoRole("BRANCH_PASTOR"); navigate("/pastor"); }}
              className={`py-1.5 px-2 text-[11px] rounded border transition-colors ${
                profile?.role === "BRANCH_PASTOR" ? "border-[#1B2A6B] text-[#1B2A6B] font-medium bg-[#1B2A6B]/5" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Pastor
            </button>
            <button
              onClick={() => { loginAsDemoRole("ZONAL_HEAD"); navigate("/zonal"); }}
              className={`py-1.5 px-2 text-[11px] rounded border transition-colors ${
                profile?.role === "ZONAL_HEAD" ? "border-[#1B2A6B] text-[#1B2A6B] font-medium bg-[#1B2A6B]/5" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Zonal Head
            </button>
            <button
              onClick={() => { loginAsDemoRole("EXECUTIVE"); navigate("/executive"); }}
              className={`py-1.5 px-2 text-[11px] rounded border transition-colors ${
                profile?.role === "EXECUTIVE" ? "border-[#1B2A6B] text-[#1B2A6B] font-medium bg-[#1B2A6B]/5" : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              Executive
            </button>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            Sign Out
          </button>
        </div>
      </div>
    </AppShell>
  );
}
