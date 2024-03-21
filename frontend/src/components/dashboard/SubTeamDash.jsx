/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import { useContext } from "react";
import { subTeamContext } from "@/contexts/subTeamContext";
import StatusCard from "../cards/StatusCard";

export default function SubTeamDash({
  renderList,
  setRenderList,
  setShowAddPopUp,
}) {
  const {
    subTeams,
    setSubTeams,
    leaderSubTeams,
    initialSubTeams,
    resetSubTeamList,
    subTeamFilterBtnTxt,
    subTeamNameSearchTxt,
    listOnlyAdminSubTeams,
    setSubTeamFilterBtnTxt,
    setSubTeamNameSearchTxt,
    setListOnlyAdminSubTeams,
  } = useContext(subTeamContext);

  return (
    <>
      <div className="grid grid-cols-[1fr,1fr] text-white">
        <DetailCard
          details={{
            name: "Project 1",
            leader: "Shahin123",
            guide: "Sindhiya",
            nom: 20,
          }}
        />
        <StatusCard list={subTeams} renderList={renderList} />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setSubTeams}
          renderList={renderList}
          resetList={resetSubTeamList}
          leaderList={leaderSubTeams}
          setRenderList={setRenderList}
          initialList={initialSubTeams}
          setShowAddPopUp={setShowAddPopUp}
          filterBtnTxt={subTeamFilterBtnTxt}
          switchList={listOnlyAdminSubTeams}
          setSwitchList={setListOnlyAdminSubTeams}
          listNameSearchTxt={subTeamNameSearchTxt}
          setFilterBtnTxt={setSubTeamFilterBtnTxt}
          setListNameSearchTxt={setSubTeamNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody
          list={subTeams}
          renderList={renderList}
          listNameSearchTxt={subTeamNameSearchTxt}
        />
      </div>
    </>
  );
}
