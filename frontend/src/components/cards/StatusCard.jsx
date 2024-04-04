/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import CircularStatusBar from "../CircularStatusBar";
import StatusBarChart from "../StatusBarChart";
import calcStatusCount from "@/helpers/calcStatusCount";
import CircularProgress from "../CircularProgress";
import calcOverallProgress from "@/helpers/calcOverallProgress";

export default function StatusCard({ list = [], renderList }) {
  const statusCount = calcStatusCount(list);
  const overallProgress = calcOverallProgress(list);

  if (Object.keys(list).length === 0) {
    statusCount.empty = true;
  }

  return (
    <div
      className={cn(
        statusCount.empty && "p-5 gap-2",
        "bg-[#141414] flex flex-col"
      )}
    >
      {!statusCount.empty && (
        <span className="mt-2 font-medium text-center">Overall Status</span>
      )}
      <div
        id="status"
        className={cn(
          !statusCount.empty ? "p-5 justify-evenly" : "gap-3",
          "flex h-full"
        )}
      >
        <div
          className={cn(
            !statusCount.empty && renderList === "Task" && "ml-[-50px]",
            "relative flex items-center justify-center text-center"
          )}
        >
          <CircularStatusBar statusCount={statusCount} width="65%" />
          <span
            className={cn(
              statusCount.empty ? "text-lg" : "text-xl bottom-[38%]",
              "absolute"
            )}
          >
            {statusCount.empty ? (
              <span>
                <span>Nothing </span>
                <br />
                <span>To Show !!!</span>
              </span>
            ) : (
              <span>
                {statusCount.done} <br /> Complete
              </span>
            )}
          </span>
        </div>
        {statusCount.empty ? (
          <div
            className={cn(
              !statusCount.empty && "items-center",
              "flex flex-col justify-center flex-grow gap-5 pt-2"
            )}
          >
            <span className="font-medium">Overall Status</span>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#3CDA7D] size-5" />
                <span>Complete : {statusCount.done}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#F9BD3B] size-5" />
                <span>Not Started : {statusCount.notStarted}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#A87BFF] size-5" />
                <span>Pending : {statusCount.pending}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#B10F0F] size-5" />
                <span>Stopped : {statusCount.stopped}</span>
              </div>
            </div>
          </div>
        ) : renderList !== "Task" ? (
          <CircularProgress overallProgress={overallProgress} width="65%" />
        ) : (
          <StatusBarChart statusCount={statusCount} />
        )}
      </div>
    </div>
  );
}
