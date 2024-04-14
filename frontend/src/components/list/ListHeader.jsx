/* eslint-disable react/prop-types */

import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import FilterButton from "../FilterButton";
import SwitchListBtn from "./SwitchListBtn";
import add from "../../assets/images/Add.png";

export default function ListHeader({
  setList,
  resetList,
  renderList,
  leaderList,
  switchList,
  initialList,
  filterBtnTxt,
  setSwitchList,
  setShowAddForm,
  setFilterBtnTxt,
  listNameSearchTxt,
  setListNameSearchTxt,
}) {
  return (
    <div className="grid bg-[#141414] grid-cols-[200px,1fr,180px] items-center text-white py-2 text-sm border-2 border-white rounded-t-md border-y-0 px-7">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{renderList}s</span>
        <span className="text-[#828282]">
          List of all {renderList.toLowerCase()}s
        </span>
      </div>
      <div className="flex gap-7">
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
      <div className="inline-flex gap-5">
        <ResetListBtn resetList={resetList} />
        <SwitchListBtn switchList={switchList} setSwitchList={setSwitchList} />
        <button onClick={() => setShowAddForm(true)}>
          <img src={add} className="size-10" alt="addToList" />
        </button>
      </div>
    </div>
  );
}
