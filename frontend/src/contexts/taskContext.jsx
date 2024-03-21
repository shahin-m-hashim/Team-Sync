/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { listReducer } from "@/helpers/listReducer";
import editSubmitted from "../assets/images/Edit submitted.png";
import viewSubmitted from "../assets/images/View submitted.png";
import { createContext, useEffect, useReducer, useState } from "react";

export const taskContext = createContext();

const initialTasks = [
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

const yourTasks = initialTasks.filter(
  (project) => project.assignee === "Ajmal256"
);

const TaskProvider = ({ children }) => {
  const [taskNameSearchTxt, setTaskNameSearchTxt] = useState("");
  const [taskFilterBtnTxt, setTaskFilterBtnTxt] = useState("Filter");
  const [listOnlyYourTasks, setListOnlyYourTasks] = useState(false);

  const resetTaskList = () => {
    setTaskNameSearchTxt("");
    setListOnlyYourTasks(false);
    setTaskFilterBtnTxt("Filter");
    setTasks({
      type: "RESET",
      initialState: initialTasks,
    });
  };

  const [tasks, dispatch] = useReducer(listReducer, [...initialTasks]);
  const setTasks = (action) => dispatch(action);

  useEffect(() => {
    setTaskNameSearchTxt("");
    setTaskFilterBtnTxt("Filter");
    if (listOnlyYourTasks) {
      setTasks({
        type: "SWITCH",
        payload: yourTasks,
      });
    } else {
      setTasks({
        type: "SWITCH",
        payload: initialTasks,
      });
    }
  }, [listOnlyYourTasks]);

  return (
    <taskContext.Provider
      value={{
        tasks,
        setTasks,
        yourTasks,
        initialTasks,
        resetTaskList,
        taskFilterBtnTxt,
        listOnlyYourTasks,
        taskNameSearchTxt,
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
