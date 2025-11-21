const StatCard = ({ title, value, subtitle }) => (
  <div className="card stat-card">
    <h4>{title}</h4>
    <p className="stat-value">{value}</p>
    <span className="stat-subtitle">{subtitle}</span>
  </div>
);

const StatsCards = ({ calories }) => (
  <div className="stats-grid">
    <StatCard
      title="Calories Consumed"
      value={`${calories.consumed} kcal`}
      subtitle="Last 30 days"
    />
    <StatCard
      title="Calories Burned"
      value={`${calories.burned} kcal`}
      subtitle="Last 30 days"
    />
    <StatCard
      title="Net Calories"
      value={`${calories.net} kcal`}
      subtitle="Consumed - burned"
    />
  </div>
);

export default StatsCards;

