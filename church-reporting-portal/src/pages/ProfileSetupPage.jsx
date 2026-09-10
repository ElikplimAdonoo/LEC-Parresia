import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { User, Phone, MapPin, Building, Shield, CheckCircle2 } from "lucide-react";

export const ProfileSetupPage = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("BRANCH_PASTOR");
  const [zoneId, setZoneId] = useState("");
  const [branchId, setBranchId] = useState("");

  const [zones, setZones] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadLocations = async () => {
      const { data: zonesData } = await supabase.from("zones").select("*").order("name");
      if (zonesData) setZones(zonesData);

      const { data: branchesData } = await supabase.from("branches").select("*").eq("is_active", true).order("name");
      if (branchesData) setBranches(branchesData);
    };
    loadLocations();
  }, []);

  const filteredBranches = branches.filter((b) => !zoneId || b.zone_id === zoneId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      setError("Please fill in your full name and contact phone number.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        id: user.id,
        full_name: fullName,
        phone,
        role,
        zone_id: role === "EXECUTIVE" ? null : zoneId || null,
        branch_id: role === "BRANCH_PASTOR" ? branchId || null : null,
        approved: role === "EXECUTIVE", // Executives or auto-approve logic if needed
      };

      const { error: upsertError } = await supabase.from("user_profiles").upsert(payload);
      if (upsertError) throw upsertError;

      await refreshProfile();
      navigate(payload.approved ? "/" : "/pending");
    } catch (err) {
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-400 mx-auto mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Complete Your Pastor Profile</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Confirm your identity, mobile line for SMS alerts, and your primary reporting branch.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. Pastor Paul Mensah"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Mobile Phone Number <span className="text-amber-400">(Required for SMS Reminders)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                placeholder="e.g. +233 24 123 4567"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">Assigned Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="BRANCH_PASTOR">Branch Pastor (Submit Branch Reports)</option>
              <option value="ZONAL_HEAD">Zonal Head (Oversee Zone Aggregations)</option>
              <option value="EXECUTIVE">Executive Council / Daddy (System Analytics)</option>
            </select>
          </div>

          {role !== "EXECUTIVE" && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Assigned Zone</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                required={role === "ZONAL_HEAD"}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Select Zone --</option>
                {zones.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {role === "BRANCH_PASTOR" && (
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">Assigned Branch</label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">-- Select Branch --</option>
                {filteredBranches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} {b.gathering_center ? `(${b.gathering_center})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Saving Profile..." : "Submit Profile for Approval"}
          </button>
        </form>
      </div>
    </div>
  );
};
