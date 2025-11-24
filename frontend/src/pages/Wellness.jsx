import { useEffect, useState } from "react";
import {
  createWellnessLog,
  deleteWellnessLog,
  fetchWellnessLogs,
  updateWellnessLog,
} from "../services/wellnessService.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useToast } from "../context/ToastContext.jsx";

const moods = [
  { value: "high", label: "Positive" },
  { value: "neutral", label: "Neutral" },
  { value: "low", label: "Low" },
];

const defaultForm = {
  mood: "neutral",
  energy_level: 6,
  sleep_hours: 7,
  notes: "",
  log_date: new Date().toISOString().slice(0, 10),
};

const Wellness = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState([]);
  const [avgSleep, setAvgSleep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchWellnessLogs();
      setLogs(data.logs);
      setSummary(data.summary);
      setAvgSleep(data.avgSleep);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load wellness logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await updateWellnessLog(editingId, form);
        toast.success("Wellness check updated");
      } else {
        await createWellnessLog(form);
        toast.success("Wellness check added");
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save wellness log");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log) => {
    setForm({
      mood: log.mood,
      energy_level: log.energy_level,
      sleep_hours: log.sleep_hours,
      notes: log.notes || "",
      log_date: log.log_date,
    });
    setEditingId(log.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this check-in?")) return;
    try {
      await deleteWellnessLog(id);
      toast.success("Check-in deleted");
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete check-in");
    }
  };

  const moodCounts = moods.map((mood) => {
    const data = summary.find((item) => item.mood === mood.value);
    return { ...mood, count: data ? data.count : 0 };
  });

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Mind-Body Sync</p>
          <h1>Wellness Journal</h1>
          <p className="muted">
            Capture mood, energy, and sleep to spot patterns that impact your fitness outcomes.
          </p>
        </div>
      </div>

      <div className="responsive-grid">
        <div className="card elevate">
          <h3>Weekly mood trend</h3>
          <div className="mood-grid">
            {moodCounts.map((mood) => (
              <div key={mood.value} className={`mood-card mood-${mood.value}`}>
                <span className="mood-label">{mood.label}</span>
                <strong className="mood-count">{mood.count}</strong>
                <span className="mood-subtitle">check-ins</span>
              </div>
            ))}
          </div>
          <div className="sleep-card">
            <p>Average sleep (7d)</p>
            <h2>{avgSleep} hrs</h2>
          </div>
        </div>

        <form className="card elevate" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update check-in" : "Log how you feel"}</h3>
          <label>
            Mood
            <select name="mood" value={form.mood} onChange={handleChange}>
              {moods.map((mood) => (
                <option key={mood.value} value={mood.value}>
                  {mood.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Energy level (1-10)
            <input
              type="number"
              name="energy_level"
              min={1}
              max={10}
              value={form.energy_level}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Sleep hours
            <input
              type="number"
              name="sleep_hours"
              step="0.25"
              min={0}
              max={24}
              value={form.sleep_hours}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              rows={3}
              value={form.notes}
              onChange={handleChange}
              placeholder="Did anything impact your mood or recovery?"
              maxLength={255}
            />
          </label>
          <label>
            Date
            <input type="date" name="log_date" value={form.log_date} onChange={handleChange} required />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update" : "Save check-in"}
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
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Recent check-ins</h3>
        </div>
        {loading ? (
          <LoadingSpinner text="Loading wellness entries..." />
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <p>No wellness entries yet. Track your mood daily to unlock insights.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Mood</th>
                  <th>Energy</th>
                  <th>Sleep</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.log_date}</td>
                    <td className={`badge badge-${log.mood}`}>{log.mood}</td>
                    <td>{log.energy_level}/10</td>
                    <td>{log.sleep_hours} hrs</td>
                    <td>{log.notes || "—"}</td>
                    <td>
                      <button type="button" className="link" onClick={() => handleEdit(log)}>
                        Edit
                      </button>
                      <button type="button" className="link danger" onClick={() => handleDelete(log.id)}>
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
  );
};

export default Wellness;

