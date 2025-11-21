import api from "./apiClient.js";

export const fetchMeals = async () => {
  const { data } = await api.get("/meals");
  return data.meals;
};

export const createMeal = async (payload) => {
  const { data } = await api.post("/meals", payload);
  return data.meal;
};

export const updateMeal = async (id, payload) => {
  const { data } = await api.put(`/meals/${id}`, payload);
  return data.meal;
};

export const deleteMeal = async (id) => {
  await api.delete(`/meals/${id}`);
};

