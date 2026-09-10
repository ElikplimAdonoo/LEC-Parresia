import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { ShieldAlert, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const SuspendedPage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Account Under Review</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Your access to the Community Reading Hub has been temporarily restricted by church moderation. Please contact leadership to review account permissions.
        </p>
        <button
          onClick={handleSignOut}
          className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};