import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports } from "../lib/reportStore";
import { getAccraGreeting } from "../lib/timeGreeting";
import { Plus, FileText, CheckCircle2 } from "lucide-react";

export function PastorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);

  const pastorName = profile?.full_name || "Rev. Makafui Tetteh Kumahlor";
  const branchName = profile?.branches?.name || "Parresia";

  useEffect(() => {
    let isMounted = true;
    getStoredReports().then((all) => {
      if (!isMounted) return;
      const branchReports = all.filter(
        (r) => !r.branch_name || r.branch_name.toLowerCase() === branchName.toLowerCase()
      );
      setReports(branchReports.length > 0 ? branchReports : all);
    });
    return () => {
      isMounted = false;
    };
  }, [branchName]);

  const totalReports = reports.length;
  const latestReport = reports[0];
  const lastAttendance = latestReport ? latestReport.total_attendance : "—";

  return (
    <AppShell unitName={branchName}>
      <div className="space-y-6 pt-2">
        {/* Mockup-style Greeting Header */}
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

        {/* Quick Minimal Stats */}
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

        {/* Submissions Feed */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Branch Activity Feed
            </p>
            <span className="text-[11px] text-gray-400">Transmitted to Zone & Council</span>
          </div>

          {reports.length === 0 ? (
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
                <div key={rep.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">
                        {rep.service_type === "SUNDAY_MEGA" ? "Sunday Mega Gathering" : "Midweek TTLHA Cell"}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Sent
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Date: {rep.service_date || "N/A"} &bull; {rep.message_title || rep.sermon_title ? `"${rep.message_title || rep.sermon_title}"` : "No title"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1B2A6B]">
                      {rep.total_attendance} attendees
                    </p>
                    <p className="text-[10px] text-gray-400">
                      GHS {Number(rep.total_stewardship || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
