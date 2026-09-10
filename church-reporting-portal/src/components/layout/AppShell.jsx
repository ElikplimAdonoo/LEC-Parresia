import React from "react";
import { BottomNav } from "./BottomNav";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export function AppShell({ title, subtitle, unitName, children, rightAction }) {
  const { profile, activeRole, assignedRoles, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine unit name to display by the logo:
  // Branch name (Parresia) when in Branch Pastor view, Zone name (Central Zone) in Zonal view, or Executive Council
  const displayedUnit =
    unitName ||
    (activeRole === "ZONAL_HEAD"
      ? profile?.zones?.name || "Central Zone"
      : activeRole === "EXECUTIVE"
      ? "Executive Council"
      : profile?.branches?.name || "Parresia");

  const handleRoleToggle = (targetRole) => {
    switchRole(targetRole);
    if (targetRole === "BRANCH_PASTOR") {
      navigate("/pastor");
    } else if (targetRole === "ZONAL_HEAD") {
      navigate("/zonal");
    } else if (targetRole === "EXECUTIVE") {
      navigate("/executive");
    }
  };

  const roleLabels = {
    BRANCH_PASTOR: "Branch",
    ZONAL_HEAD: "Zone",
    EXECUTIVE: "Council",
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="h-14 flex items-center justify-between px-4 max-w-xl mx-auto w-full">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img
              src="/logo.jpg"
              alt="Love Economy Church"
              className="h-10 w-auto object-contain shrink-0"
            />
            {/* Unit name by the logo (e.g. Parresia / Central Zone / Executive Council) */}
            <div className="border-l border-gray-200 pl-3">
              <h1 className="text-sm font-bold tracking-tight text-[#1B2A6B] uppercase leading-tight truncate max-w-[200px]">
                {displayedUnit}
              </h1>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider leading-none mt-0.5">
                LOVE ECONOMY CHURCH
              </p>
            </div>
          </div>

          {/* Right Action or Role Switcher */}
          <div className="flex items-center gap-2">
            {/* Role Switcher Pill Bar: Only shows if the user holds multiple roles (e.g. Rev. Makafui) */}
            {assignedRoles && assignedRoles.length > 1 && (
              <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200/70">
                {assignedRoles.map((r) => {
                  const isActive = activeRole === r;
                  return (
                    <button
                      key={r}
                      onClick={() => handleRoleToggle(r)}
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full transition-all ${
                        isActive
                          ? "bg-[#1B2A6B] text-white shadow-xs"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                      title={`Switch to ${roleLabels[r]} view`}
                    >
                      {roleLabels[r]}
                    </button>
                  );
                })}
              </div>
            )}
            {rightAction}
          </div>
        </div>
      </header>

      {/* Main scrollable view */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-3 pb-20">
        {children}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNav role={activeRole} />
    </div>
  );
}
