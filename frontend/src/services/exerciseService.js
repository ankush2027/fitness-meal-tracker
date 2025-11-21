import api from "./apiClient.js";

export const fetchExercises = async (query = "") => {
  const { data } = await api.get("/exercises", {
    params: query ? { q: query } : undefined,
  });
  return data.exercises;
};

