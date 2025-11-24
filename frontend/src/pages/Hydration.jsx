import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  createWaterLog,
  deleteWaterLog,
  fetchWaterLogs,
  updateWaterLog,
} from "../services/waterService.js";
import { useToast } from "../context/ToastContext.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const DAILY_GOAL = parseInt(import.meta.env.VITE_WATER_GOAL_ML || "3000", 10);

const getDefaultForm = () => ({
  amount_ml: 350,
  intake_time: dayjs().format("YYYY-MM-DDTHH:mm"),
});

const Hydration = () => {
  const [logs, setLogs] = useState([]);
  const [form, setForm] = useState(getDefaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await fetchWaterLogs();
      setLogs(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load hydration logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const todayTotal = useMemo(() => {
    const today = dayjs().format("YYYY-MM-DD");
    return logs
      .filter((log) => dayjs(log.intake_time).format("YYYY-MM-DD") === today)
      .reduce((sum, log) => sum + log.amount_ml, 0);
  }, [logs]);

  const hydrationPercent = Math.min(100, Math.round((todayTotal / DAILY_GOAL) * 100));

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickAdd = async (amount) => {
    try {
      await createWaterLog({
        amount_ml: amount,
        intake_time: dayjs().format("YYYY-MM-DDTHH:mm:ss"),
      });
      toast.success(`Logged ${amount}ml of water`);
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to quick-add water");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        amount_ml: Number(form.amount_ml),
        intake_time: dayjs(form.intake_time).format("YYYY-MM-DDTHH:mm:ss"),
      };
      if (editingId) {
        await updateWaterLog(editingId, payload);
        toast.success("Hydration log updated");
      } else {
        await createWaterLog(payload);
        toast.success("Hydration log added");
      }
      setForm(getDefaultForm());
      setEditingId(null);
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save hydration log");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (log) => {
    setForm({
      amount_ml: log.amount_ml,
      intake_time: dayjs(log.intake_time).format("YYYY-MM-DDTHH:mm"),
    });
    setEditingId(log.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hydration log?")) return;
    try {
      await deleteWaterLog(id);
      toast.success("Hydration log deleted");
      await loadLogs();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to delete hydration log");
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Hydration</p>
          <h1>Hydration Tracker</h1>
          <p className="muted">Stay on top of your daily water intake and build better habits.</p>
        </div>
        <div className="quick-actions">
          {[250, 350, 500].map((amount) => (
            <button
              key={amount}
              type="button"
              className="btn btn-ghost"
              onClick={() => handleQuickAdd(amount)}
            >
              +{amount}ml
            </button>
          ))}
        </div>
      </div>

      <div className="stats-grid">
        <div className="card hydration-card">
          <div className="hydration-header">
            <div>
              <p className="muted">Today&apos;s intake</p>
              <h2>{todayTotal} ml</h2>
              <p className="muted-sm">Goal: {DAILY_GOAL} ml</p>
            </div>
            <div className="hydration-progress-ring">
              <span>{hydrationPercent}%</span>
            </div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${hydrationPercent}%` }} />
          </div>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit log" : "Add water"}</h3>
          <label>
            Amount (ml)
            <input
              type="number"
              name="amount_ml"
              min={50}
              max={2000}
              step={50}
              value={form.amount_ml}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Intake time
            <input
              type="datetime-local"
              name="intake_time"
              value={form.intake_time}
              onChange={handleChange}
              required
            />
          </label>
          <div className="form-actions">
            <button type="submit" className="btn" disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update log" : "Add log"}
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
        <h3>Recent logs</h3>
        {loading ? (
          <LoadingSpinner text="Loading hydration logs..." />
        ) : logs.length === 0 ? (
          <div className="empty-state">
            <p>No hydration logs yet. Start tracking to see your progress.</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Time</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.amount_ml} ml</td>
                    <td>{dayjs(log.intake_time).format("MMM D, YYYY h:mm A")}</td>
                    <td>
                      <button type="button" className="link" onClick={() => handleEdit(log)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="link danger"
                        onClick={() => handleDelete(log.id)}
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

export default Hydration;

