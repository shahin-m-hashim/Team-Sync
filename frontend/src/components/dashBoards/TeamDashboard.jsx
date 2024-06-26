/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { socket } from "@/App";
import Loading from "../Loading";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { deleteData } from "@/services/db";
import StatusCard from "../cards/StatusCard";
import { useParams } from "react-router-dom";
import TaskForm from "../forms/tasks/TaskForm";
import KickedPopUp from "../popups/KickedPopUp";
import { getLocalSecureItem } from "@/lib/utils";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import LeaderDemotion from "../popups/LeaderDemotion";
import { UserContext } from "@/providers/UserProvider";
import ListSubHeader from "@/components/list/ListSubHeader";
import EntityDeletedPopUp from "../popups/EntityDeletedPopUp";
import TeamDetailsCard from "../details cards/TeamDetailsCard";
import DeleteConfirmation from "../popups/DeletionConfirmation";
import { useContext, useEffect, useReducer, useState } from "react";
import AddTeamCollaboratorForm from "../forms/teams/AddTeamCollaboratorForm";

export default function TeamDashboard() {
  const { projectId, teamId } = useParams();
  const { setError } = useContext(UserContext);
  const { username } = getLocalSecureItem("user", "low");

  const [kickedFrom, setKickedFrom] = useState("team");
  const [reFetchTasks, setReFetchTasks] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [deleteTaskLink, setDeleteTaskLink] = useState("");
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [listOnlyYourTasks, setListOnlyYourTasks] = useState(false);
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [showTeamDeletedPopUp, setShowTeamDeletedPopUp] = useState(false);
  const [showKickedFromTeamPopUp, setShowKickedFromTeamPopUp] = useState(false);

  const [showDeleteTaskConfirmation, setShowDeleteTaskConfirmation] =
    useState(false);

  const [
    showTeamLeaderDemotionConfirmation,
    setShowTeamLeaderDemotionConfirmation,
  ] = useState(false);

  const [showAddTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const [showTeamActivitiesPopUp, setShowTeamActivitiesPopUp] = useState(false);

  const tasks = useFetch(
    `projects/${projectId}/teams/${teamId}/tasks`,
    reFetchTasks
  );

  const yourTasks = tasks?.data?.filter((task) => task.assignee === username);

  const deleteTask = async () => {
    try {
      await deleteData(deleteTaskLink);
      toast.success("Project deleted successfully");
    } catch (e) {
      toast.error(e.response.data.error || "Failed to delete project");
    }
  };

  const resetSubTeamList = () => {
    setTeamNameSearchTxt("");
    setListOnlyYourTasks(false);
    setTeamFilterBtnTxt("Filter");
    setTasks({
      type: "RESET",
      initialState: tasks?.data,
    });
  };

  const [initialTasks, dispatch] = useReducer(listReducer, tasks?.data);
  const setTasks = (action) => dispatch(action);

  useEffect(() => {
    setTeamNameSearchTxt("");
    setTeamFilterBtnTxt("Filter");
    if (listOnlyYourTasks) {
      setTasks({
        type: "SWITCH",
        payload: yourTasks,
      });
    } else {
      setTasks({
        type: "SWITCH",
        payload: tasks?.data,
      });
    }
  }, [tasks?.data, listOnlyYourTasks]);

  useEffect(() => {
    socket.on("tasks", (task) => setReFetchTasks(task));
    socket.on("kickedFromProject", () => {
      setKickedFrom("project");
      setShowKickedFromTeamPopUp(true);
    });
    socket.on("teamDeleted", () => setShowTeamDeletedPopUp(true));

    return () => {
      socket.off("tasks");
      socket.off("teamDeleted");
      socket.off("kickedFromProject");
    };
  }, []);

  if (tasks?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (tasks?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <>
      {showTeamLeaderDemotionConfirmation && (
        <LeaderDemotion
          entity="team"
          hideAddEntityForm={setShowAddTeamCollaboratorForm}
          username={showTeamLeaderDemotionConfirmation.username || ""}
          setShowEntityLeaderDemotion={setShowTeamLeaderDemotionConfirmation}
        />
      )}
      {showDeleteTaskConfirmation && (
        <DeleteConfirmation
          entity="task"
          deleteEntity={deleteTask}
          setShowDeleteConfirmation={setShowDeleteTaskConfirmation}
        />
      )}
      {showTeamDeletedPopUp && (
        <EntityDeletedPopUp
          entity="team"
          setShowEntityDeletedPopUp={setShowTeamDeletedPopUp}
        />
      )}
      {showKickedFromTeamPopUp && (
        <KickedPopUp
          entity={kickedFrom}
          setShowKickedFromEntityPopUp={setShowKickedFromTeamPopUp}
        />
      )}
      {showTaskForm && <TaskForm setShowTaskForm={setShowTaskForm} />}
      {showAddTeamCollaboratorForm && (
        <div className="absolute inset-0 z-[200] h-full size-full backdrop-blur-sm">
          <div className="relative h-[70%] text-white max-w-xl transform -translate-x-1/2 top-20 left-1/2">
            <AddTeamCollaboratorForm
              setShowAddTeamCollaboratorForm={setShowAddTeamCollaboratorForm}
              setShowTeamLeaderDemotionConfirmation={
                setShowTeamLeaderDemotionConfirmation
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-[2px] text-white border-2 border-t-0 border-white min-h-72">
        <TeamDetailsCard
          showTeamActivitiesPopUp={showTeamActivitiesPopUp}
          setShowTeamActivitiesPopUp={setShowTeamActivitiesPopUp}
          setShowAddTeamCollaboratorForm={setShowAddTeamCollaboratorForm}
        />
        {initialTasks ? (
          <StatusCard list={initialTasks} renderList="Task" />
        ) : (
          <div className="relative bg-[#141414]">
            <Loading />
          </div>
        )}
      </div>
      <div>
        <ListHeader
          renderList="Task"
          setList={setTasks}
          leaderList={yourTasks}
          initialList={tasks?.data}
          resetList={resetSubTeamList}
          switchList={listOnlyYourTasks}
          filterBtnTxt={teamFilterBtnTxt}
          setSwitchList={setListOnlyYourTasks}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setShowAddEntityForm={setShowTaskForm}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Task" />
        {initialTasks ? (
          <ListBody
            renderList="Task"
            list={initialTasks || []}
            setDeleteLink={setDeleteTaskLink}
            listNameSearchTxt={teamNameSearchTxt}
            showDeleteConfirmation={setShowDeleteTaskConfirmation}
          />
        ) : (
          <div className="relative h-full">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
