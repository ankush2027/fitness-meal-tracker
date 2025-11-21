import { useEffect, useState } from "react";
import {
  createMeal,
  deleteMeal,
  fetchMeals,
  updateMeal,
} from "../services/mealService.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const defaultForm = {
  meal_name: "",
  meal_type: "breakfast",
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  meal_date: new Date().toISOString().slice(0, 10),
};

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadMeals = async () => {
    try {
      setLoading(true);
      const data = await fetchMeals();
      setMeals(data);
      setError("");
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Unable to load meals";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeals();
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
        await updateMeal(editingId, form);
        toast.success("Meal updated successfully!");
      } else {
        await createMeal(form);
        toast.success("Meal added successfully!");
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadMeals();
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.message || "Unable to save meal";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (meal) => {
    setForm({
      meal_name: meal.meal_name,
      meal_type: meal.meal_type,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats,
      meal_date: meal.meal_date.slice(0, 10),
    });
    setEditingId(meal.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this meal? This action cannot be undone.")) {
      return;
    }
    setError("");
    try {
      await deleteMeal(id);
      toast.success("Meal deleted successfully!");
      await loadMeals();
    } catch (err) {
      const errorMsg = err.message || err.response?.data?.message || "Unable to delete meal";
      setError(errorMsg);
      toast.error(errorMsg);
    }
  };

  return (
    <div className="page">
      <h1>Meal Tracker</h1>
      {error && <p className="error-text">{error}</p>}
      <div className="responsive-grid">
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Meal" : "Add Meal"}</h3>
          <label>
            Name
            <input
              name="meal_name"
              value={form.meal_name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Type
            <select name="meal_type" value={form.meal_type} onChange={handleChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </label>
          <label>
            Calories
            <input
              type="number"
              name="calories"
              value={form.calories}
              min={0}
              onChange={handleChange}
            />
          </label>
          <div className="macro-grid">
            <label>
              Protein (g)
              <input
                type="number"
                name="protein"
                value={form.protein}
                min={0}
                onChange={handleChange}
              />
            </label>
            <label>
              Carbs (g)
              <input
                type="number"
                name="carbs"
                value={form.carbs}
                min={0}
                onChange={handleChange}
              />
            </label>
            <label>
              Fats (g)
              <input
                type="number"
                name="fats"
                value={form.fats}
                min={0}
                onChange={handleChange}
              />
            </label>
          </div>
          <label>
            Date
            <input
              type="date"
              name="meal_date"
              value={form.meal_date}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update" : "Add"} Meal
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
          <h3>Logged Meals</h3>
          {loading ? (
            <LoadingSpinner text="Loading meals..." />
          ) : meals.length === 0 ? (
            <div className="empty-state">
              <p>No meals logged yet. Add your first meal above!</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Calories</th>
                    <th>Macros (P/C/F)</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meals.map((meal) => (
                    <tr key={meal.id}>
                      <td>{meal.meal_name}</td>
                      <td className="capitalize">{meal.meal_type}</td>
                      <td>{meal.calories}</td>
                      <td>
                        {meal.protein}g/{meal.carbs}g/{meal.fats}g
                      </td>
                      <td>{meal.meal_date?.slice(0, 10)}</td>
                      <td>
                        <button
                          type="button"
                          className="link"
                          onClick={() => handleEdit(meal)}
                          aria-label={`Edit ${meal.meal_name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="link danger"
                          onClick={() => handleDelete(meal.id)}
                          aria-label={`Delete ${meal.meal_name}`}
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

export default Meals;

