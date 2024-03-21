/* eslint-disable react/prop-types */
const CircularStatusBar = ({ statusCount, width }) => {
  const totalTasks = Object.values(statusCount).reduce(
    (acc, val) => acc + val,
    0
  );
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  const getPercentage = (value) => (value / totalTasks) * 100;

  const getColor = (status) => {
    switch (status) {
      case "notStarted":
        return "#F9BD3B";
      case "pending":
        return "#A87BFF";
      case "stopped":
        return "#B10F0F";
      case "done":
        return "#3CDA7D";
      default:
        return "#D9D9D9";
    }
  };

  const renderCircularStatusProgress = () => {
    let offset = 0;
    const backgroundCircle = (
      <circle
        key="background"
        cx="50"
        cy="50"
        r={radius + 8}
        stroke="#5030E5"
        strokeWidth="2"
        fill="transparent"
      />
    );

    const statusProgressCircles = Object.entries(statusCount).map(
      ([status, value]) => {
        const percentage = getPercentage(value);
        const color = getColor(status);
        const progressCircle = (
          <circle
            key={status}
            cx="50"
            cy="50"
            r={radius}
            stroke={color}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 50 50)`}
          />
        );
        offset -= (percentage / 100) * circumference;
        return progressCircle;
      }
    );

    return [backgroundCircle, ...statusProgressCircles];
  };

  return (
    <svg viewBox="0 0 100 100" width={width}>
      {renderCircularStatusProgress()}
    </svg>
  );
};

export default CircularStatusBar;
