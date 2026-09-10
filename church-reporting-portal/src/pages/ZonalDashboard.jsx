import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports } from "../lib/reportStore";
import { Building2, CheckCircle2, ChevronRight } from "lucide-react";

export function ZonalDashboard() {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    setReports(getStoredReports());
  }, []);

  const totalReports = reports.length;
  const totalAttendance = reports.reduce((acc, curr) => acc + (parseInt(curr.total_attendance) || 0), 0);
  const totalFinance = reports.reduce((acc, curr) => acc + (parseFloat(curr.total_stewardship) || 0), 0);

  return (
    <AppShell
      brandTitle="Central Zone Leadership"
      title="Zone Overview"
      subtitle="Zonal Head Portal"
    >
      <div className="space-y-6 pt-2">
        {/* Zonal Header */}
        <div className="pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">Zonal Head</p>
          <h2 className="text-sm font-semibold text-gray-900">
            {profile?.full_name || "Rev. Emmanuel Quaye"}
          </h2>
          <p className="text-[11px] text-[#1B2A6B] font-medium mt-0.5">
            Central Zone &bull; Overseeing Parresia & District Branches
          </p>
        </div>

        {/* Real-time Zone Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Reports In</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{totalReports}</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Zonal Attendance</p>
            <p className="text-base font-bold text-[#1B2A6B] mt-0.5">{totalAttendance}</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Compliance</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">
              {totalReports > 0 ? "100%" : "—"}
            </p>
          </div>
        </div>

        {/* Branch Reports Flow */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Branch Submissions Received
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Auto-forwarded to Council</span>
          </div>

          {reports.length === 0 ? (
            <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
              <Building2 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
              <p>No branch reports received yet for Central Zone.</p>
              <p className="text-[11px] text-gray-400">Reports submitted by Branch Pastors will immediately reflect here.</p>
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
                      <span className="text-[11px] text-gray-500">
                        ({rep.pastor_name || "Rev. Makafui Tetteh Kumahlor"})
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400">
                      {rep.service_type === "SUNDAY_MEGA" ? "Sunday Mega Gathering" : "Midweek TTLHA Cell"} &bull; {rep.service_date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1B2A6B]">
                      {rep.total_attendance} attendees
                    </p>
                    <p className="text-[10px] text-emerald-600 flex items-center gap-0.5 justify-end">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Transmitted
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
