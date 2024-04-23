/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { addData } from "@/services/db";
import StatusCard from "../cards/StatusCard";
import { useParams } from "react-router-dom";
import DetailCard from "../cards/DetailsCard";
import KickedPopUp from "../popups/KickedPopUp";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import AddTaskForm from "../forms/tasks/AddTaskForm";
import ListHeader from "@/components/list/ListHeader";
import LeaderDemotion from "../popups/LeaderDemotion";
import { UserContext } from "@/providers/UserProvider";
import AddListEntityForm from "../forms/AddListEntityForm";
import ListSubHeader from "@/components/list/ListSubHeader";
import editSubmitted from "../../assets/images/Edit submitted.png";
import viewSubmitted from "../../assets/images/View submitted.png";
import { useState, useEffect, useReducer, useContext } from "react";

export default function SubTeamDashboard() {
  const { setError } = useContext(UserContext);
  const { projectId, teamId, subTeamId } = useParams();

  const [kickedFrom, setKickedFrom] = useState("subTeam");
  const [reFetchTasks, setReFetchTasks] = useState(false);
  const [taskNameSearchTxt, setTaskNameSearchTxt] = useState("");
  const [listOnlyYourTasks, setListOnlyYourTasks] = useState(false);
  const [taskFilterBtnTxt, setTaskFilterBtnTxt] = useState("Filter");

  const [showKickedFromSubTeamPopUp, setShowKickedFromSubTeamPopUp] =
    useState(false);

  const [
    showSubTeamLeaderDemotionConfirmation,
    setShowSubTeamLeaderDemotionConfirmation,
  ] = useState(false);

  const [showAddTaskCollaboratorForm, setShowAddSubTeamCollaboratorForm] =
    useState(false);

  const [showSubTeamActivitiesPopUp, setShowSubTeamActivitiesPopUp] =
    useState(false);

  const tasks = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/tasks`,
    reFetchTasks
  );

  const yourTasks = initialTasks.filter(
    (project) => project.assignee === "Ajmal256"
  );

  const handleAddTask = async (taskDetails) => {
    try {
      await addData(
        `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/task`,
        {
          taskDetails,
        }
      );
      setShowAddTaskForm(false);
      toast.success("Task assigned successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    }
  };

  const resetTaskList = () => {
    setTaskNameSearchTxt("");
    setListOnlyYourTasks(false);
    setTaskFilterBtnTxt("Filter");
    setTasks({
      type: "RESET",
      initialState: tasks?.data,
    });
  };

  const [initialTasks, dispatch] = useReducer(listReducer, tasks?.data);
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
  }, [tasks?.data, listOnlyYourTasks]);

  useEffect(() => {
    socket.on("tasks", (task) => setReFetchTasks(task));
    return () => socket.off("tasks");
  }, []);

  useEffect(() => {
    socket.on("kickedFromProject", () => {
      setKickedFrom("project");
      setShowKickedFromSubTeamPopUp(true);
    });
  }, []);

  useEffect(() => {
    socket.on("kickedFromTeam", () => {
      setKickedFrom("team");
      setShowKickedFromSubTeamPopUp(true);
    });
  }, []);

  useEffect(() => {
    socket.on("kickedFromSubTeam", () => {
      setKickedFrom("subTeam");
      setShowKickedFromSubTeamPopUp(true);
    });
  }, []);

  const [showAddTaskForm, setShowAddTaskForm] = useState(false);

  return (
    <>
      {showSubTeamLeaderDemotionConfirmation && (
        <LeaderDemotion
          entity="team"
          hideAddEntityForm={setShowAddSubTeamCollaboratorForm}
          username={showSubTeamLeaderDemotionConfirmation.username || ""}
          setShowEntityLeaderDemotion={setShowSubTeamLeaderDemotionConfirmation}
        />
      )}
      {showKickedFromSubTeamPopUp && (
        <KickedPopUp
          entity={kickedFrom}
          setShowKickedFromEntityPopUp={setShowKickedFromSubTeamPopUp}
        />
      )}
      {showAddTaskForm && (
        <AddListEntityForm
          renderList="Sub Team"
          handleAddEntity={handleAddTask}
          setShowAddEntityForm={setShowAddTaskForm}
          description="Your sub team is where you can add members, create and assign tasks to work with them effortlessly."
        />
      )}
      {showAddTaskCollaboratorForm && (
        <div className="absolute inset-0 z-[50] h-full size-full backdrop-blur-sm">
          <div className="relative h-[70%] text-white max-w-xl transform -translate-x-1/2 top-20 left-1/2">
            <AddTaskCollaboratorForm
              setShowAddTaskCollaboratorForm={setShowAddTaskCollaboratorForm}
              setShowTaskLeaderDemotionConfirmation={
                setShowTaskLeaderDemotionConfirmation
              }
            />
          </div>
        </div>
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
