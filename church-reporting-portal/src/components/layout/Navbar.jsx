import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Church, LogOut, FileText, LayoutDashboard, Shield, Crown } from "lucide-react";

export const Navbar = () => {
  const { profile, loginAsDemoRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navItems = [
    { to: "/submit", label: "Submit Report", icon: FileText, role: "BRANCH_PASTOR" },
    { to: "/pastor", label: "Branch Logs", icon: LayoutDashboard, role: "BRANCH_PASTOR" },
    { to: "/zonal", label: "Zonal Oversight", icon: Shield, role: "ZONAL_HEAD" },
    { to: "/executive", label: "Executive Council", icon: Crown, role: "EXECUTIVE" },
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case "EXECUTIVE":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "ZONAL_HEAD":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "BRANCH_PASTOR":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-stone-100 text-stone-700 border-stone-200";
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 text-stone-800 px-4 lg:px-8 py-3 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
              <Church className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="font-extrabold tracking-tight text-stone-900 flex items-center gap-2 text-sm sm:text-base">
                Church Reporting Portal
                <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold border border-teal-200 tracking-wide uppercase">
                  Pastoral
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {profile?.branches?.name || (profile?.zones?.name ? `${profile.zones.name}` : "Centralized Service Metrics")}
              </div>
            </div>
          </Link>

          {/* Mobile signout */}
          <button
            onClick={handleSignOut}
            className="md:hidden w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* View Switcher Pill Bar */}
        <div className="flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/70 overflow-x-auto self-stretch md:self-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.to}
                onClick={() => {
                  loginAsDemoRole(item.role);
                  navigate(item.to);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm shadow-teal-800/20"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* User Info & Signout */}
        <div className="hidden md:flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold text-stone-900">{profile?.full_name || "Pastor / Council Leader"}</div>
            <div className="text-[10px]">
              <span className={`inline-block px-2 py-0.2 rounded-full font-medium border ${getRoleBadge(profile?.role)}`}>
                {profile?.role ? profile.role.replace("_", " ") : "Authorized"}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign Out"
            className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-rose-50 hover:text-rose-600 border border-stone-200 flex items-center justify-center text-stone-500 transition-colors shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};