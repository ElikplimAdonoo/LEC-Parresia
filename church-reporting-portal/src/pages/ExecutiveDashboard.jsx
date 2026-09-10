import React from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { BarChart3 } from "lucide-react";

export function ExecutiveDashboard() {
  const { profile } = useAuth();

  return (
    <AppShell title="Executive Council ('Daddy')">
      <div className="space-y-6 pt-2">
        <div className="pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">Leadership Council</p>
          <h2 className="text-sm font-semibold text-gray-900">
            Executive Overview
          </h2>
          <p className="text-[11px] text-[#1B2A6B] font-medium mt-0.5">
            Love Economy Church Worldwide
          </p>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Attendance</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Branches</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Converts</p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-2.5 border border-gray-100 rounded">
            <p className="text-[9px] uppercase font-semibold text-gray-400">Compliance</p>
            <p className="text-sm font-bold text-emerald-600 mt-0.5">—</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Attendance Trajectory
          </p>
          <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
            <BarChart3 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
            <p>Live metrics and graphs will populate as branch pastors submit their reports.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
