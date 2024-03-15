/* eslint-disable react/prop-types */
import { useContext } from "react";
import { teamContext } from "@/contexts/teamContext";
import switchIcon from "../../assets/images/Switch.png";
import { projectContext } from "@/contexts/projectContext";

const SwitchListBtn = ({ displayList }) => {
  const { setListOnlyAdminTeams } = useContext(teamContext);
  const { setListOnlyAdminProjects } = useContext(projectContext);

  if (displayList === "Project") {
    return (
      <button
        onClick={() => setListOnlyAdminProjects((prevState) => !prevState)}
      >
        <img src={switchIcon} className="size-10" alt="switchProjectView" />
      </button>
    );
  }

  if (displayList === "Team") {
    return (
      <button onClick={() => setListOnlyAdminTeams((prevState) => !prevState)}>
        <img src={switchIcon} className="size-10" alt="switchTeamView" />
      </button>
    );
  }

  return null;
};

export default SwitchListBtn;
