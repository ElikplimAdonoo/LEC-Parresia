import React, { useEffect, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { getStoredReports } from "../lib/reportStore";
import { getAccraGreeting } from "../lib/timeGreeting";
import { Building2, CheckCircle2 } from "lucide-react";

export function ZonalDashboard() {
  const { profile } = useAuth();
  const [reports, setReports] = useState([]);

  const zoneLeader = profile?.full_name || "Rev. Makafui Tetteh Kumahlor";
  const zoneName = profile?.zones?.name || "Central Zone";

  useEffect(() => {
    let isMounted = true;
    getStoredReports().then((data) => {
      if (isMounted) setReports(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const totalReports = reports.length;
  const totalAttendance = reports.reduce((acc, curr) => acc + (parseInt(curr.total_attendance) || 0), 0);

  return (
    <AppShell unitName={zoneName}>
      <div className="space-y-6 pt-2">
        {/* Mockup-style Greeting Header */}
        <div className="pb-4 border-b border-gray-100 space-y-1">
          <p className="text-[10px] font-bold tracking-[0.16em] text-gray-400 uppercase">
            {getAccraGreeting()}
          </p>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {zoneLeader}
          </h2>
          <p className="text-xs text-gray-500 font-normal">
            Here is what is happening in your Zone ({zoneName})
          </p>
        </div>

        {/* Real-time Zone Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Reports In</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">{totalReports}</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Zone Attendance</p>
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
              <p className="text-[11px] text-gray-400">Submissions from Parresia and other branches reflect here instantly.</p>
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
