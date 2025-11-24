import api from "./apiClient.js";

export const fetchWellnessLogs = async () => {
  const { data } = await api.get("/wellness");
  return data;
};

export const createWellnessLog = async (payload) => {
  const { data } = await api.post("/wellness", payload);
  return data.log;
};

export const updateWellnessLog = async (id, payload) => {
  const { data } = await api.put(`/wellness/${id}`, payload);
  return data.log;
};

export const deleteWellnessLog = async (id) => {
  await api.delete(`/wellness/${id}`);
};

