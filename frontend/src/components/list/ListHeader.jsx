/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import FilterButton from "../FilterButton";
import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import SwitchListBtn from "./SwitchListBtn";

export default function ListHeader({
  setShowAddPopUp,
  setDisplayList,
  displayList,
}) {
  return (
    <div
      id="bodyHeader"
      className="flex items-center justify-between py-3 text-sm px-7"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">{displayList}s</span>
        <span className="text-[#828282]">List of all {displayList}s</span>
      </div>
      <div className="flex gap-5">
        <FilterButton displayList={displayList} />
        <SearchInput displayList={displayList} />
      </div>
      <div className="flex gap-10 text-[#828282]">
        <button onClick={() => setDisplayList("Project")}>Projects</button>
        <button onClick={() => setDisplayList("Team")}>Teams</button>
        <button onClick={() => setDisplayList("Sub Team")}>Sub Teams</button>
        <span>Tasks</span>
      </div>
      <div className="inline-flex gap-5">
        <ResetListBtn displayList={displayList} />
        <SwitchListBtn displayList={displayList} />
        <button onClick={() => setShowAddPopUp(true)}>
          <img src={add} className="size-10" alt="addToList" />
        </button>
      </div>
    </div>
  );
}
