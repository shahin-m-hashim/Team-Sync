/* eslint-disable react/prop-types */

import { useContext } from "react";
import uploads from "../assets/images/uploads.png";
import TaskUploadsPopUp from "./popups/TaskUploadsPopUp";
import { TaskUploadsContext } from "@/providers/TaskUploadsProvider";

export default function TaskUploads({
  showTaskUploadsPopUp,
  setShowTaskUploadsPopUp,
}) {
  const { taskUploads } = useContext(TaskUploadsContext);

  return (
    <>
      {showTaskUploadsPopUp && (
        <TaskUploadsPopUp setShowTaskUploadsPopUp={setShowTaskUploadsPopUp} />
      )}
      <div
        className="relative cursor-pointer"
        onClick={() => setShowTaskUploadsPopUp(true)}
      >
        <img src={uploads} className="w-10" />
        {taskUploads?.length > 0 && (
          <div className="absolute bottom-5 right-[-10px] rounded-full px-2 py-1 text-xs font-semibold bg-blue-500 text-white flex items-center justify-center">
            {taskUploads.length}
          </div>
        )}
      </div>
    </>
  );
}
