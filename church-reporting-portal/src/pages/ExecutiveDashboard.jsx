import React, { useEffect, useState, useCallback } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports, getCachedReportsSync } from "../lib/reportStore";
import { getAccraGreeting } from "../lib/timeGreeting";
import { BarChart3, CheckCircle2, ShieldCheck } from "lucide-react";

export function ExecutiveDashboard() {
  const { profile } = useAuth();

  const councilMember = profile?.full_name || "Bishop Isaac Oti-Boateng";

  // Cache-first init — no flash
  const [reports, setReports] = useState(() => getCachedReportsSync());
  const [loading, setLoading] = useState(() => getCachedReportsSync().length === 0);

  const refreshReports = useCallback(async () => {
    try {
      const data = await getStoredReports();
      setReports(data);
    } catch (e) {
      console.error("ExecutiveDashboard load error:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReports();
    window.addEventListener("lec_report_updated", refreshReports);
    return () => window.removeEventListener("lec_report_updated", refreshReports);
  }, [refreshReports]);

  const totalReports = reports.length;
  const totalAttendance = reports.reduce((acc, curr) => acc + (parseInt(curr.total_attendance) || 0), 0);
  const totalFinance = reports.reduce((acc, curr) => acc + (parseFloat(curr.total_stewardship) || 0), 0);
  const totalConverts = reports.reduce((acc, curr) => acc + (parseInt(curr.new_converts) || 0), 0);

  return (
    <AppShell unitName="Executive Council">
      <div className="space-y-6 pt-2">
        {/* Greeting Header */}
        <div className="pb-4 border-b border-gray-100 flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase">
              {getAccraGreeting()}
            </p>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {councilMember}
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              {councilMember === "Bishop Isaac Oti-Boateng"
                ? "Global Pastor / General Overseer — Worldwide Oversight"
                : "Executive Council Member — Worldwide Oversight"}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
            <ShieldCheck className="w-3 h-3" /> Live Worldwide Feed
          </span>
        </div>

        {/* Global Live Summary */}
        {loading ? (
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-2.5 border border-gray-100 rounded animate-pulse">
                <div className="h-2 bg-gray-100 rounded w-2/3 mx-auto mb-2" />
                <div className="h-3.5 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 border border-gray-100 rounded">
              <p className="text-[9px] uppercase font-semibold text-gray-400">Total Attendance</p>
              <p className="text-sm font-bold text-[#1B2A6B] mt-0.5">
                {totalReports > 0 ? totalAttendance : "—"}
              </p>
            </div>
            <div className="p-2.5 border border-gray-100 rounded">
              <p className="text-[9px] uppercase font-semibold text-gray-400">Reports In</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{totalReports}</p>
            </div>
            <div className="p-2.5 border border-gray-100 rounded">
              <p className="text-[9px] uppercase font-semibold text-gray-400">Converts</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                {totalReports > 0 ? totalConverts : "—"}
              </p>
            </div>
            <div className="p-2.5 border border-gray-100 rounded">
              <p className="text-[9px] uppercase font-semibold text-gray-400">Stewardship</p>
              <p className="text-sm font-bold text-emerald-600 mt-0.5">
                {totalReports > 0 ? `GHS ${totalFinance.toFixed(0)}` : "—"}
              </p>
            </div>
          </div>
        )}

        {/* Live Submissions Feed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Live Submissions from Branches &amp; Zones
            </p>
            <span className="text-[11px] text-gray-400">112 Branches across 14 Zones</span>
          </div>

          {loading ? (
            <div className="border border-gray-100 rounded divide-y divide-gray-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-32" />
                      <div className="h-2.5 bg-gray-100 rounded w-48" />
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
              <BarChart3 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
              <p>No reports transmitted yet from the field.</p>
              <p className="text-[11px] text-gray-400">
                Submissions from branches across all 14 zones reflect here in real-time.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between text-xs gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {rep.branch_name || "Parresia"}
                        </span>
                        <span className="text-[11px] text-[#1B2A6B] font-medium">
                          &bull; {rep.pastor_name || "Rev. Makafui Tetteh Kumahlor"}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        {rep.service_type === "SUNDAY_MEGA" ? "Sunday Mega Gathering" : "Midweek TTLHA Cell"} &bull; {rep.service_date}
                      </p>
                      {(rep.message_title || rep.sermon_title) && (
                        <p className="text-[10px] text-gray-500 italic">
                          &ldquo;{rep.message_title || rep.sermon_title}&rdquo;
                          {rep.preacher ? ` by ${rep.preacher}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="text-right space-y-0.5 shrink-0">
                      <p className="font-bold text-[#1B2A6B]">{rep.total_attendance} attendees</p>
                      <p className="text-[10px] text-gray-500">
                        GHS {Number(rep.total_stewardship || 0).toFixed(2)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">
                        <CheckCircle2 className="w-2 h-2" /> Received
                      </span>
                    </div>
                  </div>
                  {/* Sermon Audio */}
                  {rep.sermon_audio_data && (
                    <div className="pt-1 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 mb-1">
                        🎙 {rep.sermon_audio_name || "Sermon Audio"}
                      </p>
                      <audio
                        controls
                        src={rep.sermon_audio_data}
                        className="w-full"
                        style={{ height: "32px" }}
                      />
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
