import React from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { Plus, FileText } from "lucide-react";

export function PastorDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell title="Pastor Home">
      <div className="space-y-6 pt-2">
        <div className="flex justify-between items-start pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Welcome,</p>
            <h2 className="text-sm font-semibold text-gray-900">
              {profile?.full_name || "Branch Pastor"}
            </h2>
            <p className="text-[11px] text-[#1B2A6B] font-medium mt-0.5">
              {profile?.branches?.name || "Love Economy Church Branch"}
            </p>
          </div>
          <button
            onClick={() => navigate("/submit")}
            className="flex items-center gap-1 bg-[#1B2A6B] text-white text-xs font-medium px-3 py-1.5 rounded hover:bg-[#152152] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            Submit
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">This Week</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Attendance</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Status</p>
            <span className="inline-block text-[11px] font-medium text-emerald-600 mt-0.5">
              Ready
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              Recent Submissions
            </p>
          </div>

          <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
            <FileText className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
            <p>No reports submitted yet for this cycle.</p>
            <button
              onClick={() => navigate("/submit")}
              className="text-[11px] text-[#1B2A6B] font-medium hover:underline block mx-auto mt-1"
            >
              + Create first report
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
