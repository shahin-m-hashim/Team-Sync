/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import AddComponent from "../AddComponent";
import { listReducer } from "@/helpers/listReducer";
import editSubmitted from "../../assets/images/Edit submitted.png";
import viewSubmitted from "../../assets/images/View submitted.png";
import { useState, useEffect, useReducer } from "react";

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

export default function TaskDash() {
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

  const handleTaskUpload = async (taskDoc) => {
    console.log(taskDoc);
    // try {
    //   await axios.post(base_url + "auth/signup", taskDoc, {
    //     withCredentials: true,
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const [showTaskAddPopUp, setShowTaskAddPopUp] = useState(false);

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
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
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setTasks}
          renderList="Task"
          resetList={resetTaskList}
          leaderList={yourTasks}
          initialList={initialTasks}
          filterBtnTxt={taskFilterBtnTxt}
          switchList={listOnlyYourTasks}
          setShowAddPopUp={setShowTaskAddPopUp}
          setSwitchList={setListOnlyYourTasks}
          listNameSearchTxt={taskNameSearchTxt}
          setFilterBtnTxt={setTaskFilterBtnTxt}
          setListNameSearchTxt={setTaskNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList="Task" />
        <ListBody
          list={tasks}
          renderList="Task"
          listNameSearchTxt={taskNameSearchTxt}
        />
      </div>
      {showTaskAddPopUp && (
        <AddComponent
          renderList="Task"
          handleUpload={handleTaskUpload}
          setShowAddPopUp={setShowTaskAddPopUp}
          description="Your can assign new tasks to team members, and collaborate seamlessly to achieve your project goals."
        />
      )}
    </>
  );
}
