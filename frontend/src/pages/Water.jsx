import { useEffect, useMemo, useState } from "react";
import {
  createWaterLog,
  deleteWaterLog,
  fetchWaterLogs,
  updateWaterLog,
} from "../services/waterService.js";
import ProgressRing from "../components/dashboard/ProgressRing.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import { useToast } from "../context/ToastContext.jsx";

const defaultForm = {
  amount_ml: 300,
  logged_at: new Date().toISOString().slice(0, 16),
  note: "",
};

const Water = () => {
  const [logs, setLogs] = useState([]);
  const [todayTotal, setTodayTotal] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const dailyGoal = useMemo(() => 3000, []); // fallback, actual from backend dashboard as well

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchWaterLogs();
      setLogs(data.logs);
      setTodayTotal(data.todayTotal);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load water logs");
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
        await updateWaterLog(editingId, form);
        toast.success("Water log updated!");
      } else {
        await createWaterLog(form);
        toast.success("Water intake logged!");
      }
      setForm(defaultForm);
      setEditingId(null);
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save water log");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log) => {
    setForm({
      amount_ml: log.amount_ml,
      logged_at: log.logged_at ? log.logged_at.slice(0, 16) : defaultForm.logged_at,
      note: log.note || "",
    });
    setEditingId(log.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await deleteWaterLog(id);
      toast.success("Entry removed");
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete entry");
    }
  };

  const progressPercent = Math.min(100, Math.round((todayTotal / dailyGoal) * 100));

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hydration Coach</p>
          <h1>Water Intake</h1>
          <p className="muted">
            Track hydration habits, stay on target, and keep your body fueled throughout the day.
          </p>
        </div>
      </div>

      <div className="responsive-grid">
        <ProgressRing
          progress={progressPercent}
          value={`${todayTotal} ml`}
          label={`Daily goal: ${dailyGoal} ml`}
        />

        <form className="card elevate" onSubmit={handleSubmit}>
          <h3>{editingId ? "Update Intake" : "Quick Add"}</h3>
          <label>
            Amount (ml)
            <input
              type="number"
              name="amount_ml"
              min={50}
              max={2000}
              value={form.amount_ml}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Logged time
            <input
              type="datetime-local"
              name="logged_at"
              value={form.logged_at}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Note (optional)
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="After workout, before meal..."
              maxLength={255}
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Log" : "Add Log"}
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
          <h3>Recent entries</h3>
          <span className="muted">
            {logs.length} {logs.length === 1 ? "entry" : "entries"}
          </span>
        </div>
        {loading ? (
          <LoadingSpinner text="Loading water logs..." />
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <p>No water entries yet. Start hydrating and track each glass!</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Time</th>
                  <th>Note</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.amount_ml} ml</td>
                    <td>{new Date(log.logged_at).toLocaleString()}</td>
                    <td>{log.note || "—"}</td>
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

export default Water;

