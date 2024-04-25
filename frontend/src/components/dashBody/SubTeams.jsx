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
import { ErrorContext } from "@/providers/ErrorProvider";
import AddListEntityForm from "../forms/AddListEntityForm";
import ListSubHeader from "@/components/list/ListSubHeader";
import { useContext, useEffect, useReducer, useState } from "react";
import SendProjectInviteForm from "../forms/projects/SendProjectInviteForm";

export default function SubTeams() {
  const { setError } = useContext(ErrorContext);
  const { userId, projectId, teamId } = useParams();

  const [reFetchSubTeams, setReFetchSubTeams] = useState(false);
  const [showAddTeamForm, setShowAddTeamForm] = useState(false);
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [listOnlyAdminSubTeams, setListOnlyAdminSubTeams] = useState(false);

  const [showAddTeamCollaboratorForm, setShowAddTeamCollaboratorForm] =
    useState(false);

  const subTeams = useFetch(`projects/${projectId}/SubTeams`, reFetchSubTeams);

  const leaderSubTeams = subTeams?.data?.filter(
    (team) => team.role === "Leader"
  );

  const handleAddTeam = async (subTeamDetails) => {
    try {
      await addData(`projects/${projectId}/SubTeams/${teamId}/subTeam`, {
        subTeamDetails,
      });
      setShowAddTeamForm(false);
      toast.success("Sub Team added successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    }
  };

  const resetTeamList = () => {
    setTeamNameSearchTxt("");
    setListOnlyAdminSubTeams(false);
    setTeamFilterBtnTxt("Filter");
    setSubTeams({
      type: "RESET",
      initialState: subTeams?.data,
    });
  };

  const [initialSubTeams, dispatch] = useReducer(listReducer, SubTeams?.data);
  const setSubTeams = (action) => dispatch(action);

  useEffect(() => {
    setTeamNameSearchTxt("");
    setTeamFilterBtnTxt("Filter");
    if (listOnlyAdminSubTeams) {
      setSubTeams({
        type: "SWITCH",
        payload: leaderSubTeams,
      });
    } else {
      setSubTeams({
        type: "SWITCH",
        payload: subTeams?.data,
      });
    }
  }, [subTeams?.data, listOnlyAdminSubTeams]);

  useEffect(() => {
    socket.on("SubTeams", (team) => setReFetchSubTeams(team));
    return () => socket.off("SubTeams");
  }, []);

  if (subTeams?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (subTeams?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <>
      {showAddTeamForm && (
        <AddListEntityForm
          renderList="Sub Team"
          handleAddEntity={handleAddTeam}
          setShowAddEntityForm={setShowAddTeamForm}
          description="Your Sub Team is where you can create your tasks, add members, assign tasks and work with them effortlessly."
        />
      )}
      {showAddTeamCollaboratorForm && (
        <div className="absolute inset-0 z-[100] h-full size-full backdrop-blur-sm">
          <div className="relative h-[70%] text-white max-w-xl transform -translate-x-1/2 top-20 left-1/2">
            <SendProjectInviteForm
              projectId={projectId}
              setShowSendProjectInviteForm={setShowAddTeamCollaboratorForm}
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-[2px] text-white border-2 border-t-0 border-white min-h-72">
        <DetailCard
          renderList="Team"
          projectId={projectId}
          setShowSendProjectInviteForm={setShowAddTeamCollaboratorForm}
        />
        {initialSubTeams ? (
          <StatusCard list={initialSubTeams} renderList="Team" />
        ) : (
          <div className="relative bg-[#141414]">
            <Loading />
          </div>
        )}
      </div>
      <div>
        <ListHeader
          renderList="Sub Team"
          setList={setSubTeams}
          initialList={SubTeams}
          leaderList={leaderSubTeams}
          resetList={resetTeamList}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyAdminSubTeams}
          setSwitchList={setListOnlyAdminSubTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setShowAddEntityForm={setShowAddTeamForm}
          setListNameSearchTxt={setTeamNameSearchTxt}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Sub Team" />
        {initialSubTeams ? (
          <ListBody
            userId={userId}
            renderList={"Sub Team"}
            list={initialSubTeams || []}
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
