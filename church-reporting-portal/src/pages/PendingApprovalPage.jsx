import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Clock, CheckCircle2, ShieldAlert, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PendingApprovalPage = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-4 animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold text-white">Verification in Progress</h2>
        <p className="text-xs text-amber-400 font-medium mt-1">Pending Pastoral Administration Approval</p>

        <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
          Welcome, <span className="text-zinc-200 font-semibold">{profile?.full_name || user?.email}</span>. Your account registration has been submitted and is currently being verified by church leadership.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-400">Assigned Role:</span>
            <span className="text-white font-medium">{profile?.role || "Pending"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Branch / GC:</span>
            <span className="text-white font-medium">{profile?.branches?.name || "Pending allocation"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-400">Alert Phone:</span>
            <span className="text-white font-medium">{profile?.phone || "None"}</span>
          </div>
        </div>

        <p className="text-xs text-zinc-500">
          Once confirmed, you will receive full access to submit weekly service reports and review metrics.
        </p>

        <button
          onClick={handleSignOut}
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out & Check Later
        </button>
      </div>
    </div>
  );
};
