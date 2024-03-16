import { projectContext } from "@/contexts/projectContext";
import { subTeamContext } from "@/contexts/subTeamContext";
import { taskContext } from "@/contexts/taskContext";
import { teamContext } from "@/contexts/teamContext";
import { useContext } from "react";

/* eslint-disable react/prop-types */
const SearchInput = ({ displayList }) => {
  const { projectNameSearchTxt, setProjectNameSearchTxt } =
    useContext(projectContext);
  const { teamNameSearchTxt, setTeamNameSearchTxt } = useContext(teamContext);
  const { subTeamNameSearchTxt, setSubTeamNameSearchTxt } =
    useContext(subTeamContext);
  const { taskNameSearchTxt, setTaskNameSearchTxt } = useContext(taskContext);

  if (displayList === "Project") {
    return (
      <input
        type="text"
        placeholder="Search by project name"
        value={projectNameSearchTxt}
        className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
        onChange={(e) => setProjectNameSearchTxt(e.target.value)}
      />
    );
  }

  if (displayList === "Team") {
    return (
      <input
        type="text"
        placeholder="Search by team name"
        value={teamNameSearchTxt}
        className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
        onChange={(e) => setTeamNameSearchTxt(e.target.value)}
      />
    );
  }

  if (displayList === "Sub Team") {
    return (
      <input
        type="text"
        placeholder="Search by sub team name"
        value={subTeamNameSearchTxt}
        className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
        onChange={(e) => setSubTeamNameSearchTxt(e.target.value)}
      />
    );
  }

  if (displayList === "Task") {
    return (
      <input
        type="text"
        placeholder="Search by task name"
        value={taskNameSearchTxt}
        className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
        onChange={(e) => setTaskNameSearchTxt(e.target.value)}
      />
    );
  }

  return null;
};

export default SearchInput;
