import { useEffect, useState } from "react";
import { fetchExercises } from "../services/exerciseService.js";

const Exercises = () => {
  const [query, setQuery] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadExercises = async (search) => {
    try {
      setLoading(true);
      const data = await fetchExercises(search);
      setExercises(data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load exercises");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExercises();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    loadExercises(query);
  };

  return (
    <div className="page">
      <h1>Exercise Library</h1>
      <form className="search-bar" onSubmit={handleSearch}>
        <input
          placeholder="Search by name or muscle..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="btn">Search</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="exercise-grid">
          {exercises.map((exercise) => (
            <article className="card exercise-card" key={exercise.id}>
              <h3>{exercise.name}</h3>
              <p>{exercise.description}</p>
              <p className="muted">
                Target: {exercise.target_muscle} | Equipment: {exercise.equipment}
              </p>
              {exercise.media_url && (
                <img src={exercise.media_url} alt={exercise.name} loading="lazy" />
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Exercises;

