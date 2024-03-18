/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";

export default function StatusBarChart({ statusProgress }) {
  const [progress, setProgress] = useState({
    notStarted: 0,
    pending: 0,
    stopped: 0,
    done: 0,
  });

  useEffect(() => {
    const totalTasks = Object.values(statusProgress).reduce(
      (acc, val) => acc + val,
      0
    );

    const calculatePercentage = (value) =>
      Math.round((value / totalTasks) * 100);

    setProgress({
      notStarted: calculatePercentage(statusProgress.notStarted),
      pending: calculatePercentage(statusProgress.pending),
      stopped: calculatePercentage(statusProgress.stopped),
      done: calculatePercentage(statusProgress.done),
    });
  }, [statusProgress]);

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

  const ProgressBar = ({ percentage, color }) => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
      const id = setInterval(() => {
        if (width < percentage) {
          setWidth((prevWidth) => prevWidth + 1);
        }
      }, 10);
      return () => clearInterval(id);
    }, [width, percentage]);

    return (
      <div className="inline-block w-8 text-center">
        <div className="w-full h-[90%] bg-inherit relative">
          <div
            className="absolute bottom-0 left-0 w-full h-full ease-in transition-height"
            style={{ height: `${width}%`, backgroundColor: `${color}` }}
          />
        </div>
        <p className="text-xs font-medium">{percentage || 0}%</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full h-full gap-6">
        <ProgressBar
          percentage={progress.notStarted}
          color={getColor("notStarted")}
        />
        <ProgressBar
          percentage={progress.pending}
          color={getColor("pending")}
        />
        <ProgressBar
          percentage={progress.stopped}
          color={getColor("stopped")}
        />
        <ProgressBar percentage={progress.done} color={getColor("done")} />
      </div>
      <div className="w-full h-1 gap-0 bg-red-500" />
    </div>
  );
}
