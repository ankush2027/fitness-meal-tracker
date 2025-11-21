import api from "./apiClient.js";

export const fetchWorkouts = async () => {
  const { data } = await api.get("/workouts");
  return data.workouts;
};

export const createWorkout = async (payload) => {
  const { data } = await api.post("/workouts", payload);
  return data.workout;
};

export const updateWorkout = async (id, payload) => {
  const { data } = await api.put(`/workouts/${id}`, payload);
  return data.workout;
};

export const deleteWorkout = async (id) => {
  await api.delete(`/workouts/${id}`);
};

