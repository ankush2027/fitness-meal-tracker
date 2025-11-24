import { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  createBodyMetric,
  deleteBodyMetric,
  fetchBodyMetrics,
  updateBodyMetric,
} from "../services/bodyMetricService.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const getDefaultForm = () => ({
  weight_kg: 70,
  body_fat_percent: "",
  notes: "",
  recorded_at: dayjs().format("YYYY-MM-DD"),
});

const BodyMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [form, setForm] = useState(getDefaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const data = await fetchBodyMetrics();
      setMetrics(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load body metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const latest = metrics[0];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        weight_kg: Number(form.weight_kg),
        body_fat_percent: form.body_fat_percent ? Number(form.body_fat_percent) : null,
        notes: form.notes || null,
        recorded_at: form.recorded_at,
      };
      if (editingId) {
        await updateBodyMetric(editingId, payload);
        toast.success("Progress entry updated");
      } else {
        await createBodyMetric(payload);
        toast.success("Progress entry added");
      }
      setForm(getDefaultForm());
      setEditingId(null);
      await loadMetrics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save progress entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (metric) => {
    setForm({
      weight_kg: metric.weight_kg,
      body_fat_percent: metric.body_fat_percent ?? "",
      notes: metric.notes ?? "",
      recorded_at: metric.recorded_at,
    });
    setEditingId(metric.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this progress entry?")) return;
    try {
      await deleteBodyMetric(id);
      toast.success("Progress entry deleted");
      await loadMetrics();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete progress entry");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Body Metrics</h1>
          <p className="muted">Track weight trends, body composition, and personal notes.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="card metric-highlight">
          <h3>Latest snapshot</h3>
          {latest ? (
            <>
              <div className="metric-highlight-value">
                <span>{Number(latest.weight_kg).toFixed(1)} kg</span>
                {latest.body_fat_percent && (
                  <span className="muted-sm">{latest.body_fat_percent}% body fat</span>
                )}
              </div>
              <p className="muted-sm">
                Recorded {dayjs(latest.recorded_at).format("MMM D, YYYY")}
              </p>
              {latest.notes && <p className="muted">{latest.notes}</p>}
            </>
          ) : (
            <p className="muted">Log your first measurement to see progress.</p>
          )}
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit entry" : "Add progress"}</h3>
          <label>
            Weight (kg)
            <input
              type="number"
              name="weight_kg"
              step="0.1"
              min="30"
              max="300"
              value={form.weight_kg}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Body fat (%)
            <input
              type="number"
              name="body_fat_percent"
              step="0.1"
              min="3"
              max="70"
              value={form.body_fat_percent}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>
          <label>
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="How did you feel? Any training highlights?"
            />
          </label>
          <label>
            Date
            <input
              type="date"
              name="recorded_at"
              value={form.recorded_at}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update entry" : "Add entry"}
            </button>
            {editingId && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setEditingId(null);
                  setForm(getDefaultForm());
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>History</h3>
        {loading ? (
          <LoadingSpinner text="Loading progress entries..." />
        ) : metrics.length === 0 ? (
          <div className="empty-state">
            <p>No entries yet. Log your first measurement to start tracking.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Body fat</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric) => (
                  <tr key={metric.id}>
                    <td>{dayjs(metric.recorded_at).format("MMM D, YYYY")}</td>
                    <td>{Number(metric.weight_kg).toFixed(1)} kg</td>
                    <td>
                      {metric.body_fat_percent ? `${Number(metric.body_fat_percent).toFixed(1)}%` : "—"}
                    </td>
                    <td>{metric.notes || "—"}</td>
                    <td>
                      <button type="button" className="link" onClick={() => handleEdit(metric)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(metric.id)}
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
  );
};

export default BodyMetrics;

