const HydrationCard = ({ hydration }) => {
  if (!hydration) {
    return (
      <div className="card hydration-card">
        <p className="muted">Log water to unlock hydration insights.</p>
      </div>
    );
  }

  const history = hydration.history || [];

  return (
    <div className="card hydration-card">
      <div className="hydration-header">
        <div>
          <p className="muted">Today&apos;s intake</p>
          <h2>{hydration.today} ml</h2>
          <p className="muted-sm">Goal: {hydration.goal} ml</p>
        </div>
        <div className="hydration-progress-ring">
          <span>{hydration.percent}%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${hydration.percent}%` }} />
      </div>
      <div className="hydration-history">
        {history.length === 0 ? (
          <p className="muted-sm">Log entries to see your weekly hydration streak.</p>
        ) : (
          history.map((day) => (
            <div key={day.date} className="hydration-history-item">
              <span>{new Date(day.date).toLocaleDateString(undefined, { weekday: "short" })}</span>
              <div className="hydration-history-bar">
                <div
                  className="hydration-history-fill"
                  style={{
                    width: `${Math.min(100, Math.round((day.total / hydration.goal) * 100))}%`,
                  }}
                />
              </div>
              <span className="muted-sm">{day.total} ml</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HydrationCard;

