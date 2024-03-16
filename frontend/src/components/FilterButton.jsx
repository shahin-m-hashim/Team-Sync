/* eslint-disable react/prop-types */
import filter from "../assets/images/Filter.png";
import dropArrow from "../assets/images/Expand Arrow.png";
import FilterDropDownMenu from "./FilterDropDownMenu";
import { useContext, useEffect, useRef, useState } from "react";
import { projectContext } from "@/contexts/projectContext";
import { teamContext } from "@/contexts/teamContext";
import { subTeamContext } from "@/contexts/subTeamContext";
import { taskContext } from "@/contexts/taskContext";

export default function FilterButton({ displayList }) {
  const filterDropDownRef = useRef();
  const { teamFilterBtnTxt } = useContext(teamContext);
  const { projectFilterBtnTxt } = useContext(projectContext);
  const { subTeamFilterBtnTxt } = useContext(subTeamContext);
  const { taskFilterBtnTxt } = useContext(taskContext);
  const [showFilterDropDownMenu, setShowFilterDropDownMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterDropDownRef.current &&
        !filterDropDownRef.current.contains(event.target)
      ) {
        setShowFilterDropDownMenu(false);
      }
    };

    if (showFilterDropDownMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterDropDownMenu, setShowFilterDropDownMenu]);

  return (
    <div
      className="relative flex items-center gap-2 px-2 py-1 text-xs border-[1px] border-white rounded-xl"
      ref={filterDropDownRef}
    >
      <img src={filter} alt="filter" className="size-5" />
      {displayList === "Project" && <span>{projectFilterBtnTxt}</span>}
      {displayList === "Team" && <span>{teamFilterBtnTxt}</span>}
      {displayList === "Sub Team" && <span>{subTeamFilterBtnTxt}</span>}
      {displayList === "Task" && <span>{taskFilterBtnTxt}</span>}
      <button
        onClick={() => setShowFilterDropDownMenu((prevState) => !prevState)}
      >
        <img src={dropArrow} alt="dropArrow" className="size-5" />
      </button>
      {showFilterDropDownMenu && (
        <FilterDropDownMenu
          displayList={displayList}
          setShowFilterDropDownMenu={setShowFilterDropDownMenu}
        />
      )}
    </div>
  );
}