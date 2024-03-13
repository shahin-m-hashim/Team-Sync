/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import filter from "../../assets/images/Filter.png";
import switchIcon from "../../assets/images/Switch.png";
import dropArrow from "../../assets/images/Expand Arrow.png";

export default function ListHeader({
  setShowAddPopUp,
  setListOnlyAdminProjects,
  setSearchByName,
}) {
  return (
    <div
      id="bodyHeader"
      className="flex items-center justify-between py-3 text-sm px-7"
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
        <input
          type="text"
          placeholder="Search by name"
          className="py-1 pl-4 pr-16 text-xs bg-inherit border-[1px] border-white rounded-xl"
          onChange={(e) => setSearchByName(e.target.value.toLowerCase())}
        />
      </div>
      <div className="flex gap-10 text-[#828282]">
        <span>Projects</span>
        <span>Teams</span>
        <span>Sub Teams</span>
        <span>Tasks</span>
      </div>
      <div className="inline-flex gap-5">
        <button
          onClick={() => setListOnlyAdminProjects((prevState) => !prevState)}
        >
          <img src={switchIcon} className="size-10" alt="switchProjectView" />
        </button>
        <button onClick={() => setShowAddPopUp(true)}>
          <img src={add} className="size-10" alt="addProject" />
        </button>
      </div>
    </div>
  );
}
