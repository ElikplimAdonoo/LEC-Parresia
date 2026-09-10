import React from "react";
import { NavLink } from "react-router-dom";
import { Home, FilePlus, Clock, Users, User, BarChart3 } from "lucide-react";

export function BottomNav({ role }) {
  let tabs = [];

  if (role === "EXECUTIVE") {
    tabs = [
      { to: "/executive", label: "Overview", icon: BarChart3 },
      { to: "/zonal", label: "Zones", icon: Users },
      { to: "/submit", label: "Report", icon: FilePlus },
      { to: "/profile", label: "Profile", icon: User },
    ];
  } else if (role === "ZONAL_HEAD") {
    tabs = [
      { to: "/zonal", label: "Zone", icon: Users },
      { to: "/submit", label: "Report", icon: FilePlus },
      { to: "/pastor", label: "Branches", icon: Home },
      { to: "/profile", label: "Profile", icon: User },
    ];
  } else {
    tabs = [
      { to: "/pastor", label: "Home", icon: Home },
      { to: "/submit", label: "Report", icon: FilePlus },
      { to: "/history", label: "History", icon: Clock },
      { to: "/profile", label: "Profile", icon: User },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-gray-200/80 h-14">
      <div className="max-w-lg mx-auto h-full flex items-center justify-around px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive ? "text-[#1B2A6B] font-semibold" : "text-gray-400 hover:text-gray-600"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                  <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
                  {isActive && <span className="w-1 h-1 rounded-full bg-[#1B2A6B] mt-0.5"></span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
