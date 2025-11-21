import api from "./apiClient.js";

export const fetchSuggestions = async (goal) => {
  const params = goal ? { goal } : undefined;
  const { data } = await api.get("/suggestions", { params });
  return data.suggestions;
};

