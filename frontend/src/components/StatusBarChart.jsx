/* eslint-disable react/prop-types */

const ProgressBar = ({ percentage, color }) => {
  return (
    <div className="inline-block w-8 text-center">
      <div className="w-full h-[90%] bg-inherit relative">
        <div
          className="absolute bottom-0 left-0 w-full h-full ease-in transition-height"
          style={{ height: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs font-medium">{Math.round(percentage)}%</p>
    </div>
  );
};

const StatusBarChart = ({ statusCount }) => {
  const totalTasks = Object.values(statusCount).reduce(
    (acc, val) => acc + val,
    0
  );

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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full h-full gap-6">
        {Object.entries(statusCount).map(([status, count]) => (
          <ProgressBar
            key={status}
            percentage={getPercentage(count)}
            color={getColor(status)}
          />
        ))}
      </div>
      <div className="w-full h-1 gap-0 bg-red-500" />
    </div>
  );
};

export default StatusBarChart;
