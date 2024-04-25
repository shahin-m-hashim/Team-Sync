/* eslint-disable react/prop-types */
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import AddTaskForm from "../forms/tasks/AddTaskForm";
import ListHeader from "@/components/list/ListHeader";
import { useState, useEffect, useReducer } from "react";
import ListSubHeader from "@/components/list/ListSubHeader";
import editSubmitted from "../../assets/images/Edit submitted.png";
import viewSubmitted from "../../assets/images/View submitted.png";

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

export default function Tasks() {
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

  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  return (
    <>
      {showAddTaskForm && (
        <AddTaskForm setShowAddTaskForm={setShowAddTaskForm} />
      )}
      <div className="grid grid-cols-[1fr,1fr] gap-0.5 min-h-[17rem] border-white border-2 border-t-0 text-white">
        <DetailCard
          details={{
            name: "Project 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
        />
        <StatusCard list={tasks} renderList="Task" />
      </div>
      <div>
        <ListHeader
          renderList="Task"
          setList={setTasks}
          leaderList={yourTasks}
          resetList={resetTaskList}
          initialList={initialTasks}
          switchList={listOnlyYourTasks}
          filterBtnTxt={taskFilterBtnTxt}
          setShowAddForm={setShowAddTaskForm}
          setSwitchList={setListOnlyYourTasks}
          listNameSearchTxt={taskNameSearchTxt}
          setFilterBtnTxt={setTaskFilterBtnTxt}
          setListNameSearchTxt={setTaskNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Task" />
        <ListBody
          list={tasks}
          renderList="Task"
          listNameSearchTxt={taskNameSearchTxt}
        />
      </div>
    </>
  );
}
