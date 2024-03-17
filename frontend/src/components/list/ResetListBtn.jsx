/* eslint-disable react/prop-types */
import { useContext } from "react";
import reset from "../../assets/images/Reset.png";
import { teamContext } from "@/contexts/teamContext";
import { projectContext } from "@/contexts/projectContext";
import { subTeamContext } from "@/contexts/subTeamContext";
import { taskContext } from "@/contexts/taskContext";

const ResetListBtn = ({ renderList }) => {
  const {
    resetProjectList,
    setProjectNameSearchTxt,
    setProjectFilterBtnTxt,
    setListOnlyAdminProjects,
  } = useContext(projectContext);

  const {
    resetTeamList,
    setTeamNameSearchTxt,
    setTeamFilterBtnTxt,
    setListOnlyAdminTeams,
  } = useContext(teamContext);

  const {
    resetSubTeamList,
    setSubTeamNameSearchTxt,
    setSubTeamFilterBtnTxt,
    setListOnlyAdminSubTeams,
  } = useContext(subTeamContext);

  const {
    resetTaskList,
    setTaskNameSearchTxt,
    setTaskFilterBtnTxt,
    setListOnlyYourTasks,
  } = useContext(taskContext);

  if (renderList === "Project") {
    return (
      <button
        onClick={() => {
          setProjectNameSearchTxt("");
          setListOnlyAdminProjects(false);
          setProjectFilterBtnTxt("Filter");
          resetProjectList();
        }}
      >
        <img src={reset} className="size-10" alt="resetProjects" />
      </button>
    );
  }

  if (renderList === "Team") {
    return (
      <button
        onClick={() => {
          setTeamNameSearchTxt("");
          setListOnlyAdminTeams(false);
          setTeamFilterBtnTxt("Filter");
          resetTeamList();
        }}
      >
        <img src={reset} className="size-10" alt="resetTeams" />
      </button>
    );
  }

  if (renderList === "Sub Team") {
    return (
      <button
        onClick={() => {
          setSubTeamNameSearchTxt("");
          setListOnlyAdminSubTeams(false);
          setSubTeamFilterBtnTxt("Filter");
          resetSubTeamList();
        }}
      >
        <img src={reset} className="size-10" alt="resetSubTeams" />
      </button>
    );
  }

  if (renderList === "Task") {
    return (
      <button
        onClick={() => {
          setTaskNameSearchTxt("");
          setListOnlyYourTasks(false);
          setTaskFilterBtnTxt("Filter");
          resetTaskList();
        }}
      >
        <img src={reset} className="size-10" alt="resetSubTeams" />
      </button>
    );
  }

  return null;
};

export default ResetListBtn;
