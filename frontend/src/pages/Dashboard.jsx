import { useEffect, useState } from "react";
import StatsCards from "../components/dashboard/StatsCards.jsx";
import { MacroPieChart, WorkoutTrendChart } from "../components/dashboard/ChartCard.jsx";
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
      <h1>Progress Overview</h1>
      <StatsCards calories={data.calories || { consumed: 0, burned: 0, net: 0 }} />
      <div className="responsive-grid">
        <WorkoutTrendChart data={data.workouts || []} />
        <MacroPieChart data={data.macros || { protein: 0, carbs: 0, fats: 0 }} />
      </div>
    </div>
  );
};

export default Dashboard;

