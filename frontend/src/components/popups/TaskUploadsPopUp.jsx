/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { useContext } from "react";
import pauseUpload from "../../assets/images/pauseUpload.png";
import retryUpload from "../../assets/images/retryUpload.png";
import cancelUpload from "../../assets/images/cancelUpload.png";
import resumeUpload from "../../assets/images/resumeUpload.png";
import { TaskUploadsContext } from "@/providers/TaskUploadsProvider";

const TaskUpload = ({ id, name, project, team, progress, status }) => {
  const {
    pauseTaskUpload,
    retryTaskUpload,
    resumeTaskUpload,
    cancelTaskUpload,
  } = useContext(TaskUploadsContext);

  return (
    <div
      key={id}
      className="relative grid items-center grid-cols-6 gap-2 p-4 text-black rounded-md bg-slate-300"
    >
      <div className="font-semibold">{name || "Task"}</div>
      <div className="font-semibold">{team || "Team"}</div>
      <div className="font-semibold">{project || "Project"}</div>
      <div>
        <div className="relative w-full h-2 bg-gray-200 rounded-full">
          <div
            className={cn(
              "absolute h-2 rounded-full",
              status === "failed" ? " bg-red-500" : " bg-blue-500"
            )}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mx-auto">{progress}%</div>
      <div className="flex items-center justify-center gap-3">
        {status === "uploading" ? (
          <>
            <button onClick={() => pauseTaskUpload(id)}>
              <img src={pauseUpload} className="w-20" />
            </button>
            <button onClick={() => cancelTaskUpload(id)}>
              <img src={cancelUpload} className="w-20" />
            </button>
          </>
        ) : status === "paused" ? (
          <>
            <button onClick={() => resumeTaskUpload(id)}>
              <img src={resumeUpload} className="w-20" />
            </button>
            <button onClick={() => cancelTaskUpload(id)}>
              <img src={cancelUpload} className="w-20" />
            </button>
          </>
        ) : status === "failed" ? (
          <>
            <button onClick={() => retryTaskUpload(id)}>
              <img src={retryUpload} className="w-20" />
            </button>
            <button onClick={() => cancelTaskUpload(id)}>
              <img src={cancelUpload} className="w-20" />
            </button>
          </>
        ) : (
          <div>Cancelled</div>
        )}
      </div>
    </div>
  );
};

export default function TaskUploadsPopUp({ setShowTaskUploadsPopUp }) {
  const { taskUploads } = useContext(TaskUploadsContext);

  return (
    <div className="fixed top-0 left-0 z-[100] flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-50">
      <div className="w-1/2 p-5 bg-white rounded-lg h-[71%]">
        <div className="relative flex items-center mb-2">
          <h1 className="text-lg font-bold text-blue-600">Task Uploads</h1>
          <div className="bg-[#0e2152] pl-2 pr-2 ml-2 rounded-md">
            <p className="p-1 text-xs text-white">{taskUploads?.length}</p>
          </div>
          <button
            className="absolute right-0 bottom-2"
            onClick={() => setShowTaskUploadsPopUp(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="text-red-500 cursor-pointer size-7 hover:text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <hr className="h-[0.2rem] my-1 bg-zinc-900" />
        <div className="grid items-center grid-cols-6 gap-2">
          <div className="pl-4">Task</div>
          <div className="pl-4">Team</div>
          <div className="pl-2">Project</div>
          <div className="mx-auto">Progress</div>
          <div className="mx-auto">%</div>
          <div className="mx-auto">Status</div>
        </div>
        <hr className="h-[0.2rem] my-1 bg-zinc-900" />
        <div className="h-[90%] space-y-2 overflow-y-auto">
          {taskUploads?.length > 0 ? (
            taskUploads?.map((taskUpload) => (
              <TaskUpload
                id={taskUpload?.taskId}
                team={taskUpload?.team}
                key={taskUpload?.taskId}
                name={taskUpload?.taskName}
                project={taskUpload?.project}
                status={taskUpload?.uploadStatus}
                progress={taskUpload?.uploadProgress}
              />
            ))
          ) : (
            <div>
              <p className="text-xl text-center text-red-500 mt-28">
                You currently have no tasks being uploaded
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
