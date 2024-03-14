/* eslint-disable react/prop-types */
import { projectContext } from "@/contexts/projectContext";
import { useContext } from "react";

export default function FilterDropDownMenu({
  filterBtnTextRef,
  setShowFilterDropDownMenu,
}) {
  const { setFilterProjects } = useContext(projectContext);

  const FilterButtons = ({ type }) => {
    return (
      <>
        <button
          onClick={() => {
            setShowFilterDropDownMenu(false);
            filterBtnTextRef.current.innerText = `${type} : ASC`;
            setFilterProjects({ type: `${type}_ASC`.toUpperCase() });
          }}
          className="bg-[#61E125] min-w-10 text-xs rounded-2xl"
        >
          Asc
        </button>{" "}
        <button
          onClick={() => {
            setShowFilterDropDownMenu(false);
            filterBtnTextRef.current.innerText = `${type} : DESC`;
            setFilterProjects({ type: `${type}_DESC`.toUpperCase() });
          }}
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
