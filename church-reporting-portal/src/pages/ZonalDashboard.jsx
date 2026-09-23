import React, { useEffect, useState, useCallback } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports, getCachedReportsSync } from "../lib/reportStore";
import { getAccraGreeting } from "../lib/timeGreeting";
import { LEC_ZONES } from "../lib/pastorAccounts";
import { Building2, CheckCircle2 } from "lucide-react";

export function ZonalDashboard() {
  const { profile } = useAuth();

  const zoneLeader = profile?.full_name || "Zonal Head";
  const zoneName = profile?.zones?.name || profile?.zone_name || "Central Zone";

  const currentZone = LEC_ZONES.find(
    (z) => z.zone_name.toLowerCase() === zoneName.toLowerCase()
  );
  const zoneBranches = currentZone ? currentZone.branches : [];
  const totalZoneBranches = zoneBranches.length || 15;

  // Initialize from cache synchronously — no flash
  const [reports, setReports] = useState(() => {
    const cached = getCachedReportsSync();
    return cached.filter((r) => {
      const matchesZoneName =
        (r.zone_name || "").trim().toLowerCase() === zoneName.trim().toLowerCase();
      const matchesBranch = zoneBranches.some(
        (b) => b.trim().toLowerCase() === (r.branch_name || "").trim().toLowerCase()
      );
      return matchesZoneName || matchesBranch;
    });
  });
  const [loading, setLoading] = useState(reports.length === 0);

  const refreshReports = useCallback(async () => {
    try {
      const data = await getStoredReports();
      const filtered = data.filter((r) => {
        const matchesZoneName =
          (r.zone_name || "").trim().toLowerCase() === zoneName.trim().toLowerCase();
        const matchesBranch = zoneBranches.some(
          (b) => b.trim().toLowerCase() === (r.branch_name || "").trim().toLowerCase()
        );
        return matchesZoneName || matchesBranch;
      });
      setReports(filtered);
    } catch (e) {
      console.error("ZonalDashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }, [zoneName]);

  useEffect(() => {
    refreshReports();
    window.addEventListener("lec_report_updated", refreshReports);
    return () => window.removeEventListener("lec_report_updated", refreshReports);
  }, [refreshReports]);

  const totalReports = reports.length;
  const totalAttendance = reports.reduce(
    (acc, curr) => acc + (parseInt(curr.total_attendance) || 0),
    0
  );
  const compliancePercent =
    totalZoneBranches > 0
      ? Math.min(100, Math.round((totalReports / totalZoneBranches) * 100))
      : 0;

  return (
    <AppShell unitName={zoneName}>
      <div className="space-y-6 pt-2">
        {/* Greeting Header */}
        <div className="pb-4 border-b border-gray-100 space-y-1">
          <p className="text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase">
            {getAccraGreeting()}
          </p>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {zoneLeader}
          </h2>
          <p className="text-xs text-gray-500 font-normal">
            Here is what is happening in your Zone ({zoneName}) &bull; {totalZoneBranches} Branches
          </p>
        </div>

        {/* Zone Stats */}
        {loading ? (
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 border border-gray-100 rounded animate-pulse">
                <div className="h-2.5 bg-gray-100 rounded w-2/3 mx-auto mb-2" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 border border-gray-100 rounded">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Reports In</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {totalReports} <span className="text-xs font-normal text-gray-400">/ {totalZoneBranches}</span>
              </p>
            </div>
            <div className="p-3 border border-gray-100 rounded">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Zone Attendance</p>
              <p className="text-base font-bold text-[#1B2A6B] mt-0.5">{totalAttendance}</p>
            </div>
            <div className="p-3 border border-gray-100 rounded">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Compliance</p>
              <p className="text-base font-bold text-emerald-600 mt-0.5">{compliancePercent}%</p>
            </div>
          </div>
        )}

        {/* Branch Reports Flow */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Branch Submissions Received
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Auto-forwarded to Council</span>
          </div>

          {loading ? (
            <div className="border border-gray-100 rounded divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-32" />
                      <div className="h-2.5 bg-gray-100 rounded w-44" />
                    </div>
                    <div className="space-y-1.5 text-right">
                      <div className="h-3 bg-gray-100 rounded w-20 ml-auto" />
                      <div className="h-2.5 bg-gray-100 rounded w-16 ml-auto" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
              <Building2 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
              <p>No branch reports received yet for {zoneName}.</p>
              <p className="text-[11px] text-gray-400">
                Submissions from any of the {totalZoneBranches} branches in {zoneName} reflect here instantly.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between text-xs gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-gray-900">{rep.branch_name}</span>
                        {rep.pastor_name && (
                          <span className="text-[11px] text-gray-500">({rep.pastor_name})</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {rep.service_type === "SUNDAY_MEGA" ? "Sunday Mega Gathering" : "Midweek TTLHA Cell"} &bull; {rep.service_date}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-[#1B2A6B]">{rep.total_attendance} attendees</p>
                      <p className="text-[10px] text-emerald-600 flex items-center gap-0.5 justify-end">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Transmitted
                      </p>
                    </div>
                  </div>
                  {/* Sermon Audio */}
                  {rep.sermon_audio_data && (
                    <div className="pt-1 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 mb-1">🎙 {rep.sermon_audio_name || "Sermon Audio"}</p>
                      <audio controls src={rep.sermon_audio_data} className="w-full" style={{ height: "32px" }} />
                    </div>
                  )}
                  {/* Google Photos */}
                  {rep.google_photos_url && (
                    <a
                      href={rep.google_photos_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-[#1B2A6B] font-medium hover:underline pt-0.5"
                    >
                      📷 View Service Photos
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
