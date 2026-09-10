import React from "react";
import { AppShell } from "../components/layout/AppShell";
import { useAuth } from "../contexts/AuthContext";
import { Building2 } from "lucide-react";

export function ZonalDashboard() {
  const { profile } = useAuth();

  return (
    <AppShell title="Zone Overview">
      <div className="space-y-6 pt-2">
        <div className="pb-3 border-b border-gray-100">
          <p className="text-xs text-gray-400">Zonal Leadership</p>
          <h2 className="text-sm font-semibold text-gray-900">
            {profile?.full_name || "Rev. Zonal Head"}
          </h2>
          <p className="text-[11px] text-[#1B2A6B] font-medium mt-0.5">
            {profile?.zones?.name || "Zone 1 - Greater Accra"}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Branches</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Submitted</p>
            <p className="text-base font-bold text-gray-900 mt-0.5">—</p>
          </div>
          <div className="p-3 border border-gray-100 rounded">
            <p className="text-[10px] uppercase font-semibold text-gray-400">Compliance</p>
            <p className="text-base font-bold text-emerald-600 mt-0.5">—</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            Branch Reports
          </p>
          <div className="border border-gray-100 rounded p-6 text-center text-gray-400 text-xs space-y-1.5">
            <Building2 className="w-6 h-6 stroke-[1.25] mx-auto text-gray-300" />
            <p>Branch reports will appear here once submitted.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
