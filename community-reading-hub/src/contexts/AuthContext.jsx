import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

const DEMO_USERS = {
  MEMBER: {
    user: { id: "demo-reader-id", email: "reader@pastortee.org", user_metadata: { full_name: "Ama Boateng (Reader)" } },
    role: { role: "MEMBER", status: "ACTIVE" },
  },
  ADMIN: {
    user: { id: "demo-admin-id", email: "admin@pastortee.org", user_metadata: { full_name: "Library Supervisor (Admin)" } },
    role: { role: "ADMIN", status: "ACTIVE" },
  },
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("hub_demo_role");
    return saved && DEMO_USERS[saved] ? DEMO_USERS[saved].user : DEMO_USERS.MEMBER.user;
  });
  const [userRole, setUserRole] = useState(() => {
    const saved = localStorage.getItem("hub_demo_role");
    return saved && DEMO_USERS[saved] ? DEMO_USERS[saved].role : DEMO_USERS.MEMBER.role;
  });
  const [loading, setLoading] = useState(false);

  const fetchRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) return null;
      if (data) setUserRole(data);
      return data;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (!user) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session?.user) {
          setUser(session.user);
          fetchRole(session.user.id);
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

  const loginAsDemo = (roleKey) => {
    const demo = DEMO_USERS[roleKey];
    if (demo) {
      setUser(demo.user);
      setUserRole(demo.role);
      localStorage.setItem("hub_demo_role", roleKey);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("hub_demo_role");
    setUser(null);
    setUserRole(null);
    try {
      await supabase.auth.signOut();
    } catch {}
  };

  const isAdmin = userRole?.role === "ADMIN" || user?.email?.includes("admin");
  const isSuspended = userRole?.status === "SUSPENDED" || userRole?.status === "REMOVED";

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userRole,
        isAdmin,
        isSuspended,
        loading,
        signInWithGoogle,
        loginAsDemo,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);