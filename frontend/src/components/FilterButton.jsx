/* eslint-disable react/prop-types */
import filter from "../assets/images/Filter.png";
import dropArrow from "../assets/images/Expand Arrow.png";
import FilterDropDownMenu from "./FilterDropDownMenu";
import { useEffect, useRef, useState } from "react";

export default function FilterButton({
  setList,
  renderList,
  filterBtnTxt,
  setFilterBtnTxt,
}) {
  const filterDropDownRef = useRef();
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
      <span>{filterBtnTxt}</span>
      <button
        onClick={() => setShowFilterDropDownMenu((prevState) => !prevState)}
      >
        <img src={dropArrow} alt="dropArrow" className="size-5" />
      </button>
      {showFilterDropDownMenu && (
        <FilterDropDownMenu
          setList={setList}
          renderList={renderList}
          setFilterBtnTxt={setFilterBtnTxt}
          setShowFilterDropDownMenu={setShowFilterDropDownMenu}
        />
      )}
    </div>
  );
}