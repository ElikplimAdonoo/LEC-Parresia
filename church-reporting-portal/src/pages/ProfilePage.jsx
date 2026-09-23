import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AppShell } from "../components/layout/AppShell";
import { ALL_BRANCHES } from "../lib/pastorAccounts";
import { LogOut, CheckCircle2, Edit3, Eye, EyeOff } from "lucide-react";

export function ProfilePage() {
  const { user, profile, activeRole, assignedRoles, switchRole, updateProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const isInitiallyUnassigned = profile?.full_name === "Not assigned yet";
  const [isEditing, setIsEditing] = useState(isInitiallyUnassigned);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Editable fields initialized from current profile
  const [fullName, setFullName] = useState(
    profile?.full_name && profile.full_name !== "Not assigned yet" ? profile.full_name : ""
  );
  const [phone, setPhone] = useState(profile?.phone || "");
  const [branchName, setBranchName] = useState(profile?.branches?.name || "Parresia");
  const [gatheringCenter, setGatheringCenter] = useState(profile?.branches?.gathering_center || "");

  // Avatar
  const [avatarData, setAvatarData] = useState(profile?.avatar || null);

  // Password change
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaveError("");

    // Password validation
    if (newPassword || confirmPassword) {
      if (newPassword.length < 6) {
        setSaveError("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setSaveError("Passwords do not match.");
        return;
      }
    }

    const finalName = fullName.trim() || "Branch Pastor";
    updateProfile({
      full_name: finalName,
      phone: phone,
      branch_name: branchName,
      gathering_center: gatheringCenter,
      avatar: avatarData,
      ...(newPassword ? { password: newPassword } : {}),
    });
    setNewPassword("");
    setConfirmPassword("");
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const roleTitle = {
    BRANCH_PASTOR: "Branch Pastor",
    ZONAL_HEAD: "Zonal Head",
    EXECUTIVE:
      profile?.id === "bishop-isaac-oti-boateng"
        ? "Global Pastor / General Overseer"
        : "Executive Council",
  }[activeRole] || (profile?.id === "bishop-isaac-oti-boateng" ? "Global Pastor / General Overseer" : "Pastor");

  const displayName = profile?.full_name || "Not assigned yet";

  return (
    <AppShell unitName={branchName} title="Profile & Settings">
      <div className="space-y-6 pt-2">
        {/* Notice for newly claimed branch */}
        {isInitiallyUnassigned && !saveSuccess && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <Edit3 className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold">Welcome to {branchName} Portal!</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                This branch is currently unassigned. Please enter your full name, contact phone, and gathering center below to register as the Branch Pastor.
              </p>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="flex items-center gap-3.5 py-3 border-b border-gray-100">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/20 overflow-hidden flex items-center justify-center text-[#1B2A6B] font-bold text-base shrink-0">
            {avatarData ? (
              <img src={avatarData} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              (displayName !== "Not assigned yet" ? displayName.charAt(0) : "P").toUpperCase()
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-gray-900 truncate">{displayName}</h2>
            <p className="text-xs text-gray-400 truncate">{branchName}</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#1B2A6B] bg-[#1B2A6B]/5 px-2 py-0.5 rounded">
                Active: {roleTitle}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-semibold text-[#1B2A6B] hover:underline shrink-0"
          >
            {isEditing ? "Close" : "Edit Profile"}
          </button>
        </div>

        {saveSuccess && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded text-xs text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Profile saved successfully!</span>
          </div>
        )}

        {/* Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 border border-gray-100 rounded-lg p-4 bg-gray-50/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Pastor &amp; Branch Information
            </p>

            {/* Profile Picture */}
            <div>
              <label className="block text-[11px] text-gray-700 font-medium mb-1">
                Profile Picture
              </label>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1B2A6B]/5 border border-[#1B2A6B]/20 overflow-hidden flex items-center justify-center shrink-0">
                  {avatarData ? (
                    <img src={avatarData} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#1B2A6B] font-bold text-sm">
                      {(fullName || "P").charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => setAvatarData(ev.target.result);
                    reader.readAsDataURL(file);
                  }}
                  className="block flex-1 text-xs text-gray-600 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-[#1B2A6B]/5 file:text-[#1B2A6B] hover:file:bg-[#1B2A6B]/10 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-gray-700 font-medium mb-1">
                Your Full Name (e.g. Pastor / Rev. ...)
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-700 font-medium mb-1">
                Assigned Branch
              </label>
              <select
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
              >
                {ALL_BRANCHES.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-gray-700 font-medium mb-1">
                Gathering Center Name
              </label>
              <input
                type="text"
                value={gatheringCenter}
                onChange={(e) => setGatheringCenter(e.target.value)}
                placeholder="Enter the name of your gathering center"
                className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-gray-700 font-medium mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 ..."
                className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
              />
            </div>

            {/* Password Change */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Change Password (optional)
              </p>
              <div>
                <label className="block text-[11px] text-gray-700 font-medium mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 pr-8 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-gray-700 font-medium mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 pr-8 text-xs text-gray-900 outline-none focus:border-[#1B2A6B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {saveError && (
              <p className="text-[11px] text-red-600">{saveError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#1B2A6B] text-white text-xs font-semibold py-2 rounded hover:bg-[#152152] transition-colors cursor-pointer"
            >
              Save Profile Details
            </button>
          </form>
        ) : (
          <div className="space-y-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">
              Ministry Assignments
            </p>
            <div className="divide-y divide-gray-100 border-t border-b border-gray-100 text-xs">
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Branch</span>
                <span className="text-gray-900 font-semibold">{branchName}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Zone</span>
                <span className="text-gray-900 font-semibold">Central Zone</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Gathering Center</span>
                <span className="text-gray-900 font-medium">{gatheringCenter || "—"}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-gray-500">Phone</span>
                <span className="text-gray-900 font-medium">{phone || "—"}</span>
              </div>
            </div>
          </div>
        )}

        {/* Role Switcher in Profile for multi-role ministers */}
        {assignedRoles && assignedRoles.length > 1 && (
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Active View Portals
            </p>
            <div className="grid grid-cols-3 gap-2">
              {assignedRoles.map((r) => {
                const isActive = activeRole === r;
                const label =
                  r === "BRANCH_PASTOR"
                    ? "Branch View"
                    : r === "ZONAL_HEAD"
                    ? "Zonal View"
                    : "Council View";
                return (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      if (r === "BRANCH_PASTOR") navigate("/pastor");
                      else if (r === "ZONAL_HEAD") navigate("/zonal");
                      else if (r === "EXECUTIVE") navigate("/executive");
                    }}
                    className={`py-2 px-2 text-[11px] rounded border transition-colors ${
                      isActive
                        ? "border-[#1B2A6B] text-[#1B2A6B] font-bold bg-[#1B2A6B]/5"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.75]" />
            Sign Out to Portals
          </button>
        </div>
      </div>
    </AppShell>
  );
}
