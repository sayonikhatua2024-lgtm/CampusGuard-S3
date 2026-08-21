import React, { createContext, useContext, useState, useCallback } from "react";
import { api, getToken, setToken, clearToken } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [username, setUsername] = useState(() => localStorage.getItem("campusguard_user"));
  const [authed, setAuthed] = useState(() => Boolean(getToken()));
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (user, pass) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(user, pass);
      setToken(res.access_token);
      localStorage.setItem("campusguard_user", res.username);
      setUsername(res.username);
      setAuthed(true);
      return true;
    } catch (e) {
      setError(e.message || "Sign in failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    localStorage.removeItem("campusguard_user");
    setAuthed(false);
    setUsername(null);
  }, []);

  return (
    <AuthContext.Provider value={{ authed, username, login, logout, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
