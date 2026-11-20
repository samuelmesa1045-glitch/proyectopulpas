import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pulpas-session")) || null; }
    catch { return null; }
  });

  const signIn = (nextSession) => {
    localStorage.setItem("pulpas-session", JSON.stringify(nextSession));
    setSession(nextSession);
  };

  const signOut = () => {
    localStorage.removeItem("pulpas-session");
    setSession(null);
  };

  const value = useMemo(() => ({ session, signIn, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
