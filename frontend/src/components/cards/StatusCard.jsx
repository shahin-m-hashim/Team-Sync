/* eslint-disable react/prop-types */
import { cn } from "@/lib/utils";
import CircularStatusBar from "../CircularStatusBar";
import StatusBarChart from "../StatusBarChart";

export default function StatusCard({ statusProgress }) {
  const { notStarted = 0, pending = 0, stopped = 0, done = 0 } = statusProgress;

  if (notStarted === 0 && pending === 0 && stopped === 0 && done === 0) {
    statusProgress.empty = 0;
  }

  return (
    <div
      className={cn(
        statusProgress.empty !== 0 && "p-5 gap-2",
        "bg-[#141414] m-1 rounded-lg flex flex-col"
      )}
    >
      {statusProgress.empty !== 0 && (
        <span className="font-medium text-center">Overall Status</span>
      )}
      <div
        id="status"
        className={cn(
          statusProgress.empty === 0
            ? "p-5 justify-evenly"
            : "gap-3 ml-[-18px]",
          "flex "
        )}
      >
        <div className="relative flex items-center justify-center text-center">
          <CircularStatusBar statusProgress={statusProgress} width="62%" />
          <span
            className={cn(
              done === 0 ? "text-lg" : "text-xl bottom-[38%]",
              "absolute"
            )}
          >
            {done === 0 ? (
              <span>
                <span>Nothing </span>
                <br />
                <span>To Show !!!</span>
              </span>
            ) : (
              <span>
                {done} <br /> Complete
              </span>
            )}
          </span>
        </div>
        {statusProgress.empty === 0 ? (
          <div className="flex flex-col flex-grow gap-5 py-2 2xl:pr-20">
            <span className="font-medium">Overall Status</span>
            <div className="flex flex-col gap-2 text-gra">
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#3CDA7D] size-5" />
                <span>Complete : {done}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#F9BD3B] size-5" />
                <span>Not Started : {notStarted}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#A87BFF] size-5" />
                <span>Pending : {pending}</span>
              </div>
              <div className="flex items-center gap-5">
                <div className="rounded-[50%] bg-[#B10F0F] size-5" />
                <span>Stopped : {stopped}</span>
              </div>
            </div>
          </div>
        ) : (
          <StatusBarChart statusProgress={statusProgress} />
        )}
      </div>
    </div>
  );
}
