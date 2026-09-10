import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { getPastoralAccounts, updatePastoralAccount } from "../lib/pastorAccounts";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  // Initialize with saved session or null so users land on Login page by default
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedId = localStorage.getItem("portal_active_account_id");
      if (!savedId) return null;
      const accounts = getPastoralAccounts();
      return accounts.find((a) => a.id === savedId) || null;
    } catch {
      return null;
    }
  });

  // Current active role for multi-role ministers (e.g. Pastor vs Zonal Head vs Executive)
  const [activeRole, setActiveRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem("portal_active_role");
      if (savedRole) return savedRole;
      const savedId = localStorage.getItem("portal_active_account_id");
      if (savedId) {
        const accounts = getPastoralAccounts();
        const found = accounts.find((a) => a.id === savedId);
        return found?.default_role || "BRANCH_PASTOR";
      }
      return "BRANCH_PASTOR";
    } catch {
      return "BRANCH_PASTOR";
    }
  });

  const [loading, setLoading] = useState(false);

  // Login as a designated minister account with selected initial role
  const loginWithAccount = (accountId, initialRole = null) => {
    const accounts = getPastoralAccounts();
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      const roleToSet = initialRole || account.default_role || account.assigned_roles[0];
      setCurrentUser(account);
      setActiveRole(roleToSet);
      localStorage.setItem("portal_active_account_id", account.id);
      localStorage.setItem("portal_active_role", roleToSet);
    }
  };

  // Switch role on the fly for multi-role accounts (e.g. Rev. Makafui toggling Branch vs Zone vs Council)
  const switchRole = (newRole) => {
    if (currentUser?.assigned_roles?.includes(newRole)) {
      setActiveRole(newRole);
      localStorage.setItem("portal_active_role", newRole);
    }
  };

  // Update profile details (Name, Phone, Branch, Avatar, etc.)
  const updateProfile = (updatedFields) => {
    if (!currentUser) return;
    const merged = { ...currentUser, ...updatedFields };
    updatePastoralAccount(merged);
    setCurrentUser(merged);
  };

  // Sign out cleanly to return to Login page
  const signOut = async () => {
    localStorage.removeItem("portal_active_account_id");
    localStorage.removeItem("portal_active_role");
    setCurrentUser(null);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  // Build structured profile representation expected across the app
  const profile = currentUser
    ? {
        id: currentUser.id,
        full_name: currentUser.full_name,
        phone: currentUser.phone,
        email: currentUser.email,
        role: activeRole, // currently selected role view
        assigned_roles: currentUser.assigned_roles || [activeRole],
        avatar: currentUser.avatar,
        branches: {
          id: "branch-" + currentUser.branch_name.toLowerCase().replace(/\s+/g, "-"),
          name: currentUser.branch_name,
          gathering_center: currentUser.gathering_center || "LC Live Center",
          zones: { name: currentUser.zone_name || "Central Zone" },
        },
        zones: { name: currentUser.zone_name || "Central Zone" },
        approved: true,
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        user: currentUser ? { id: currentUser.id, email: currentUser.email } : null,
        profile,
        activeRole,
        assignedRoles: currentUser?.assigned_roles || [],
        loginWithAccount,
        switchRole,
        updateProfile,
        signOut,
        signInWithGoogle,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
