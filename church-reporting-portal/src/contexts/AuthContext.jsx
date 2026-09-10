import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

const DEMO_PROFILES = {
  BRANCH_PASTOR: {
    id: "demo-pastor-id",
    full_name: "Pastor Paul Mensah",
    phone: "+233 24 123 4567",
    role: "BRANCH_PASTOR",
    approved: true,
    branches: {
      id: "demo-branch-1",
      name: "Accra Central Mega Branch",
      gathering_center: "Main Sanctuary (LC Live)",
      zones: { id: "demo-zone-1", name: "Zone 1 - Greater Accra" },
    },
  },
  ZONAL_HEAD: {
    id: "demo-zonal-id",
    full_name: "Rev. Emmanuel Quaye",
    phone: "+233 20 987 6543",
    role: "ZONAL_HEAD",
    approved: true,
    zones: { id: "demo-zone-1", name: "Zone 1 - Greater Accra" },
  },
  EXECUTIVE: {
    id: "demo-exec-id",
    full_name: "Bishop / Executive Council ('Daddy')",
    phone: "+233 50 111 2222",
    role: "EXECUTIVE",
    approved: true,
  },
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("portal_demo_role");
    if (saved && DEMO_PROFILES[saved]) {
      return { id: DEMO_PROFILES[saved].id, email: "pastor@pastortee.org" };
    }
    return null;
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("portal_demo_role");
    return saved && DEMO_PROFILES[saved] ? DEMO_PROFILES[saved] : null;
  });
  const [loading, setLoading] = useState(false);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*, branches(*, zones(*)), zones(*)")
        .eq("id", userId)
        .maybeSingle();

      if (error) return null;
      if (data) setProfile(data);
      return data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!profile) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          fetchProfile(session.user.id);
        }
      });
    }
  }, []);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) throw error;
  };

  const loginAsDemoRole = (roleKey) => {
    const demo = DEMO_PROFILES[roleKey];
    if (demo) {
      setUser({ id: demo.id, email: `${roleKey.toLowerCase()}@pastortee.org` });
      setProfile(demo);
      localStorage.setItem("portal_demo_role", roleKey);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("portal_demo_role");
    setUser(null);
    setProfile(null);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  const refreshProfile = async () => {
    if (user && !localStorage.getItem("portal_demo_role")) {
      return await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        signInWithGoogle,
        loginAsDemoRole,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);