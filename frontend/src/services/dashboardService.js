import api from "./apiClient.js";

export const fetchDashboard = async () => {
  const { data } = await api.get("/dashboard");
  return data;
};

