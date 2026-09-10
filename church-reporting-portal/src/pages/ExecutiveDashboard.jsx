import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports } from "../lib/reportStore";
import { BarChart3, CheckCircle2, ShieldCheck } from "lucide-react";

export function ExecutiveDashboard() {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getStoredReports());
  }, []);

  const totalReports = reports.length;
  const totalAttendance = reports.reduce((acc, curr) => acc + (parseInt(curr.total_attendance) || 0), 0);
  const totalFinance = reports.reduce((acc, curr) => acc + (parseFloat(curr.total_stewardship) || 0), 0);
  const totalConverts = reports.reduce((acc, curr) => acc + (parseInt(curr.new_converts) || 0), 0);
  const totalFirstTimers = reports.reduce((acc, curr) => acc + (parseInt(curr.first_timers) || 0), 0);

  return (
    <AppShell
      brandTitle="Executive Council ('Daddy')"
      title="Worldwide Overview"
      subtitle="Executive Leadership Console"
    >
      <div className="space-y-6 pt-2">
        {/* Council Banner */}
        <div className="pb-3 border-b border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400">Presiding Bishop & Council</p>
            <h2 className="text-sm font-semibold text-gray-900">
              Executive Pastoral Council
            </h2>
            <p className="text-[11px] text-[#1B2A6B] font-medium mt-0.5">
              Love Economy Church Worldwide
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <ShieldCheck className="w-3 h-3" /> Live Feed
          </span>
        </div>

        {/* Global Live Summary */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Total Attendance</p>
            <p className="text-sm font-bold text-[#1B2A6B] mt-0.5">
              {totalReports > 0 ? totalAttendance : "—"}
            </p>
          </div>
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Reports In</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {totalReports}
            </p>
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

        {/* All Submissions Flowing Directly into Council */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Live Submissions from Branches & Zones
            </p>
            <span className="text-[11px] text-gray-400">Reflecting Central Zone & Parresia</span>
          </div>

          {reports.length === 0 ? (
            <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
              <BarChart3 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
              <p>No reports transmitted yet from the field.</p>
              <p className="text-[11px] text-gray-400">Submissions from Branch Pastors and Zonal Heads will appear here instantly.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
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
                    {rep.sermon_title && (
                      <p className="text-[10px] text-gray-500 italic">
                        \"{rep.sermon_title}\" {rep.preacher ? `by ${rep.preacher}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-[#1B2A6B]">
                      {rep.total_attendance} attendees
                    </p>
                    <p className="text-[10px] text-gray-500">
                      GHS {Number(rep.total_stewardship || 0).toFixed(2)}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[9px] text-emerald-600 bg-emerald-50 px-1 rounded">
                      <CheckCircle2 className="w-2 h-2" /> Received
                    </span>
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
