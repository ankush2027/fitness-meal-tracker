import "./ProgressRing.css";

const ProgressRing = ({ progress = 0, size = 140, stroke = 10, label, value }) => {
  const normalizedRadius = size / 2 - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring-card card">
      <svg height={size} width={size} className="progress-ring">
        <circle
          stroke="#e2e8f0"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          stroke="#0ea5e9"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={size / 2}
          cy={size / 2}
          style={{
            strokeDasharray: `${circumference} ${circumference}`,
            strokeDashoffset,
          }}
        />
      </svg>
      <div className="progress-ring-content">
        <p className="progress-ring-value">{value}</p>
        <p className="progress-ring-label">{label}</p>
        <span className="progress-ring-percentage">{progress}% of goal</span>
      </div>
    </div>
  );
};

export default ProgressRing;

