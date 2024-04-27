/* eslint-disable react/prop-types */

import {
  ref,
  getStorage,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

import app from "@/lib/firebase";
import { toast } from "react-toastify";
import { createContext, useEffect, useRef, useState } from "react";

export const TaskUploadsContext = createContext();

const storage = getStorage(app);

const TaskUploadsProvider = ({ children }) => {
  const uploadTasksRef = useRef([]);
  const [taskUploads, setTaskUploads] = useState([]);

  const addTaskToUploads = (task) => {
    setTaskUploads((prevTaskUploads) => [...prevTaskUploads, task]);
    uploadTasksRef.current.push(task);
    uploadTask(task);
  };

  const uploadTask = async (task) => {
    const { taskId } = task;
    const fileRef = ref(storage, task.firebasePath);

    updateTaskUpload(taskId, { uploadStatus: "uploading" });

    const uploadTask = uploadBytesResumable(fileRef, task.file);
    task.uploadTask = uploadTask;

    uploadTask.on("state_changed", (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      updateTaskUpload(taskId, { uploadProgress: progress });
    });

    toast.info(`Task ${task.taskName} added to uploads.`);

    try {
      await uploadTask;
      const uploadedFileURL = await getDownloadURL(fileRef);

      updateTaskUpload(taskId, {
        uploadedFileURL,
        uploadProgress: 100,
        uploadStatus: "completed",
      });

      removeTaskFromUploads(taskId);

      // await addData(task.secondaryDBPath, {
      //   submittedTask: uploadedFileURL,
      // });

      toast.success(`Task ${task.taskName} uploaded successfully.`);
    } catch (error) {
      if (error.code === "storage/canceled") {
        return;
      } else {
        updateTaskUpload(taskId, { uploadStatus: "failed" });
        toast.error(`Task ${task.taskName} upload failed`);
      }
    }
  };

  const pauseTaskUpload = (taskId) => {
    const task = uploadTasksRef.current.find((task) => task.taskId === taskId);
    if (task?.uploadTask) {
      task.uploadTask.pause();
      updateTaskUpload(taskId, { uploadStatus: "paused" });
    }
  };

  const resumeTaskUpload = (taskId) => {
    const task = uploadTasksRef.current.find((task) => task.taskId === taskId);
    if (task?.uploadTask) {
      task.uploadTask.resume();
      updateTaskUpload(taskId, { uploadStatus: "uploading" });
    }
  };

  const cancelTaskUpload = (taskId) => {
    const task = uploadTasksRef.current.find((task) => task.taskId === taskId);
    if (task?.uploadTask) task.uploadTask.cancel();
    setTimeout(() => {
      updateTaskUpload(taskId, { uploadStatus: "cancelled" });
      removeTaskFromUploads(taskId);
      toast.info(`Task ${task.taskName} upload cancelled`);
    }, 1000);
  };

  const removeTaskFromUploads = (taskId) => {
    setTaskUploads((prevTaskUploads) =>
      prevTaskUploads.filter((task) => task.taskId !== taskId)
    );
    uploadTasksRef.current = uploadTasksRef.current.filter(
      (task) => task.taskId !== taskId
    );
  };

  const retryTaskUpload = (taskId) => {
    const task = taskUploads.find((task) => task.taskId === taskId);
    if (task) {
      removeTaskFromUploads(taskId);
      addTaskToUploads(task);
    }
    toast.info(`Retrying task upload ${task.taskName}`);
  };

  const updateTaskUpload = (taskId, dataToUpdate) => {
    setTaskUploads((prevTaskUploads) =>
      prevTaskUploads.map((task) =>
        task.taskId === taskId ? { ...task, ...dataToUpdate } : task
      )
    );
  };

  useEffect(() => {
    const handleWindowClose = (event) => {
      if (taskUploads.length > 0) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [taskUploads]);

  return (
    <TaskUploadsContext.Provider
      value={{
        taskUploads,
        retryTaskUpload,
        pauseTaskUpload,
        addTaskToUploads,
        resumeTaskUpload,
        cancelTaskUpload,
      }}
    >
      {children}
    </TaskUploadsContext.Provider>
  );
};

export default TaskUploadsProvider;
