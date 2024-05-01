/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import SelectPriority from "./SelectPriority";

export default function UpdateTaskDetailsForm({
  initialTask,
  updateTaskDetails,
  setShowUpdateTaskDetailsForm,
}) {
  const [task, setTask] = useState({
    name: initialTask.name,
    priority: initialTask.priority,
    deadline: initialTask.deadline,
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = () => {
    if (!task.name || !task.priority || !task.deadline) {
      setErrorMessage("All fields are required");
      return;
    } else if (task.name.length > 20) {
      setErrorMessage("Name should be less than 20 characters");
      return;
    } else if (new Date(task.deadline) < new Date()) {
      setErrorMessage("Deadline should be in the future");
      return;
    } else {
      setErrorMessage("");
      updateTaskDetails(task);
    }
  };

  useEffect(() => {
    if (initialTask.deadline) {
      const deadlineParts = initialTask.deadline.split("/");
      const deadlineISO = new Date(
        `${deadlineParts[2]}-${deadlineParts[1]}-${deadlineParts[0]}`
      )
        .toISOString()
        .split("T")[0];
      setTask((prevTask) => ({ ...prevTask, deadline: deadlineISO }));
    }
  }, [initialTask]);

  return (
    <div>
      <div className="mb-8">
        <label className="block mb-4 text-sm font-medium">Name</label>
        <input
          type="text"
          value={task?.name}
          placeholder={`Enter Name`}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
          className="bg-[#5030E5] w-full px-3 py-2 rounded-lg placeholder:text-[#BDBDBD]"
        />
      </div>
      <div
        className={`grid items-center grid-cols-2 gap-4 ${errorMessage ? "mb-4" : "mb-8"}`}
      >
        <div>
          <label htmlFor="select" className="block mb-4 text-sm font-medium">
            Priority
          </label>
          <SelectPriority task={task} setTask={setTask} />
        </div>
        <div>
          <label className="block mb-4 text-sm font-medium">Deadline</label>
          <input
            type="date"
            value={task?.deadline}
            onChange={(e) =>
              setTask({
                ...task,
                deadline: e.target.value,
              })
            }
            className="bg-[#5030E5] p-2 rounded-lg w-full hover:cursor-pointer text-start text-[#BDBDBD]"
          />
        </div>
      </div>
      {errorMessage && (
        <div className="mb-4 text-center text-red-500">{errorMessage}</div>
      )}
      <button
        type="submit"
        onClick={() => handleSubmit()}
        className="flex w-full mb-4 items-center gap-2 justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600"
      >
        Confirm changes
      </button>
      <button
        type="button"
        onClick={() => setShowUpdateTaskDetailsForm(false)}
        className="flex w-full items-center gap-2 justify-center rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600"
      >
        Cancel
      </button>
    </div>
  );
}
