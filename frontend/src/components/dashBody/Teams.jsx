/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { socket } from "@/App";
import Loading from "../Loading";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { addData } from "@/services/db";
import DetailCard from "../cards/DetailCard";
import StatusCard from "../cards/StatusCard";
import { useParams } from "react-router-dom";
import ListBody from "@/components/list/ListBody";
import { listReducer } from "@/helpers/listReducer";
import ListHeader from "@/components/list/ListHeader";
import { UserContext } from "@/providers/UserProvider";
import AddListEntityForm from "../forms/AddListEntityForm";
import ListSubHeader from "@/components/list/ListSubHeader";
import { useContext, useEffect, useReducer, useState } from "react";
import SendProjectInviteForm from "../forms/projects/SendProjectInviteForm";

export default function Teams() {
  const { userId, projectId } = useParams();
  const { setError } = useContext(UserContext);

  const [reFetchTeams, setReFetchTeams] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyLeaderTeams, setListOnlyLeaderTeams] = useState(false);

  const [showSendProjectInviteForm, setShowSendProjectInviteForm] =
    useState(false);

  const teams = useFetch(`projects/${projectId}/teams`, reFetchTeams);
  const leaderTeams = teams?.data?.filter((team) => team.role === "Leader");

  const [initialTeams, dispatch] = useReducer(listReducer, teams?.data);
  const setTeams = (action) => dispatch(action);

  const handleAddTeam = async (teamDetails) => {
    try {
      await addData(`projects/${projectId}/team`, { teamDetails });
      setShowAddTeamForm(false);
      toast.success("Team added successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    }
  };

  const resetTeamList = () => {
    setTeamNameSearchTxt("");
    setListOnlyLeaderTeams(false);
    setTeamFilterBtnTxt("Filter");
    setTeams({
      type: "RESET",
      initialState: teams?.data,
    });
  };

  useEffect(() => {
    setTeamNameSearchTxt("");
    setTeamFilterBtnTxt("Filter");
    if (listOnlyLeaderTeams) {
      setTeams({
        type: "SWITCH",
        payload: leaderTeams,
      });
    } else {
      setTeams({
        type: "SWITCH",
        payload: teams?.data,
      });
    }
  }, [teams?.data, listOnlyLeaderTeams]);

  useEffect(() => {
    socket.on("teams", (team) => setReFetchTeams(team));
    return () => socket.off("teams");
  }, []);

  if (teams?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (teams?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <>
      {showAddTeamForm && (
        <AddListEntityForm
          renderList="Team"
          handleAddEntity={handleAddTeam}
          setShowAddEntityForm={setShowAddTeamForm}
          description="Your Team is where you can organize your sub teams, add members and work with them effortlessly."
        />
      )}
      {showSendProjectInviteForm && (
        <div className="absolute inset-0 z-[100] h-full size-full backdrop-blur-sm">
          <div className="relative h-[70%] text-white max-w-xl transform -translate-x-1/2 top-20 left-1/2">
            <SendProjectInviteForm
              projectId={projectId}
              setShowSendProjectInviteForm={setShowSendProjectInviteForm}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-[2px] text-white border-2 border-t-0 border-white min-h-72">
        <DetailCard
          renderList="Team"
          projectId={projectId}
          setShowSendProjectInviteForm={setShowSendProjectInviteForm}
        />
        {initialTeams ? (
          <StatusCard list={initialTeams} renderList="Team" />
        ) : (
          <div className="relative bg-[#141414]">
            <Loading />
          </div>
        )}
      </div>
      <div>
        <ListHeader
          renderList="Team"
          setList={setTeams}
          initialList={teams?.data}
          leaderList={leaderTeams}
          resetList={resetTeamList}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyLeaderTeams}
          setSwitchList={setListOnlyLeaderTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setShowAddEntityForm={setShowAddTeamForm}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Team" />
        {initialTeams ? (
          <ListBody
            userId={userId}
            renderList={"Team"}
            list={initialTeams || []}
            listNameSearchTxt={teamNameSearchTxt}
          />
        ) : (
          <div className="relative h-full">
            <Loading />
          </div>
        )}
      </div>
    </>
  );
}
