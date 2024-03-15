/* eslint-disable react/prop-types */
import { useContext } from "react";
import reset from "../../assets/images/Reset.png";
import { teamContext } from "@/contexts/teamContext";
import { projectContext } from "@/contexts/projectContext";

const ResetListBtn = ({ displayList }) => {
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

  if (displayList === "Project") {
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

  if (displayList === "Team") {
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

  return null;
};

export default ResetListBtn;
