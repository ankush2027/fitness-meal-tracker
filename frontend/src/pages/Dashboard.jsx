import { useEffect, useState } from "react";
import StatsCards from "../components/dashboard/StatsCards.jsx";
import { MacroPieChart, WorkoutTrendChart } from "../components/dashboard/ChartCard.jsx";
import { fetchDashboard } from "../services/dashboardService.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await fetchDashboard();
        setData(dashboard);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="page-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="page-center error-text">{error}</div>;
  }

  return (
    <div className="page">
      <h1>Progress Overview</h1>
      <StatsCards calories={data.calories} />
      <div className="responsive-grid">
        <WorkoutTrendChart data={data.workouts} />
        <MacroPieChart data={data.macros} />
      </div>
    </div>
  );
};

export default Dashboard;

