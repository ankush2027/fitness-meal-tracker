import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f97316"];

export const WorkoutTrendChart = ({ data }) => (
  <div className="card chart-card">
    <h4>Workout Calories (7 latest)</h4>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <XAxis dataKey="workout_date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="calories_burned" stroke="#14b8a6" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const MacroPieChart = ({ data }) => {
  const chartData = [
    { name: "Protein", value: data.protein || 0 },
    { name: "Carbs", value: data.carbs || 0 },
    { name: "Fats", value: data.fats || 0 },
  ];

  return (
    <div className="card chart-card">
      <h4>Macro Breakdown (30 days)</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={80}>
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

