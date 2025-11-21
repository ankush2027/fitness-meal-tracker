import { useEffect, useState } from "react";
import {
  createMeal,
  deleteMeal,
  fetchMeals,
  updateMeal,
} from "../services/mealService.js";

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

  const loadMeals = async () => {
    try {
      const data = await fetchMeals();
      setMeals(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load meals");
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
    try {
      if (editingId) {
        await updateMeal(editingId, form);
      } else {
        await createMeal(form);
      }
      setForm(defaultForm);
      setEditingId(null);
      loadMeals();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save meal");
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
    if (!window.confirm("Delete this meal?")) return;
    try {
      await deleteMeal(id);
      loadMeals();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to delete meal");
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
            <button type="submit" className="btn">
              {editingId ? "Update" : "Add"} Meal
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
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Calories</th>
                <th>Macros (P/C/F)</th>
                <th>Date</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id}>
                  <td>{meal.meal_name}</td>
                  <td>{meal.meal_type}</td>
                  <td>{meal.calories}</td>
                  <td>
                    {meal.protein}/{meal.carbs}/{meal.fats}
                  </td>
                  <td>{meal.meal_date?.slice(0, 10)}</td>
                  <td>
                    <button type="button" className="link" onClick={() => handleEdit(meal)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="link danger"
                      onClick={() => handleDelete(meal.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Meals;

