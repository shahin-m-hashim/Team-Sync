/* eslint-disable react/prop-types */
import { useContext } from "react";
import { projectContext } from "@/contexts/projectContext";
import { teamContext } from "@/contexts/teamContext";

export default function FilterDropDownMenu({
  displayList,
  setShowFilterDropDownMenu,
}) {
  const { setFilterProjects, setProjectFilterBtnText } =
    useContext(projectContext);
  const { setFilterTeams, setTeamFilterBtnText } = useContext(teamContext);

  // Determine which set of state and functions to use based on the displayList
  const setFilter =
    displayList === "Projects" ? setFilterProjects : setFilterTeams;
  const setFilterBtnTextFunc =
    displayList === "Projects" ? setProjectFilterBtnText : setTeamFilterBtnText;

  const FilterButtons = ({ type }) => {
    const ascOnClickHandler = () => {
      setShowFilterDropDownMenu(false);
      setFilterBtnTextFunc(`${type} : ASC`);
      setFilter({ type: `${type}_ASC`.toUpperCase() });
    };

    const descOnClickHandler = () => {
      setShowFilterDropDownMenu(false);
      setFilterBtnTextFunc(`${type} : DESC`);
      setFilter({ type: `${type}_DESC`.toUpperCase() });
    };

    return (
      <>
        <button
          onClick={ascOnClickHandler}
          className="bg-[#61E125] min-w-10 text-xs rounded-2xl"
        >
          Asc
        </button>
        <button
          onClick={descOnClickHandler}
          className="bg-[#F7C217] min-w-10 text-xs rounded-2xl"
        >
          Desc
        </button>
      </>
    );
  };

  const FilterOption = ({ filterBy }) => {
    return (
      <div className="flex justify-between">
        <div className="bg-[#171A30] p-1 min-w-20">
          <span>{filterBy}</span>
        </div>
        <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
          <FilterButtons type={filterBy} />
        </div>
      </div>
    );
  };

  return (
    <div className="absolute text-center top-9 right-[-10px] flex flex-col justify-evenly p-2 py-0 rounded-xl min-w-[200px] h-[150px] bg-[#4D4D4D]">
      <FilterOption filterBy="Name" />
      <FilterOption filterBy="Created" />
      <FilterOption filterBy="Progress" />
      <FilterOption filterBy="Status" />
    </div>
  );
}
