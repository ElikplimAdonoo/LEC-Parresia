import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BookOpen, Library, Bookmark, Calendar, MessageSquare, Shield, LogOut, User } from "lucide-react";

export const Navbar = () => {
  const { user, isAdmin, loginAsDemo, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const navLinks = [
    { to: "/", label: "Library", icon: Library },
    { to: "/shelf", label: "My Shelf", icon: Bookmark },
    { to: "/plans", label: "Reading Plans", icon: Calendar },
    { to: "/community", label: "Community", icon: MessageSquare },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 text-stone-800 px-4 lg:px-8 py-3 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="font-extrabold tracking-tight text-stone-900 flex items-center gap-2 text-sm sm:text-base">
              Community Reading Hub
              <span className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full font-semibold border border-teal-200 tracking-wide uppercase">
                Digital Library
              </span>
            </div>
            <div className="text-[11px] text-stone-500 font-medium">Word, Literature & Audio Reader</div>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/70">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-teal-700 text-white shadow-sm shadow-teal-800/20"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/80"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}

          <Link
            to="/admin"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              location.pathname.startsWith("/admin")
                ? "bg-rose-600 text-white shadow-sm shadow-rose-700/20"
                : "text-rose-700 hover:bg-rose-50"
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Admin Console
          </Link>
        </div>

        {/* User Identity & Logout */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-stone-900">{user?.user_metadata?.full_name || "Ama Boateng (Reader)"}</div>
            <div className="text-[10px] text-teal-700 font-medium">{isAdmin ? "Admin Supervisor" : "Church Member"}</div>
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
