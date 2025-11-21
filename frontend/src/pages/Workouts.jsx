import { useEffect, useState } from "react";
import {
  createWorkout,
  deleteWorkout,
  fetchWorkouts,
  updateWorkout,
} from "../services/workoutService.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const defaultForm = {
  workout_type: "",
  duration_minutes: 30,
  calories_burned: 0,
  workout_date: new Date().toISOString().slice(0, 10),
};

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkouts();
      setWorkouts(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load workouts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (editingId) {
        await updateWorkout(editingId, form);
        toast.success("Workout updated successfully!");
      } else {
        await createWorkout(form);
        toast.success("Workout added successfully!");
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadWorkouts();
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.message || "Unable to save workout";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (workout) => {
    setForm({
      workout_type: workout.workout_type,
      duration_minutes: workout.duration_minutes,
      calories_burned: workout.calories_burned,
      workout_date: workout.workout_date.slice(0, 10),
    });
    setEditingId(workout.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout? This action cannot be undone.")) {
      return;
    }
    setError("");
    try {
      await deleteWorkout(id);
      toast.success("Workout deleted successfully!");
      await loadWorkouts();
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.message || "Unable to delete workout";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="page">
      <h1>Workout Tracker</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="responsive-grid">
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Workout" : "Add Workout"}</h3>
          <label>
            Type
            <input
              name="workout_type"
              value={form.workout_type}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Duration (minutes)
            <input
              type="number"
              name="duration_minutes"
              value={form.duration_minutes}
              min={1}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Calories burned
            <input
              type="number"
              name="calories_burned"
              value={form.calories_burned}
              min={0}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date
            <input
              type="date"
              name="workout_date"
              value={form.workout_date}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update" : "Add"} Workout
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(defaultForm);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="card">
          <h3>Recent Workouts</h3>
          {loading ? (
            <LoadingSpinner text="Loading workouts..." />
          ) : workouts.length === 0 ? (
            <div className="empty-state">
              <p>No workouts logged yet. Add your first workout above!</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Duration</th>
                    <th>Calories</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workouts.map((workout) => (
                    <tr key={workout.id}>
                      <td>{workout.workout_type}</td>
                      <td>{workout.duration_minutes} min</td>
                      <td>{workout.calories_burned}</td>
                      <td>{workout.workout_date?.slice(0, 10)}</td>
                      <td>
                        <button
                          type="button"
                          className="link"
                          onClick={() => handleEdit(workout)}
                          aria-label={`Edit ${workout.workout_type} workout`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="link danger"
                          onClick={() => handleDelete(workout.id)}
                          aria-label={`Delete ${workout.workout_type} workout`}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workouts;

