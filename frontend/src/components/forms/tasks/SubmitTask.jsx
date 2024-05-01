/* eslint-disable react/prop-types */
import { toast } from "react-toastify";
import { useContext, useEffect, useRef, useState } from "react";
import reSubmit from "../../../assets/images/reSubmit.png";
import submitIcon from "../../../assets/images/submitTask.png";
import { TaskUploadsContext } from "@/providers/TaskUploadsProvider";
import { useParams } from "react-router-dom";

const SubmitTask = ({ team, taskId, project, taskName, submittedTask }) => {
  const inputRef = useRef(null);
  const { projectId, teamId } = useParams();
  const [disableTaskUpload, setDisableTaskUpload] = useState(false);
  const { taskUploads, addTaskToUploads } = useContext(TaskUploadsContext);

  useEffect(() => {
    if (taskUploads.some((task) => task.taskId === taskId)) {
      setDisableTaskUpload(true);
    } else {
      setDisableTaskUpload(false);
    }
  }, [taskUploads, taskId]);

  const handleTaskUpload = async (e) => {
    const taskFile = e.target.files[0];
    if (!taskFile) return;

    if (taskFile.size > 1 * 1024 * 1024 * 1024) {
      toast.error("Max file size is 1 GB");
      return;
    }

    const taskUpload = {
      team,
      taskId,
      project,
      taskName,
      file: taskFile,
      uploadProgress: 0,
      uploadStatus: "idle",
      firebasePath: `tasks/${taskId}/submittedTask`,
      secondaryDBPath: `projects/${projectId}/teams/${teamId}/tasks/${taskId}/submit`,
    };

    addTaskToUploads(taskUpload);
    e.target.value = null;
  };

  return (
    <>
      <button
        onClick={() => {
          if (disableTaskUpload) {
            toast.info("Please wait while we upload your task");
            return;
          }
          inputRef.current.click();
        }}
        className="pl-3"
      >
        <img
          width={30}
          alt="Submit"
          src={submittedTask ? reSubmit : submitIcon}
        />
      </button>
      <input
        accept="*"
        type="file"
        ref={inputRef}
        className="hidden"
        onChange={handleTaskUpload}
        disabled={disableTaskUpload}
      />
    </>
  );
};

export default SubmitTask;
