/* eslint-disable react/prop-types */
import filter from "../assets/images/Filter.png";
import { useEffect, useRef, useState } from "react";
import dropArrow from "../assets/images/Expand Arrow.png";
import FilterDropDownMenu from "./dropDowns/FilterDropDownMenu";

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
      className="relative max-h-8 flex items-center gap-2 p-4 text-xs border-[1px] border-white rounded-xl"
      ref={filterDropDownRef}
    >
      <img src={filter} className="size-5" />
      <span>{filterBtnTxt}</span>
      <button
        onClick={() => setShowFilterDropDownMenu((prevState) => !prevState)}
      >
        <img src={dropArrow} className="size-5" />
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
