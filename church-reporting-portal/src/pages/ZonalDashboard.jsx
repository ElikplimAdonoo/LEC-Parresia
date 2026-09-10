import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { Navbar } from "../components/layout/Navbar";
import {
  Users,
  DollarSign,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  Layers,
  Building,
  CheckCircle2,
} from "lucide-react";

export const ZonalDashboard = () => {
  const { profile } = useAuth();
  const [filterService, setFilterService] = useState("ALL");

  const mockBranches = [
    { id: "b1", name: "Accra Central Mega Branch", gc: "Main Sanctuary" },
    { id: "b2", name: "Tema Community Branch", gc: "Grace Pavilion" },
    { id: "b3", name: "Madina Harvest Campus", gc: "Rehoboth Center" },
    { id: "b4", name: "Kasoa Victory Branch", gc: "Victory Hall" },
  ];

  const mockReports = [
    { id: "r1", branch: "Accra Central Mega Branch", date: "2026-09-06", type: "SUNDAY", att: 279, fin: 12450, souls: 35, cellsHeld: "11 / 12" },
    { id: "r2", branch: "Tema Community Branch", date: "2026-09-06", type: "SUNDAY", att: 184, fin: 8200, souls: 22, cellsHeld: "8 / 8" },
    { id: "r3", branch: "Madina Harvest Campus", date: "2026-09-06", type: "SUNDAY", att: 142, fin: 5600, souls: 18, cellsHeld: "6 / 7" },
    { id: "r4", branch: "Kasoa Victory Branch", date: "2026-09-06", type: "SUNDAY", att: 210, fin: 9100, souls: 29, cellsHeld: "9 / 10" },
  ];

  const filteredReports = mockReports.filter((r) => {
    if (filterService === "ALL") return true;
    return r.type === filterService;
  });

  const totalZoneAttendance = filteredReports.reduce((sum, r) => sum + r.att, 0);
  const totalZoneFinance = filteredReports.reduce((sum, r) => sum + r.fin, 0);
  const totalZoneSouls = filteredReports.reduce((sum, r) => sum + r.souls, 0);

  return (
    <div className="min-h-screen bg-[#FBF9F5] pb-24">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" />
              Zonal Oversight Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {profile?.zones?.name || "Zone 1 - Greater Accra"} Executive Overview
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Supervising {mockBranches.length} physical church campuses &bull; Real-time aggregation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
              className="bg-white border border-stone-200 text-xs font-bold text-stone-700 px-4 py-2.5 rounded-2xl focus:outline-none focus:border-teal-600 shadow-2xs"
            >
              <option value="ALL">All Services Combined</option>
              <option value="SUNDAY">Sunday Mega Gathering Only</option>
              <option value="MIDWEEK">Midweek TTLHA Cell Only</option>
            </select>
          </div>
        </div>

        {/* Aggregate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-teal-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Zone Attendance</span>
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-teal-900 mt-2">
              {totalZoneAttendance.toLocaleString()}
            </div>
            <span className="text-[11px] text-teal-700 font-medium mt-1 block">Across all {mockBranches.length} branches</span>
          </div>

          <div className="bg-white border border-emerald-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Total Giving (GHC)</span>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-700 mt-2">
              GHC {totalZoneFinance.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Offerings, tithes & busing</span>
          </div>

          <div className="bg-white border border-rose-100 p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Harvest Souls Won</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-rose-600 mt-2">
              {totalZoneSouls.toLocaleString()}
            </div>
            <span className="text-[11px] text-rose-500 font-medium mt-1 block">Altar call, cell & outreach</span>
          </div>
        </div>

        {/* Branch Reports Table */}
        <div className="bg-white border border-stone-200/90 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Branch Submissions & Compliance</h2>
            <span className="text-xs text-stone-400 font-medium">{filteredReports.length} branch logs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/70 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-100">
                <tr>
                  <th className="py-3.5 px-6">Branch</th>
                  <th className="py-3.5 px-6">Service Date</th>
                  <th className="py-3.5 px-6">Type</th>
                  <th className="py-3.5 px-6">Attendance</th>
                  <th className="py-3.5 px-6">Stewardship</th>
                  <th className="py-3.5 px-6">Souls Won</th>
                  <th className="py-3.5 px-6">Cells Executed</th>
                  <th className="py-3.5 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-stone-900">{r.branch}</td>
                    <td className="py-4 px-6 text-stone-600">{r.date}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        {r.type}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-black text-stone-900">{r.att}</td>
                    <td className="py-4 px-6 text-emerald-700 font-bold">
                      GHC {r.fin.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-rose-600 font-bold">{r.souls}</td>
                    <td className="py-4 px-6 font-medium text-stone-600">{r.cellsHeld}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                        <CheckCircle2 className="w-3 h-3" /> Submitted
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
