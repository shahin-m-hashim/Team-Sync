/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { useContext, useEffect } from "react";
import SearchAssignee from "./SearchAssignee";
import SelectPriority from "./SelectPriority";
import closeIcon from "@/assets/images/Close.png";
import AssignTaskButton from "./AssignTaskButton";
import attachIcon from "@/assets/images/Attach.png";
import successIcon from "@/assets/images/Success.png";
import { FileContext } from "@/providers/FileProvider";

const initialTask = {
  name: "",
  assignee: "",
  priority: "",
  deadline: "",
  status: "Not Started",
  attachment: {
    url: "",
    path: "",
  },
};

export default function TaskForm({ setShowTaskForm }) {
  const [attachmentId, setAttachmentId] = useState("");

  const attachmentRef = useRef();
  const taskInputsErrorRef = useRef();
  const [task, setTask] = useState(initialTask);
  const [showMembers, setShowMembers] = useState(false);
  const [disableButtons, setDisableButtons] = useState(false);

  const { file, setFile, initialFile, uploadFile, deleteFile } =
    useContext(FileContext);

  const handleAttachment = async (e) => {
    try {
      const attachment = e.target.files[0];
      attachmentRef.current.innerText = "";

      if (attachment.size > 10 * 1024 * 1024) {
        attachmentRef.current.innerText = "Max attachment size is 10 MB";
        return;
      }

      setDisableButtons(true);
      await uploadFile(
        "direct",
        attachment,
        `tasks/attachments/${attachmentId}`
      );
    } catch (e) {
      console.log(e);
    } finally {
      e.target.value = null;
    }
  };

  const handleClose = async () => {
    try {
      file.uploadedFileURL &&
        (await deleteFile(`tasks/attachments/${attachmentId}`));
      setFile(initialFile);
    } catch (e) {
      console.log(e);
    }

    setTask(initialTask);
    setShowTaskForm(false);
  };

  const handleReUpload = async () => {
    try {
      setTask({ ...task, attachment: initialTask.attachment });
      setFile(initialFile);
      await deleteFile(`tasks/attachments/${attachmentId}`);
      setDisableButtons(false);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setAttachmentId(uuidv4().replace(/-/g, ""));
  }, []);

  useEffect(() => {
    if (file.uploadStatus === "completed") {
      setTask((prevTask) => ({
        ...prevTask,
        attachment: {
          url: file.uploadedFileURL,
          path: file.path,
        },
      }));
      attachmentRef.current.innerText = "";
    }
  }, [file]);

  return (
    <div className="absolute inset-0 z-50 size-full backdrop-blur-sm">
      <div
        className={cn(
          showMembers ? "-translate-x-1/3" : "-translate-x-1/2",
          "relative w-1/3 top-1/2 left-1/2 transform -translate-y-1/2 flex items-center gap-y-4 flex-col h-fit bg-[#313338] text-white px-5 py-2"
        )}
      >
        <div className="relative w-full text-center">
          <span className="text-xl">Customize Your Task</span>
          <button
            className="absolute right-0 top-2"
            onClick={() => handleClose()}
          >
            <img src={closeIcon} width={30} />
          </button>
        </div>
        <div className="text-[#828282] text-center text-sm">
          Assign tasks to team members.
        </div>
        <div className="bg-[#4D4D4D] h-fit w-full">
          <div className="flex flex-col p-3">
            <span>Task Attachment</span>
            <div className="flex justify-center">
              <label
                className={cn(
                  disableButtons ? "cursor-default" : "cursor-pointer",
                  "rounded-[50%] size-[80px] bg-[rgba(6,6,6,30%)] flex items-center flex-col justify-center gap-2"
                )}
              >
                <input
                  accept="*"
                  type="file"
                  className="hidden"
                  disabled={disableButtons}
                  onChange={handleAttachment}
                  onClick={() => (attachmentRef.current.innerText = "")}
                />
                <img
                  src={task.attachment?.url ? successIcon : attachIcon}
                  className={task.attachment?.url ? "pl-1 w-[70%]" : "w-[30%]"}
                />
                {!task.attachment.url && (
                  <span className="text-xs">ATTACH</span>
                )}
              </label>
            </div>
            <span
              ref={attachmentRef}
              className="mt-1 text-xs text-center text-red-500"
            />
            {file.uploadStatus === "uploading" && (
              <div className="flex justify-between">
                <span className="mt-1 text-xs">
                  Uploading attachment... {file.uploadProgress}%
                </span>
              </div>
            )}
            {task.attachment?.url && (
              <span className="mt-1 text-xs">
                Wrong attachment file&nbsp;?&nbsp;
                <button
                  onClick={() => handleReUpload()}
                  className="font-semibold text-red-500"
                >
                  REUPLOAD
                </button>
              </span>
            )}
          </div>
          <hr />
          <div className="flex gap-2">
            <div className="flex flex-col gap-4">
              <div className="p-3">
                <span>Task Name</span>
                <input
                  type="text"
                  value={task.name}
                  placeholder={`Enter Name`}
                  onClick={() => (taskInputsErrorRef.current.innerText = "")}
                  onChange={(e) => setTask({ ...task, name: e.target.value })}
                  className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
                />
              </div>
              <div className="p-3">
                <span>Task Assignee</span>
                <button
                  disabled={task.assignee && true}
                  onClick={() => {
                    taskInputsErrorRef.current.innerText = "";
                    setShowMembers(!showMembers);
                  }}
                  className="bg-[#5030E5] flex gap-2 items-center mt-3 px-3 py-2 rounded-lg w-full text-left text-[#BDBDBD]"
                >
                  {!task.assignee ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                      </svg>
                      <span>Choose Assignee</span>
                    </>
                  ) : (
                    <span>{task.assignee}</span>
                  )}
                </button>
                {showMembers && (
                  <SearchAssignee
                    task={task}
                    setTask={setTask}
                    setShowMembers={setShowMembers}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="p-3">
                <label htmlFor="select">Task Priority</label>
                <SelectPriority
                  task={task}
                  setTask={setTask}
                  taskInputsErrorRef={taskInputsErrorRef}
                />
              </div>
              <div className="p-3">
                <span>Task Deadline Date</span>
                <input
                  type="date"
                  placeholder={`Enter Name`}
                  onClick={() => (taskInputsErrorRef.current.innerText = "")}
                  onChange={(e) =>
                    setTask({
                      ...task,
                      deadline: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="bg-[#5030E5] mt-3 px-3 py-2 rounded-lg w-full placeholder:text-[#BDBDBD]"
                />
              </div>
            </div>
          </div>
        </div>
        <AssignTaskButton
          task={task}
          setTask={setTask}
          setFile={setFile}
          initialFile={initialFile}
          initialTask={initialTask}
          attachmentRef={attachmentRef}
          setShowTaskForm={setShowTaskForm}
          taskInputsErrorRef={taskInputsErrorRef}
        />
        <button
          onClick={() => {
            taskInputsErrorRef.current.innerText = "";
            setTask(initialTask);
          }}
          disabled={disableButtons}
          className="rounded-lg font-bold w-full px-3 py-2 bg-[#b22e2e] text-black"
        >
          Reset Form
        </button>
        <span ref={taskInputsErrorRef} className="text-red-500" />
      </div>
    </div>
  );
}
