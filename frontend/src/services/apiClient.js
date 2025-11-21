import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("fmt_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      error.message = "Network error. Please check your connection.";
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - clear auth and redirect
    if (error.response?.status === 401) {
      localStorage.removeItem("fmt_token");
      localStorage.removeItem("fmt_user");
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/signup")) {
        window.location.href = "/login";
      }
    }

    // Provide better error messages
    const status = error.response?.status;
    if (status >= 500) {
      error.message = "Server error. Please try again later.";
    } else if (status === 404) {
      error.message = "Resource not found.";
    }

    return Promise.reject(error);
  }
);

export default api;

