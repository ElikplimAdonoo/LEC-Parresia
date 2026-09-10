import React from "react";
import { BottomNav } from "./BottomNav";
import { useAuth } from "../../contexts/AuthContext";

export function AppShell({ title, subtitle, brandTitle, children, rightAction }) {
  const { profile } = useAuth();

  // If brandTitle is provided, use it (e.g. Pastor's name); otherwise default to LOVE ECONOMY CHURCH
  const headerBrand = brandTitle || "LOVE ECONOMY CHURCH";

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      {/* Clean top bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100 h-15 flex items-center justify-between px-4 max-w-xl mx-auto w-full">
        <div className="flex items-center gap-3">
          {/* Logo enlarged and more prominent (+80%) */}
          <img
            src="/logo.jpg"
            alt="Love Economy Church"
            className="h-11 w-auto object-contain shrink-0"
          />
          <div className="border-l border-gray-200 pl-3">
            <h1 className="text-xs font-bold tracking-tight text-[#1B2A6B] uppercase leading-tight truncate max-w-[240px]">
              {headerBrand}
            </h1>
            {title && (
              <p className="text-[11px] text-gray-500 font-medium leading-none mt-0.5 truncate max-w-[240px]">
                {title}
              </p>
            )}
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-normal leading-none mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {rightAction ? <div>{rightAction}</div> : <div className="w-4" />}
      </header>

      {/* Main scrollable body */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 pt-3 pb-20">
        {children}
      </main>

      {/* Persistent Bottom Tab Bar */}
      <BottomNav role={profile?.role} />
    </div>
  );
}
