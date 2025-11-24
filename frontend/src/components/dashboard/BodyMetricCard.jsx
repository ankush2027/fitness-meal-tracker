const BodyMetricCard = ({ metric }) => (
  <div className="card metric-highlight">
    <h3>Latest body snapshot</h3>
    {metric ? (
      <>
        <div className="metric-highlight-value">
          <span>{Number(metric.weight_kg).toFixed(1)} kg</span>
          {metric.body_fat_percent && (
            <span className="muted-sm">{Number(metric.body_fat_percent).toFixed(1)}% body fat</span>
          )}
        </div>
        <p className="muted-sm">
          Recorded {new Date(metric.recorded_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {metric.notes && <p className="muted">{metric.notes}</p>}
      </>
    ) : (
      <p className="muted">Log your measurements to unlock progress insights.</p>
    )}
  </div>
);

export default BodyMetricCard;

