/* eslint-disable react/prop-types */

import SearchInput from "../SearchInput";
import ResetListBtn from "./ResetListBtn";
import FilterButton from "../FilterButton";
import SwitchListBtn from "./SwitchListBtn";
import add from "../../assets/images/Add.png";
import { useEffect, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";
import { useParams } from "react-router-dom";

export default function ListHeader({
  setList,
  resetList,
  renderList,
  leaderList,
  switchList,
  initialList,
  filterBtnTxt,
  setSwitchList,
  setFilterBtnTxt,
  listNameSearchTxt,
  setShowAddEntityForm,
  setListNameSearchTxt,
}) {
  const { projectId, teamId } = useParams();
  const [showAddEntityBtn, setShowAddEntityBtn] = useState(true);

  useEffect(() => {
    if (renderList === "Team") {
      const projects = getLocalSecureItem("projects", "medium");
      projects?.forEach((project) => {
        if (project.id === projectId && project.role !== "Leader")
          setShowAddEntityBtn(false);
      });
    } else {
      const teams = getLocalSecureItem("teams", "medium");
      teams?.forEach((team) => {
        if (team.id === teamId && team.role !== "Leader")
          setShowAddEntityBtn(false);
      });
    }

    return () => setShowAddEntityBtn(true);
  }, [renderList, projectId, teamId]);

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
      <div className="inline-flex justify-end gap-5">
        <ResetListBtn resetList={resetList} />
        <SwitchListBtn switchList={switchList} setSwitchList={setSwitchList} />
        <button
          disabled={!showAddEntityBtn}
          className={showAddEntityBtn ? "cursor-pointer" : "cursor-not-allowed"}
          onClick={() => setShowAddEntityForm(true)}
        >
          <img src={add} className="size-10" />
        </button>
      </div>
    </div>
  );
}
