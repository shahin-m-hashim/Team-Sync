/* eslint-disable react/prop-types */

export default function FilterDropDownMenu({
  setList,
  renderList,
  setFilterBtnTxt,
  setShowFilterDropDownMenu,
}) {
  const handleFilterClick = (filterBy, order) => {
    setShowFilterDropDownMenu(false);
    setFilterBtnTxt(`${filterBy} : ${order}`);
    setList({ type: `${filterBy}_${order}`.toUpperCase() });
  };

  const FilterButtons = ({ filterBy }) => (
    <>
      <button
        onClick={() => handleFilterClick(filterBy, "ASC")}
        className="bg-[#61E125] min-w-10 text-xs rounded-2xl"
      >
        Asc
      </button>
      <button
        onClick={() => handleFilterClick(filterBy, "DESC")}
        className="bg-[#F7C217] min-w-10 text-xs rounded-2xl"
      >
        Desc
      </button>
    </>
  );

  const FilterOption = ({ filterBy }) => (
    <div className="flex justify-between">
      <div className="bg-[#171A30] p-1 min-w-20">
        <span>{filterBy}</span>
      </div>
      <div className="p-1 text-black flex justify-between bg-[#D9D9D9] min-w-24">
        <FilterButtons filterBy={filterBy} />
      </div>
    </div>
  );

  return (
    <div className="absolute z-10 text-center top-9 right-[-10px] flex flex-col justify-evenly p-2 py-0 rounded-xl min-w-[200px] h-[150px] bg-[#4D4D4D]">
      <FilterOption filterBy="Name" />
      <FilterOption filterBy="Created" />
      {renderList !== "Task" && <FilterOption filterBy="Progress" />}
      <FilterOption filterBy="Status" />
      {renderList === "Task" && (
        <>
          <FilterOption filterBy="Priority" />
          <FilterOption filterBy="Deadline" />
        </>
      )}
    </div>
  );
}
