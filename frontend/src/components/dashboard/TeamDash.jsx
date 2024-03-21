/* eslint-disable react/prop-types */
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import DetailCard from "../cards/DetailCard";
import { useContext } from "react";
import { teamContext } from "@/contexts/teamContext";
import StatusCard from "../cards/StatusCard";

export default function TeamDash({
  setRenderList,
  renderList,
  setShowAddPopUp,
}) {
  const {
    teams,
    setTeams,
    leaderTeams,
    initialTeams,
    resetTeamList,
    teamFilterBtnTxt,
    teamNameSearchTxt,
    listOnlyAdminTeams,
    setTeamFilterBtnTxt,
    setTeamNameSearchTxt,
    setListOnlyAdminTeams,
  } = useContext(teamContext);

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
        <StatusCard list={teams} renderList={renderList} />
      </div>
      <div className="bg-[#141414] mx-1 rounded-t-md text-white">
        <ListHeader
          setList={setTeams}
          renderList={renderList}
          resetList={resetTeamList}
          leaderList={leaderTeams}
          setRenderList={setRenderList}
          initialList={initialTeams}
          setShowAddPopUp={setShowAddPopUp}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyAdminTeams}
          setSwitchList={setListOnlyAdminTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div
        id="scrollableListBody"
        className="flex flex-col h-svh overflow-auto m-1 mt-0 rounded-b-md bg-[#141414] text-white"
      >
        <ListSubHeader renderList={renderList} />
        <ListBody
          list={teams}
          renderList={renderList}
          listNameSearchTxt={teamNameSearchTxt}
        />
      </div>
    </>
  );
}
