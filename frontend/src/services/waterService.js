import api from "./apiClient.js";

export const fetchWaterLogs = async () => {
  const { data } = await api.get("/water");
  return data;
};

export const createWaterLog = async (payload) => {
  const { data } = await api.post("/water", payload);
  return data.log;
};

export const updateWaterLog = async (id, payload) => {
  const { data } = await api.put(`/water/${id}`, payload);
  return data.log;
};

export const deleteWaterLog = async (id) => {
  await api.delete(`/water/${id}`);
};

