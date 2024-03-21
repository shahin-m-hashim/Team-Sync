/* eslint-disable react/prop-types */
import add from "../../assets/images/Add.png";
import FilterButton from "../FilterButton";
import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import SwitchListBtn from "./SwitchListBtn";

export default function ListHeader({
  setList,
  renderList,
  resetList,
  leaderList,
  setRenderList,
  initialList,
  setShowAddPopUp,
  filterBtnTxt,
  switchList,
  setSwitchList,
  setFilterBtnTxt,
  listNameSearchTxt,
  setListNameSearchTxt,
}) {
  return (
    <div className="flex items-center justify-between py-3 text-sm px-7">
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          {switchList && "Your"} {renderList}s
        </span>
        <span className="text-[#828282]">
          List of all {switchList && "your"} {renderList.toLowerCase()}s
        </span>
      </div>
      <div className="flex gap-5">
        <FilterButton
          setList={setList}
          renderList={renderList}
          filterBtnTxt={filterBtnTxt}
          setFilterBtnTxt={setFilterBtnTxt}
        />
        <SearchInput
          setList={setList}
          switchList={switchList}
          initialList={initialList}
          leaderList={leaderList}
          renderList={renderList}
          listNameSearchTxt={listNameSearchTxt}
          setListNameSearchTxt={setListNameSearchTxt}
        />
      </div>
      <div className="flex gap-10 text-[#828282]">
        <button onClick={() => setRenderList("Project")}>Projects</button>
        <button onClick={() => setRenderList("Team")}>Teams</button>
        <button onClick={() => setRenderList("Sub Team")}>Sub Teams</button>
        <button onClick={() => setRenderList("Task")}>Tasks</button>
      </div>
      <div className="inline-flex gap-5">
        <ResetListBtn resetList={resetList} />
        <SwitchListBtn switchList={switchList} setSwitchList={setSwitchList} />
        <button onClick={() => setShowAddPopUp(true)}>
          <img src={add} className="size-10" alt="addToList" />
        </button>
      </div>
    </div>
  );
}
