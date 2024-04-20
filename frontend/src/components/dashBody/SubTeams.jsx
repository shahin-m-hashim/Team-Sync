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
import AddEntityCollaboratorForm from "../forms/AddEntityCollaboratorForm";

export default function SubTeams() {
  const { setError } = useContext(UserContext);
  const { projectId, teamId } = useParams();

  const [reFetchSubTeams, setReFetchSubTeams] = useState(false);
  const [teamNameSearchTxt, setTeamNameSearchTxt] = useState("");
  const [teamFilterBtnTxt, setTeamFilterBtnTxt] = useState("Filter");
  const [showAddSubTeamForm, setShowAddSubTeamForm] = useState(false);
  const [listOnlyLeaderSubTeams, setListOnlyLeaderSubTeams] = useState(false);

  const [showAddSubTeamCollaboratorForm, setShowAddSubTeamCollaboratorForm] =
    useState(false);

  const teamDetails = useFetch(`projects/${projectId}/teams/${teamId}`);
  const teamSettings = useFetch(
    `projects/${projectId}/teams/${teamId}/settings`
  );
  const subTeams = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeams`,
    reFetchSubTeams
  );

  const leaderSubTeams = subTeams?.data?.filter(
    (team) => team.role === "Leader"
  );

  const handleAddSubTeamCollaborator = async (values) => {
    try {
      await addData(`projects/${projectId}/teams/${teamId}/add`, values);
      setShowAddSubTeamCollaboratorForm(false);
      setReFetchSubTeams((prev) => !prev);
      toast.success("Sub Team collaborator added successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "Failed to add sub team collaborator"
      );
    }
  };

  const handleAddSubTeam = async (subTeamDetails) => {
    try {
      await addData(`projects/${projectId}/teams/${teamId}/subTeam`, {
        subTeamDetails,
      });
      setShowAddSubTeamForm(false);
      toast.success("Sub team added successfully");
    } catch (e) {
      toast.error(
        e.response.data.error || "An unexpected error occurred, try again later"
      );
    }
  };

  const resetSubTeamList = () => {
    setTeamNameSearchTxt("");
    setListOnlyLeaderSubTeams(false);
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
    if (listOnlyLeaderSubTeams) {
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
  }, [subTeams?.data, listOnlyLeaderSubTeams]);

  useEffect(() => {
    socket.on("subTeams", (team) => setReFetchSubTeams(team));
    return () => socket.off("subTeams");
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
      {showAddSubTeamForm && (
        <AddListEntityForm
          renderList="Sub Team"
          handleAddEntity={handleAddSubTeam}
          setShowAddEntityForm={setShowAddSubTeamForm}
          description="Your sub team is where you can add members, create and assign tasks to work with them effortlessly."
        />
      )}
      {showAddSubTeamCollaboratorForm && (
        <div className="absolute inset-0 z-[100] h-full size-full backdrop-blur-sm">
          <div className="relative h-[70%] text-white max-w-xl transform -translate-x-1/2 top-20 left-1/2">
            <AddEntityCollaboratorForm
              entity="team"
              parent="project"
              parentMembers={teamSettings?.data?.parentMembers}
              handleAddEntityCollaborator={handleAddSubTeamCollaborator}
              setShowAddEntityCollaboratorForm={
                setShowAddSubTeamCollaboratorForm
              }
            />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-[2px] text-white border-2 border-t-0 border-white min-h-72">
        <DetailCard
          renderList="Sub Team"
          parentDetails={teamDetails}
          setShowAddCollaboratorForm={setShowAddSubTeamCollaboratorForm}
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
          projectId={projectId}
          leaderList={leaderSubTeams}
          resetList={resetSubTeamList}
          initialList={subTeams?.data}
          filterBtnTxt={teamFilterBtnTxt}
          switchList={listOnlyLeaderSubTeams}
          listNameSearchTxt={teamNameSearchTxt}
          setFilterBtnTxt={setTeamFilterBtnTxt}
          setSwitchList={setListOnlyLeaderSubTeams}
          setListNameSearchTxt={setTeamNameSearchTxt}
          setShowAddEntityForm={setShowAddSubTeamForm}
        />
      </div>
      <div className="flex flex-col h-full border-white border-2 rounded-b-md border-t-0 overflow-auto bg-[#141414] text-white">
        <ListSubHeader renderList="Sub Team" />
        {initialSubTeams ? (
          <ListBody
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
