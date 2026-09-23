import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import {
  getStoredReports,
  getCachedReportsSync,
  undoReport,
  canUndoReport,
  getRemainingUndoTime,
} from "../lib/reportStore";
import { getAccraGreeting } from "../lib/timeGreeting";
import { Plus, FileText, CheckCircle2, RotateCcw } from "lucide-react";

export function PastorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const branchName = profile?.branches?.name || "Parresia";
  const pastorName = profile?.full_name || "Rev. Makafui Tetteh Kumahlor";

  // Initialize from localStorage cache synchronously — no "0 submissions" flash
  const [reports, setReports] = useState(() => getCachedReportsSync(branchName));
  const [loading, setLoading] = useState(() => getCachedReportsSync(branchName).length === 0);

  const refreshReports = useCallback(async () => {
    try {
      const all = await getStoredReports();
      const branchReports = all.filter(
        (r) => !r.branch_name || r.branch_name.toLowerCase() === branchName.toLowerCase()
      );
      setReports(branchReports.length > 0 ? branchReports : all);
    } catch (e) {
      console.error("Error loading stored reports:", e);
    } finally {
      setLoading(false);
    }
  }, [branchName]);

  useEffect(() => {
    refreshReports();
    // Live: refresh whenever any report is saved anywhere
    window.addEventListener("lec_report_updated", refreshReports);
    return () => window.removeEventListener("lec_report_updated", refreshReports);
  }, [refreshReports]);

  const handleUndo = async (reportId) => {
    if (
      !window.confirm(
        "Are you sure you want to undo this attendance submission? You will be redirected to edit and re-submit."
      )
    ) {
      return;
    }
    try {
      await undoReport(reportId);
      navigate("/submit");
    } catch (err) {
      alert(err.message || "Failed to undo submission.");
    }
  };

  const totalReports = reports.length;
  const latestReport = reports[0];
  const lastAttendance = latestReport ? latestReport.total_attendance : "—";

  return (
    <AppShell unitName={branchName}>
      <div className="space-y-6 pt-2">
        {/* Greeting Header */}
        <div className="flex justify-between items-start pb-4 border-b border-gray-100">
          <div className="space-y-1">
            <p className="text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase">
              {getAccraGreeting()}
            </p>
            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
              {pastorName}
            </h2>
            <p className="text-xs text-gray-500 font-normal">
              Here is what is happening in your Branch ({branchName})
            </p>
          </div>
          <button
            onClick={() => navigate("/submit")}
            className="flex items-center gap-1 bg-[#1B2A6B] text-white text-xs font-semibold px-3 py-1.5 rounded hover:bg-[#152152] transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            Submit
          </button>
        </div>

        {/* Stats */}
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
              <p className="text-[10px] uppercase font-semibold text-gray-400">Submissions</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">{totalReports}</p>
            </div>
            <div className="p-3 border border-gray-100 rounded">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Last Attendance</p>
              <p className="text-base font-bold text-[#1B2A6B] mt-0.5">{lastAttendance}</p>
            </div>
            <div className="p-3 border border-gray-100 rounded">
              <p className="text-[10px] uppercase font-semibold text-gray-400">Status</p>
              <span className="inline-block text-[11px] font-medium text-emerald-600 mt-0.5">
                {totalReports > 0 ? "Active" : "Pending"}
              </span>
            </div>
          </div>
        )}

        {/* Submissions Feed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Branch Activity Feed
            </p>
            <span className="text-[11px] text-gray-400">Transmitted to Zone &amp; Council</span>
          </div>

          {loading ? (
            <div className="border border-gray-100 rounded divide-y divide-gray-100">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 animate-pulse space-y-2">
                  <div className="flex justify-between">
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-100 rounded w-36" />
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
              <FileText className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
              <p>No reports submitted yet for {branchName}.</p>
              <button
                onClick={() => navigate("/submit")}
                className="text-[11px] text-[#1B2A6B] font-medium hover:underline block mx-auto mt-1 cursor-pointer"
              >
                + Create service report
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 space-y-1.5">
                  <div className="flex items-start justify-between text-xs gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {rep.service_type === "SUNDAY_MEGA"
                            ? "Sunday Mega Gathering"
                            : "Midweek TTLHA Cell"}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Sent
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Date: {rep.service_date || "N/A"} &bull;{" "}
                        {rep.message_title || rep.sermon_title
                          ? `"${rep.message_title || rep.sermon_title}"`
                          : "No title"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-[#1B2A6B]">
                        {rep.total_attendance} attendees
                      </p>
                      <p className="text-[10px] text-gray-400">
                        GHS {Number(rep.total_stewardship || 0).toFixed(2)}
                      </p>
                      {canUndoReport(rep) && (
                        <button
                          onClick={() => handleUndo(rep.id)}
                          className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200 cursor-pointer mt-1"
                          title="Undo attendance submission (valid for 3h)"
                        >
                          <RotateCcw className="w-2.5 h-2.5" /> Undo ({getRemainingUndoTime(rep)})
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Sermon Audio Player */}
                  {rep.sermon_audio_data && (
                    <div className="pt-1 border-t border-gray-50">
                      <p className="text-[10px] text-gray-400 mb-1">
                        🎙 Sermon — {rep.sermon_audio_name || "audio"}
                      </p>
                      <audio
                        controls
                        src={rep.sermon_audio_data}
                        className="w-full"
                        style={{ height: "32px" }}
                      />
                    </div>
                  )}
                  {/* Google Photos Link */}
                  {rep.google_photos_url && (
                    <div className="pt-0.5">
                      <a
                        href={rep.google_photos_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#1B2A6B] font-medium hover:underline"
                      >
                        📷 View Service Photos
                      </a>
                    </div>
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
