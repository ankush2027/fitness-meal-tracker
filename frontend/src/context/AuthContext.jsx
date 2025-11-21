import { createContext, useContext, useEffect, useState } from "react";
import { getProfile } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("fmt_user");
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("fmt_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setUser(null);
      localStorage.removeItem("fmt_user");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();
        setUser(profile.user);
        localStorage.setItem("fmt_user", JSON.stringify(profile.user));
      } catch (error) {
        console.error(error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const login = ({ user: userData, token: authToken }) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fmt_user", JSON.stringify(userData));
    localStorage.setItem("fmt_token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fmt_user");
    localStorage.removeItem("fmt_token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

