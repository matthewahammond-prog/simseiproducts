import React, { createContext, useContext, useState, useCallback } from "react";
import { Stakeholder, authenticateStakeholder, authenticateAdmin } from "@/lib/data";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  stakeholder: Stakeholder | null;
}

interface AuthContextType extends AuthState {
  loginAsStakeholder: (email: string, password: string) => boolean;
  loginAsAdmin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    isAdmin: false,
    stakeholder: null,
  });

  const loginAsStakeholder = useCallback((email: string, password: string) => {
    const stakeholder = authenticateStakeholder(email, password);
    if (stakeholder) {
      setAuth({ isAuthenticated: true, isAdmin: false, stakeholder });
      return true;
    }
    return false;
  }, []);

  const loginAsAdmin = useCallback((password: string) => {
    if (authenticateAdmin(password)) {
      setAuth({ isAuthenticated: true, isAdmin: true, stakeholder: null });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, isAdmin: false, stakeholder: null });
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, loginAsStakeholder, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
