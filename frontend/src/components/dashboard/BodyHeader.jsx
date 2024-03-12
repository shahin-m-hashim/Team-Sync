/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import filter from "../../assets/images/Filter.png";
import search from "../../assets/images/Search.png";
import dropArrow from "../../assets/images/Expand Arrow.png";

export default function BodyHeader({ setShowAddPopUp }) {
  return (
    <div
      id="bodyHeader"
      className="flex items-center justify-between px-5 py-3 text-sm"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">Projects</span>
        <span className=" text-[#828282]">List of all projects</span>
      </div>
      <div className="flex gap-5">
        <button className="flex items-center gap-2 px-2 py-1 text-xs border-[1px] border-white rounded-xl">
          <img src={filter} alt="filter" className="size-5" />
          <span>Filter</span>
          <img src={dropArrow} alt="dropArrow" className="size-5" />
        </button>
        <button className="flex items-center gap-2 py-1 pl-2 pr-20 text-xs border-[1px] border-white rounded-xl">
          <img src={search} alt="search" className="size-5" />
          <span>Search</span>
        </button>
      </div>
      <div className="flex gap-10 text-[#828282]">
        <span>Projects</span>
        <span>Teams</span>
        <span>Sub Teams</span>
        <span>Tasks</span>
      </div>
      <button>
        <img
          src={add}
          onClick={() => setShowAddPopUp(true)}
          className="size-10"
          alt="addProject"
        />
      </button>
    </div>
  );
}
