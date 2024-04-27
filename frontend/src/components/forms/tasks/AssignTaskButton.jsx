import { addData } from "@/services/db";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

/* eslint-disable react/prop-types */
export default function AssignTaskButton({
  task,
  setTask,
  setFile,
  initialFile,
  initialTask,
  attachmentRef,
  setShowTaskForm,
  taskInputsErrorRef,
}) {
  const { projectId, teamId } = useParams();
  const [disableAssignTaskButton, setDisableAssignTaskButton] = useState(false);

  const validate = () => {
    const deadline = new Date(task.deadline);
    if (!task.attachment.url) {
      attachmentRef.current.innerText = "Attachment is required";
      return;
    } else if (
      !task.name ||
      !task.assignee ||
      !task.deadline ||
      !task.priority
    ) {
      taskInputsErrorRef.current.innerText = "All fields are required";
      return;
    } else if (task.name.length > 20) {
      taskInputsErrorRef.current.innerText =
        "Name should be less than 20 characters";
      return;
    } else if (deadline < new Date()) {
      taskInputsErrorRef.current.innerText = "Deadline should be in the future";
      return;
    } else {
      attachmentRef.current.innerText = "";
      taskInputsErrorRef.current.innerText = "";
      return handleAssignTask();
    }
  };

  const handleAssignTask = async () => {
    try {
      setDisableAssignTaskButton(true);
      await addData(`projects/${projectId}/teams/${teamId}/task`, { task });
      setTask(initialTask);
      setFile(initialFile);
      setShowTaskForm(false);
      toast.success("Task assigned successfully");
    } catch (e) {
      console.log(e);
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    } finally {
      setDisableAssignTaskButton(false);
    }
  };

  return (
    <button
      onClick={validate}
      disabled={disableAssignTaskButton}
      className="rounded-lg font-bold w-full px-3 py-2 bg-[#2eb242] text-black"
    >
      Assign Task
    </button>
  );
}
