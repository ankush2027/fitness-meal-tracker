import api from "./apiClient.js";

export const fetchBodyMetrics = async () => {
  const { data } = await api.get("/body-metrics");
  return data.metrics;
};

export const createBodyMetric = async (payload) => {
  const { data } = await api.post("/body-metrics", payload);
  return data.metric;
};

export const updateBodyMetric = async (id, payload) => {
  const { data } = await api.put(`/body-metrics/${id}`, payload);
  return data.metric;
};

export const deleteBodyMetric = async (id) => {
  await api.delete(`/body-metrics/${id}`);
};

