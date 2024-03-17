/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import FilterButton from "../FilterButton";
import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import SwitchListBtn from "./SwitchListBtn";

export default function ListHeader({
  setShowAddPopUp,
  setRenderList,
  renderList,
}) {
  return (
    <div
      id="bodyHeader"
      className="flex items-center justify-between py-3 text-sm px-7"
    >
      <div className="flex flex-col gap-1">
        <span className="font-medium">{renderList}s</span>
        <span className="text-[#828282]">List of all {renderList}s</span>
      </div>
      <div className="flex gap-5">
        <FilterButton renderList={renderList} />
        <SearchInput renderList={renderList} />
      </div>
      <div className="flex gap-10 text-[#828282]">
        <button onClick={() => setRenderList("Project")}>Projects</button>
        <button onClick={() => setRenderList("Team")}>Teams</button>
        <button onClick={() => setRenderList("Sub Team")}>Sub Teams</button>
        <button onClick={() => setRenderList("Task")}>Tasks</button>
      </div>
      <div className="inline-flex gap-5">
        <ResetListBtn renderList={renderList} />
        <SwitchListBtn renderList={renderList} />
        <button onClick={() => setShowAddPopUp(true)}>
          <img src={add} className="size-10" alt="addToList" />
        </button>
      </div>
    </div>
  );
}
