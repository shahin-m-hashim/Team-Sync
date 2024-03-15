/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import switchIcon from "../../assets/images/Switch.png";
import { useContext } from "react";
import { projectContext } from "@/contexts/projectContext";
import { teamContext } from "@/contexts/teamContext";
import FilterButton from "../FilterButton";

export default function ListHeader({
  setShowAddPopUp,
  setDisplayList,
  displayList,
}) {
  const {
    setListOnlyAdminProjects,
    searchByProjectName,
    setSearchByProjectName,
  } = useContext(projectContext);
  const { setListOnlyAdminTeams, searchByTeamName, setSearchByTeamName } =
    useContext(teamContext);

  return (
    <div
      id="bodyHeader"
      className="flex items-center justify-between py-3 text-sm px-7"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">{displayList}</span>
        <span className="text-[#828282]">List of all {displayList}</span>
      </div>
      <div className="flex gap-5">
        <FilterButton displayList={displayList} />
        {displayList === "Projects" && (
          <input
            type="text"
            placeholder="Search by project name"
            value={searchByProjectName}
            className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
            onChange={(e) => setSearchByProjectName(e.target.value)}
          />
        )}
        {displayList === "Teams" && (
          <input
            type="text"
            placeholder="Search by team name"
            value={searchByTeamName}
            className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
            onChange={(e) => setSearchByTeamName(e.target.value)}
          />
        )}
      </div>
      <div className="flex gap-10 text-[#828282]">
        <button onClick={() => setDisplayList("Projects")}>Projects</button>
        <button onClick={() => setDisplayList("Teams")}>Teams</button>
        <span>Sub Teams</span>
        <span>Tasks</span>
      </div>
      <div className="inline-flex gap-5">
        {displayList === "Projects" && (
          <button
            onClick={() => setListOnlyAdminProjects((prevState) => !prevState)}
          >
            <img src={switchIcon} className="size-10" alt="switchProjectView" />
          </button>
        )}
        {displayList === "Teams" && (
          <button
            onClick={() => setListOnlyAdminTeams((prevState) => !prevState)}
          >
            <img src={switchIcon} className="size-10" alt="switchTeamView" />
          </button>
        )}
        <button onClick={() => setShowAddPopUp(true)}>
          <img src={add} className="size-10" alt="addProject" />
        </button>
      </div>
    </div>
  );
}
