import React from "react";
import { BottomNav } from "./BottomNav";
import { useAuth } from "../../contexts/AuthContext";

export function AppShell({ title, children, rightAction }) {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 h-13 flex items-center justify-between px-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpg" alt="Love Economy Church" className="h-7 w-auto object-contain" />
          <div className="border-l border-gray-200 pl-2.5">
            <h1 className="text-xs font-bold tracking-tight text-[#1B2A6B] uppercase leading-tight">
              LOVE ECONOMY CHURCH
            </h1>
            {title && <p className="text-[11px] text-gray-500 font-medium leading-none">{title}</p>}
          </div>
        </div>
        {rightAction ? <div>{rightAction}</div> : <div className="w-4" />}
      </header>

      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-3 pb-20">
        {children}
      </main>

      <BottomNav role={profile?.role} />
    </div>
  );
}
