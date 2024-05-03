import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import { deleteData, updateData } from "@/services/db";
import { FileContext } from "@/providers/FileProvider";
import { UserContext } from "@/providers/UserProvider";
import UserNavbar from "@/components/navbars/UserNavbar";
import { useNavigate, useParams } from "react-router-dom";
import defaultDP from "../../assets/images/defaultDp.png";
import { useContext, useEffect, useRef, useState } from "react";
import updateAttachmentIcon from "../../assets/images/uploadIcon.png";
import viewAttachmentIcon from "../../assets/images/viewSubmitted.png";
import DeleteConfirmation from "@/components/popups/DeletionConfirmation";
import UpdateTaskDetailsForm from "@/components/forms/tasks/UpdateTaskDetailsForm";

export default function TaskSettings() {
  const navigate = useNavigate();
  const reUploadInputRef = useRef();
  const { setError } = useContext(UserContext);
  const { projectId, teamId, taskId } = useParams();
  const [reFetchProjectSettings, setReFetchProjectSettings] = useState(false);

  const [showUpdateTaskDetailsForm, setShowUpdateTaskDetailsForm] =
    useState(false);

  const [showDeleteTaskConfirmation, setShowDeleteTaskConfirmation] =
    useState(false);

  const taskSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/tasks/${taskId}`,
    reFetchProjectSettings
  );

  const { file, initialFile, setFile, uploadFile, downloadFile } =
    useContext(FileContext);

  const updateAttachment = async (uploadedFileURL, path) => {
    try {
      await updateData(
        `projects/${projectId}/teams/${teamId}/tasks/${taskId}/attachment`,
        {
          attachment: {
            url: uploadedFileURL,
            path,
          },
        }
      );
      toast.success("Attachment updated successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update attachment");
    }
  };

  const reUpload = async (e) => {
    try {
      const attachment = e.target.files[0];
      if (attachment.size > 10 * 1024 * 1024) {
        toast.error("Max attachment size is 10 MB");
        return;
      }
      await uploadFile(
        "",
        attachment,
        taskSettings?.data?.attachment.path,
        updateAttachment
      );
    } catch (e) {
      console.log(e);
    } finally {
      e.target.value = null;
      setFile(initialFile);
    }
  };

  const downloadAttachment = () => {
    try {
      if (!taskSettings?.data?.attachment?.url) {
        toast.error("No attachment found.");
        return;
      } else downloadFile(taskSettings?.data?.attachment?.url, "attachment");
    } catch (e) {
      console.log(e);
    }
  };

  const downloadSubmittedWork = () => {
    if (!taskSettings?.data?.submittedTask) {
      toast.error("Task not submitted yet");
      return;
    } else downloadFile(taskSettings?.data?.submittedTask, "taskSubmission");
  };

  const updateTaskDetails = async (values) => {
    try {
      await updateData(
        `projects/${projectId}/teams/${teamId}/tasks/${taskId}`,
        { updatedTaskDetails: values }
      );
      setShowUpdateTaskDetailsForm(false);
      toast.success("Task updated successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to update task details");
    }
  };

  const handleTaskSubmission = async (status) => {
    try {
      await updateData(
        `projects/${projectId}/teams/${teamId}/tasks/${taskId}/status`,
        { status }
      );
      toast.success("Task submission handled successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to handle task");
    }
  };

  const deleteTask = async () => {
    try {
      await deleteData(`projects/${projectId}/teams/${teamId}/tasks/${taskId}`);
      toast.success("Task deleted successfully");
      navigate(-1, { replace: true });
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete task");
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (file.uploadStatus === "uploading") {
        toast.info("Attachment will be updated soon..");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [file.uploadStatus]);

  useEffect(() => {
    socket.on("taskDetails", (taskDetails) =>
      setReFetchProjectSettings(taskDetails)
    );

    return () => socket.off("taskDetails");
  }, []);

  if (taskSettings?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (taskSettings?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <>
      {showDeleteTaskConfirmation && (
        <DeleteConfirmation
          entity="task"
          deleteEntity={deleteTask}
          setShowDeleteConfirmation={setShowDeleteTaskConfirmation}
        />
      )}
      <div className="relative h-full">
        <UserNavbar />
        <div className="size-full overflow-auto p-10 text-white shadow-md bg-[#2b2a2a]">
          <h1 className="max-w-6xl mx-auto mt-16 text-2xl">Task Settings</h1>
          <div className="grid max-w-6xl grid-cols-2 mx-auto mt-10 gap-x-10">
            {taskSettings.data ? (
              <div className="relative p-8 rounded-md bg-slate-700">
                <div className="absolute flex gap-4 top-6 right-6">
                  {file.uploadStatus !== "uploading" ? (
                    <button
                      className="p-2 bg-blue-500 rounded-full"
                      onClick={() => reUploadInputRef.current.click()}
                    >
                      <img src={updateAttachmentIcon} className="w-10" />
                    </button>
                  ) : (
                    <div className="relative p-2 bg-blue-500 rounded-full">
                      <img src={updateAttachmentIcon} className="w-10" />
                      <Loading />
                    </div>
                  )}
                  <button className="p-2 bg-blue-200 rounded-full ">
                    <img
                      className="w-10"
                      src={viewAttachmentIcon}
                      onClick={() => downloadAttachment()}
                    />
                  </button>
                </div>
                <input
                  accept="*"
                  type="file"
                  className="hidden"
                  onChange={reUpload}
                  ref={reUploadInputRef}
                />
                <div className="mb-8 space-y-2">
                  <h1 className="text-xl font-semibold">General</h1>
                  <p className="text-xs text-gray-400">
                    Update your tasks general settings
                  </p>
                </div>
                <div className="absolute top-5 right-5"></div>
                {showUpdateTaskDetailsForm ? (
                  <UpdateTaskDetailsForm
                    initialTask={taskSettings.data}
                    updateTaskDetails={updateTaskDetails}
                    setShowUpdateTaskDetailsForm={setShowUpdateTaskDetailsForm}
                  />
                ) : (
                  <>
                    <div className="mb-8">
                      <label className="block mb-4 text-sm font-medium">
                        Name
                      </label>
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {taskSettings?.data?.name || `Your task name`}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div>
                        <label className="block mb-4 text-sm font-medium">
                          Priority
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                          {taskSettings?.data?.priority || `Your task priority`}
                        </div>
                      </div>
                      <div>
                        <label className="block mb-4 text-sm font-medium">
                          Deadline
                        </label>
                        <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                          {taskSettings?.data?.deadline || `Your task deadline`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowUpdateTaskDetailsForm(true)}
                      className="flex w-full mb-4 justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-green-500 focus-visible:outline"
                    >
                      Update Task
                    </button>
                    <button
                      onClick={() => setShowDeleteTaskConfirmation(true)}
                      className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm hover:bg-red-500 focus-visible:outline"
                    >
                      Delete Task
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="relative py-[17rem] rounded-md bg-slate-700">
                <Loading />
              </div>
            )}

            {taskSettings.data ? (
              <div className="relative p-8 rounded-md bg-slate-700">
                <div className="mb-8 space-y-2">
                  <h1 className="text-xl font-semibold">Submitted Work</h1>
                  <p className="text-xs text-gray-400">
                    Review your assignee&apos;s submission
                  </p>
                </div>
                <div className="flex gap-3 mb-8">
                  <div className="flex-1">
                    <label className="block mb-4 text-sm font-medium">
                      Task Assignee
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          taskSettings?.data?.assignee.profilePic || defaultDP
                        }
                        className="object-cover object-center rounded-full w-14"
                      />
                      <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                        {taskSettings?.data?.assignee.username ||
                          `Assignee Name`}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mb-8">
                  <div className="flex-1">
                    <label className="block mb-4 text-sm font-medium">
                      Task Submission
                    </label>
                    <button
                      onClick={() => downloadSubmittedWork()}
                      className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
                    >
                      View submitted task
                    </button>
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block mb-4 text-sm font-medium">
                    Task Status
                  </label>
                  {taskSettings?.data?.status !== "Done" &&
                  taskSettings?.data?.status !== "Stopped" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTaskSubmission("approve")}
                        className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleTaskSubmission("reject")}
                        className="w-full bg-blue-500 hover:bg-blue-600 px-3 py-1.5 font-semibold text-black rounded-md disabled:bg-blue-300"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500">
                      {taskSettings?.data?.status || `Task status`}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative py-[17rem] rounded-md bg-slate-700">
                <Loading />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
