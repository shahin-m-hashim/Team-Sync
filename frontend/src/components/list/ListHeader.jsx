/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import add from "../../assets/images/Add.png";
import FilterButton from "../FilterButton";
import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import SwitchListBtn from "./SwitchListBtn";
import { getLocalSecureItem } from "@/lib/utils";

export default function ListHeader({
  setList,
  renderList,
  resetList,
  leaderList,
  initialList,
  setShowAddForm,
  filterBtnTxt,
  switchList,
  setSwitchList,
  setFilterBtnTxt,
  listNameSearchTxt,
  setListNameSearchTxt,
}) {
  const user = getLocalSecureItem("user", "low");

  return (
    <div className="flex bg-[#141414] text-white  items-center justify-between py-2 text-sm border-2 border-white rounded-t-md border-y-0 px-7">
      <div className="flex flex-col gap-1">
        <span className="font-medium">
          {switchList && "Your"} {renderList}s
        </span>
        <span className="text-[#828282]">
          List of all {switchList && "your"} {renderList.toLowerCase()}s
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
      <div className="flex gap-10 text-[#828282]">
        <Link to={`/user/${user?.id}/dashboard/projects`}>Projects</Link>
        <Link to={`/user/${user?.id}/dashboard/teams`}>Teams</Link>
        <Link to={`/user/${user?.id}/dashboard/subTeams`}>Sub Teams</Link>
        <Link to={`/user/${user?.id}/dashboard/tasks`}>Tasks</Link>
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
