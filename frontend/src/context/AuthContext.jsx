import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getProfile } from "../services/authService.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("fmt_user");
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error("Error parsing cached user:", error);
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("fmt_token"));
  const [loading, setLoading] = useState(!!token); // Start loading if token exists

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fmt_user");
    localStorage.removeItem("fmt_token");
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setLoading(false);
      localStorage.removeItem("fmt_user");
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await getProfile();
        if (isMounted) {
          setUser(profile.user);
          localStorage.setItem("fmt_user", JSON.stringify(profile.user));
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [token, logout]);

  const login = useCallback(({ user: userData, token: authToken }) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fmt_user", JSON.stringify(userData));
    localStorage.setItem("fmt_token", authToken);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

