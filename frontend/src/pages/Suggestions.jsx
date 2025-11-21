import { useEffect, useState } from "react";
import { fetchSuggestions } from "../services/suggestionService.js";
import { useAuth } from "../context/AuthContext.jsx";

const Suggestions = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState(user?.goal || "maintenance");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");

  const loadSuggestions = async (selectedGoal) => {
    try {
      const data = await fetchSuggestions(selectedGoal);
      setSuggestions(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load suggestions");
    }
  };

  useEffect(() => {
    loadSuggestions(goal);
  }, [goal]);

  return (
    <div className="page">
      <h1>Diet & Meal Suggestions</h1>
      <div className="card">
        <label>
          Goal
          <select value={goal} onChange={(event) => setGoal(event.target.value)}>
            <option value="weight_loss">Weight loss</option>
            <option value="muscle_gain">Muscle gain</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </label>
        {error && <p className="error-text">{error}</p>}
        <div className="suggestions-list">
          {suggestions.map((suggestion) => (
            <article className="suggestion-card" key={suggestion.id}>
              <h3>{suggestion.title}</h3>
              <p>{suggestion.description}</p>
              <p className="muted">
                Calories: {suggestion.calories} | Protein: {suggestion.protein}g | Carbs:{" "}
                {suggestion.carbs}g | Fats: {suggestion.fats}g
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Suggestions;

