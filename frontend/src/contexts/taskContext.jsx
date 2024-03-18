/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useReducer, useState } from "react";
import { filterList } from "@/helpers/filterList";

import editSubmitted from "../assets/images/Edit submitted.png";
import viewSubmitted from "../assets/images/View submitted.png";
import calcStatusProgress from "@/helpers/calcStatusProgress";

export const taskContext = createContext();

let tasks = [
  {
    name: "Header",
    createdDate: "01/02/2024",
    assignee: "Asma123",
    priority: "Medium",
    deadlineDate: "25/06/2024",
    status: "Not Started",
    submitIcon: editSubmitted,
    role: "Leader",
  },
  {
    name: "Notification",
    createdDate: "20/04/2024",
    assignee: "Ajmal256",
    priority: "High",
    deadlineDate: "05/08/2024",
    status: "Stopped",
    submitIcon: viewSubmitted,
  },
  {
    name: "Header",
    createdDate: "20/04/2024",
    assignee: "Shahin256",
    priority: "Low",
    deadlineDate: "05/08/2024",
    status: "Pending",
    submitIcon: viewSubmitted,
  },
  {
    name: "Sidebar",
    createdDate: "10/02/2024",
    assignee: "Hari626",
    priority: "High",
    deadlineDate: "05/04/2024",
    status: "Done",
  },
  {
    name: "Filtering",
    createdDate: "10/02/2024",
    assignee: "Ajmal256",
    priority: "Medium",
    deadlineDate: "05/07/2024",
    status: "Pending",
  },

  {
    name: "Header",
    createdDate: "01/02/2024",
    assignee: "Asma123",
    priority: "Medium",
    deadlineDate: "25/06/2024",
    status: "Not Started",
    submitIcon: editSubmitted,
    role: "Leader",
  },
  {
    name: "Notification",
    createdDate: "20/04/2024",
    assignee: "Ajmal256",
    priority: "High",
    deadlineDate: "05/08/2024",
    status: "Stopped",
    submitIcon: viewSubmitted,
  },
  {
    name: "Header",
    createdDate: "20/04/2024",
    assignee: "Shahin256",
    priority: "Low",
    deadlineDate: "05/08/2024",
    status: "Pending",
    submitIcon: viewSubmitted,
  },
  {
    name: "Sidebar",
    createdDate: "10/02/2024",
    assignee: "Hari626",
    priority: "High",
    deadlineDate: "05/04/2024",
    status: "Done",
  },
  {
    name: "Filtering",
    createdDate: "10/02/2024",
    assignee: "Ajmal256",
    priority: "Medium",
    deadlineDate: "05/07/2024",
    status: "Pending",
  },

  {
    name: "Header",
    createdDate: "01/02/2024",
    assignee: "Asma123",
    priority: "Medium",
    deadlineDate: "25/06/2024",
    status: "Not Started",
    submitIcon: editSubmitted,
    role: "Leader",
  },
  {
    name: "Notification",
    createdDate: "20/04/2024",
    assignee: "Ajmal256",
    priority: "High",
    deadlineDate: "05/08/2024",
    status: "Stopped",
    submitIcon: viewSubmitted,
  },
  {
    name: "Header",
    createdDate: "20/04/2024",
    assignee: "Shahin256",
    priority: "Low",
    deadlineDate: "05/08/2024",
    status: "Pending",
    submitIcon: viewSubmitted,
  },
  {
    name: "Sidebar",
    createdDate: "10/02/2024",
    assignee: "Hari626",
    priority: "High",
    deadlineDate: "05/04/2024",
    status: "Done",
  },
  {
    name: "Filtering",
    createdDate: "10/02/2024",
    assignee: "Ajmal256",
    priority: "Medium",
    deadlineDate: "05/07/2024",
    status: "Pending",
  },
];

const initialState = tasks;

const TaskProvider = ({ children }) => {
  const [taskNameSearchTxt, setTaskNameSearchTxt] = useState("");
  const [taskFilterBtnTxt, setTaskFilterBtnTxt] = useState("Filter");
  const [listOnlyYourTasks, setListOnlyYourTasks] = useState(false);

  const resetTaskList = () => {
    filterTasks({
      type: "RESET",
      initialState,
    });
  };

  const [filteredTasks, dispatch] = useReducer(filterList, [...tasks]);

  const filterTasks = (action) => dispatch(action);

  tasks = listOnlyYourTasks
    ? filteredTasks.filter((project) => project.assignee === "Ajmal256")
    : filteredTasks;

  const statusProgress = calcStatusProgress(tasks);

  return (
    <taskContext.Provider
      value={{
        tasks,
        statusProgress,
        taskFilterBtnTxt,
        listOnlyYourTasks,
        taskNameSearchTxt,
        filterTasks,
        resetTaskList,
        setTaskFilterBtnTxt,
        setTaskNameSearchTxt,
        setListOnlyYourTasks,
      }}
    >
      {children}
    </taskContext.Provider>
  );
};

export default TaskProvider;
