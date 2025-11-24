import { useEffect, useState } from "react";
import StatsCards from "../components/dashboard/StatsCards.jsx";
import { MacroPieChart, WorkoutTrendChart } from "../components/dashboard/ChartCard.jsx";
import ProgressRing from "../components/dashboard/ProgressRing.jsx";
import { fetchDashboard } from "../services/dashboardService.js";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const dashboard = await fetchDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err.message || err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="page-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-center">
        <p className="error-text">{error}</p>
        <button className="btn" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="page-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Progress Overview</h1>
          <p className="muted">Stay aligned with your nutrition, hydration, and wellness goals.</p>
        </div>
      </div>

      <StatsCards calories={data.calories || { consumed: 0, burned: 0, net: 0 }} />

      <div className="responsive-grid auto-fit-300">
        <ProgressRing
          progress={data.water?.percent || 0}
          value={`${data.water?.total || 0} ml`}
          label={`Hydration goal (${data.water?.goal || 0} ml)`}
        />
        <div className="card wellness-card elevate">
          <h4>Wellness snapshot</h4>
          {data.wellness?.latest ? (
            <div className="wellness-stats">
              <div>
                <p className="muted">Latest mood</p>
                <span className={`badge badge-${data.wellness.latest.mood}`}>
                  {data.wellness.latest.mood}
                </span>
                <p className="muted small">Energy {data.wellness.latest.energy_level}/10</p>
              </div>
              <div>
                <p className="muted">Avg sleep (14d)</p>
                <h2>{data.wellness.averages.sleepAvg} hrs</h2>
                <p className="muted small">Energy avg {data.wellness.averages.energyAvg}/10</p>
              </div>
            </div>
          ) : (
            <p className="muted">Log a wellness entry to unlock insights.</p>
          )}
        </div>
      </div>

      <div className="responsive-grid">
        <WorkoutTrendChart data={data.workouts || []} />
        <MacroPieChart data={data.macros || { protein: 0, carbs: 0, fats: 0 }} />
      </div>
    </div>
  );
};

export default Dashboard;

