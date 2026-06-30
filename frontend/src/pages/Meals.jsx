import { useEffect, useState } from "react";
import {
  deleteMeal,
  fetchMeals,
  analyzeAndSaveMeal,
} from "../services/mealService.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const defaultForm = {
  query: "",
  meal_type: "breakfast",
  meal_date: new Date().toISOString().slice(0, 10),
};

const Meals = () => {
  const [meals, setMeals] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // States for unresolved food clarifications
  const [clarificationData, setClarificationData] = useState(null);
  const [clarifiedValues, setClarifiedValues] = useState({});

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
    setAnalysisResult(null);
    try {
      const payload = {
        query: form.query,
        meal_type: form.meal_type,
        meal_date: form.meal_date,
      };
      if (editingId) {
        payload.id = editingId;
      }
      
      const response = await analyzeAndSaveMeal(payload);
      
      // Check if backend requested clarification for unrecognized foods
      if (response.needs_clarification) {
        setClarificationData({
          query: form.query,
          meal_type: form.meal_type,
          meal_date: form.meal_date,
          unrecognized: response.unrecognized
        });
        
        // Initialize clarification form fields to empty or 0
        const initial = {};
        response.unrecognized.forEach(name => {
          initial[name] = { calories: "", protein: "", carbs: "", fats: "", fiber: "" };
        });
        setClarifiedValues(initial);
        return;
      }

      toast.success(editingId ? "Meal updated successfully!" : "Meal added successfully!");
      setForm({
        ...defaultForm,
        meal_type: form.meal_type,
        meal_date: new Date().toISOString().slice(0, 10),
      });
      setEditingId(null);
      setAnalysisResult({
        meal: response.meal,
        foods: response.foods,
        ai_used: response.ai_used,
      });
      await loadMeals();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Unable to save meal";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClarifySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        query: clarificationData.query,
        meal_type: clarificationData.meal_type,
        meal_date: clarificationData.meal_date,
        clarifications: Object.entries(clarifiedValues).map(([name, vals]) => ({
          name,
          calories: Number(vals.calories || 0),
          protein: Number(vals.protein || 0),
          carbs: Number(vals.carbs || 0),
          fats: Number(vals.fats || 0),
          fiber: Number(vals.fiber || 0),
        }))
      };
      if (editingId) {
        payload.id = editingId;
      }

      const response = await analyzeAndSaveMeal(payload);

      toast.success(editingId ? "Meal updated successfully!" : "Meal added successfully!");
      setForm({
        ...defaultForm,
        meal_type: form.meal_type,
        meal_date: new Date().toISOString().slice(0, 10),
      });
      setEditingId(null);
      setClarificationData(null);
      setAnalysisResult({
        meal: response.meal,
        foods: response.foods,
        ai_used: response.ai_used,
      });
      await loadMeals();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Unable to save meal";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (meal) => {
    setForm({
      query: meal.meal_name,
      meal_type: meal.meal_type,
      meal_date: meal.meal_date.slice(0, 10),
    });
    setEditingId(meal.id);
    setAnalysisResult(null);
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

  // Calculate Today's Summary
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayMeals = meals.filter(m => m.meal_date?.slice(0, 10) === todayStr);
  
  const todayTotals = todayMeals.reduce((acc, m) => {
    acc.calories += m.calories || 0;
    acc.protein += m.protein || 0;
    acc.carbs += m.carbs || 0;
    acc.fats += m.fats || 0;
    acc.fiber += m.fiber || 0;
    return acc;
  }, { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });

  const dailyGoals = {
    calories: 2000,
    protein: 130,
    carbs: 250,
    fats: 70,
    fiber: 30
  };

  return (
    <div className="page">
      <h1>Meal Tracker</h1>

      {/* Daily Progress Summary */}
      <div className="daily-summary-card">
        <div className="daily-summary-title">
          <span>Today's Nutrition Summary</span>
          <span className="daily-summary-date">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div className="daily-summary-grid">
          {Object.entries(dailyGoals).map(([key, goal]) => {
            const consumed = todayTotals[key];
            const pct = Math.min(100, Math.round((consumed / goal) * 100));
            const labels = {
              calories: "Calories",
              protein: "Protein",
              carbs: "Carbs",
              fats: "Fats",
              fiber: "Fiber"
            };
            const units = {
              calories: " kcal",
              protein: "g",
              carbs: "g",
              fats: "g",
              fiber: "g"
            };
            return (
              <div key={key} className="daily-summary-item">
                <div className="daily-summary-label">{labels[key]}</div>
                <div className="daily-summary-meta">
                  <span className="daily-summary-val">{consumed}{units[key]}</span>
                  <span className="daily-summary-goal">/ {goal}{units[key]}</span>
                </div>
                <div className="daily-progress-bar">
                  <div 
                    className={`daily-progress-fill ${key}`} 
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      
      <div className="responsive-grid">
        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit Meal" : "AI Meal Logger"}</h3>
          
          <label>
            What did you eat today?
            <textarea
              name="query"
              value={form.query}
              onChange={handleChange}
              placeholder="e.g. 2 bananas and 3 eggs"
              required
            />
            <span className="form-hint">
              Describe your meal naturally. Common items like eggs, milk, bananas, and rice are parsed locally without AI!
            </span>
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
              {submitting ? "Analyzing..." : "Analyze & Save"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(defaultForm);
                  setAnalysisResult(null);
                }}
              >
                Cancel
              </button>
            )}
          </div>

          {analysisResult && (
            <div className="analysis-result-card">
              <div className="analysis-result-title">
                ✓ Meal successfully saved!
              </div>
              <div className="analysis-grid">
                <div className="analysis-item">
                  <strong>Calories:</strong> {analysisResult.meal.calories} kcal
                </div>
                <div className="analysis-item">
                  <strong>Protein:</strong> {analysisResult.meal.protein}g
                </div>
                <div className="analysis-item">
                  <strong>Carbs:</strong> {analysisResult.meal.carbs}g
                </div>
                <div className="analysis-item">
                  <strong>Fat:</strong> {analysisResult.meal.fats}g
                </div>
                {analysisResult.meal.fiber !== undefined && (
                  <div className="analysis-item">
                    <strong>Fiber:</strong> {analysisResult.meal.fiber}g
                  </div>
                )}
              </div>
              
              {analysisResult.foods && analysisResult.foods.length > 0 && (
                <div className="analysis-foods-list">
                  <div className="analysis-foods-title">Detected Foods:</div>
                  <ul className="analysis-foods-items">
                    {analysisResult.foods.map((food, idx) => (
                      <li key={idx}>
                        {food.quantity} {food.name} 
                        <span className="muted-sm">
                          {" "}({food.nutrition.calories} kcal, {food.nutrition.protein}g P, {food.nutrition.carbs}g C, {food.nutrition.fats}g F{food.nutrition.fiber ? `, ${food.nutrition.fiber}g Fib` : ''})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="analysis-source">
                Engine: {analysisResult.ai_used ? "Gemini AI Entity Extractor" : "Local Fast Parser"}
              </div>
            </div>
          )}
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
            <div className="meal-cards-grid">
              {meals.map((meal) => {
                const icons = {
                  breakfast: "🍳",
                  lunch: "🍲",
                  dinner: "🍽️",
                  snack: "🍏"
                };
                return (
                  <div key={meal.id} className="meal-card">
                    <div>
                      <div className="meal-card-header">
                        <div className="meal-type-badge">
                          <span className="meal-icon">{icons[meal.meal_type] || "🍽️"}</span>
                          <span className="meal-type-text capitalize">{meal.meal_type}</span>
                        </div>
                        <div className="meal-date-badge">
                          {meal.meal_date?.slice(0, 10)}
                        </div>
                      </div>
                      
                      <h4 className="meal-title">{meal.meal_name}</h4>
                    </div>

                    <div>
                      <div className="meal-nutrients">
                        <div className="nutrient-stat calorie-stat">
                          <div className="nutrient-val">{meal.calories}</div>
                          <div className="nutrient-label">kcal</div>
                        </div>
                        <div className="nutrient-stat">
                          <div className="nutrient-val">{meal.protein}g</div>
                          <div className="nutrient-label">Prot</div>
                        </div>
                        <div className="nutrient-stat">
                          <div className="nutrient-val">{meal.carbs}g</div>
                          <div className="nutrient-label">Carb</div>
                        </div>
                        <div className="nutrient-stat">
                          <div className="nutrient-val">{meal.fats}g</div>
                          <div className="nutrient-label">Fat</div>
                        </div>
                        <div className="nutrient-stat">
                          <div className="nutrient-val">{meal.fiber || 0}g</div>
                          <div className="nutrient-label">Fib</div>
                        </div>
                      </div>
                      
                      <div className="meal-card-actions">
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => handleEdit(meal)}
                          aria-label={`Edit ${meal.meal_name}`}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn-link danger"
                          onClick={() => handleDelete(meal.id)}
                          aria-label={`Delete ${meal.meal_name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Clarification Modal */}
      {clarificationData && (
        <div className="modal-overlay">
          <form className="modal-content" onSubmit={handleClarifySubmit}>
            <h3 className="modal-title">Unrecognized Food Items</h3>
            <p className="modal-desc">
              We couldn't retrieve the nutritional profile for these items. Please clarify their values to complete saving.
            </p>
            
            <div style={{ maxHeight: "40vh", overflowY: "auto", paddingRight: "0.5rem" }}>
              {clarificationData.unrecognized.map((name) => (
                <div key={name} className="modal-food-item">
                  <div className="modal-food-name">{name}</div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                    <label style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      Calories (kcal)
                      <input
                        type="number"
                        min="0"
                        value={clarifiedValues[name]?.calories || ""}
                        onChange={(e) => setClarifiedValues(prev => ({
                          ...prev,
                          [name]: { ...prev[name], calories: e.target.value }
                        }))}
                        required
                        style={{ marginTop: "0.25rem", padding: "0.4rem" }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      Protein (g)
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={clarifiedValues[name]?.protein || ""}
                        onChange={(e) => setClarifiedValues(prev => ({
                          ...prev,
                          [name]: { ...prev[name], protein: e.target.value }
                        }))}
                        required
                        style={{ marginTop: "0.25rem", padding: "0.4rem" }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      Carbs (g)
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={clarifiedValues[name]?.carbs || ""}
                        onChange={(e) => setClarifiedValues(prev => ({
                          ...prev,
                          [name]: { ...prev[name], carbs: e.target.value }
                        }))}
                        required
                        style={{ marginTop: "0.25rem", padding: "0.4rem" }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                      Fats (g)
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={clarifiedValues[name]?.fats || ""}
                        onChange={(e) => setClarifiedValues(prev => ({
                          ...prev,
                          [name]: { ...prev[name], fats: e.target.value }
                        }))}
                        required
                        style={{ marginTop: "0.25rem", padding: "0.4rem" }}
                      />
                    </label>
                    <label style={{ fontSize: "0.85rem", gridColumn: "span 2", marginBottom: "0.5rem" }}>
                      Fiber (g)
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={clarifiedValues[name]?.fiber || ""}
                        onChange={(e) => setClarifiedValues(prev => ({
                          ...prev,
                          [name]: { ...prev[name], fiber: e.target.value }
                        }))}
                        required
                        style={{ marginTop: "0.25rem", padding: "0.4rem" }}
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="form-actions" style={{ marginTop: "1.5rem", borderTop: "1px solid #e2e8f0", paddingTop: "1rem" }}>
              <button type="submit" className="btn" disabled={submitting}>
                {submitting ? "Saving..." : "Confirm & Save"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setClarificationData(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Meals;
