/* eslint-disable react/prop-types */

import { socket } from "@/App";
import Loading from "../Loading";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import DetailCard from "../cards/DetailsCard";
import { getLocalSecureItem } from "@/lib/utils";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";

export default function TeamDetailsCard({
  showTeamActivitiesPopUp,
  setShowTeamActivitiesPopUp,
  setShowAddTeamCollaboratorForm,
}) {
  const { setError } = useContext(UserContext);
  const { userId, projectId, teamId } = useParams();

  const [disableProjectSettingsLink, setDisableProjectSettingsLink] =
    useState(false);

  const [reFetchTeamDetails, setReFetchTeamDetails] = useState(false);

  useEffect(() => {
    const teams = getLocalSecureItem("teams", "medium");

    teams?.forEach((team) => {
      if (team.id === teamId && team.role !== "Leader")
        setDisableProjectSettingsLink(true);
    });
  }, [teamId]);

  const teamDetails = useFetch(
    `projects/${projectId}/teams/${teamId}/details`,
    reFetchTeamDetails
  );

  useEffect(() => {}, [teamDetails]);

  useEffect(() => {
    socket.on("teamDetails", (teamDetails) =>
      setReFetchTeamDetails(teamDetails)
    );

    return () => socket.off("teamDetails");
  }, []);

  if (teamDetails?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (teamDetails?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return teamDetails?.data ? (
    <DetailCard
      entity="team"
      details={teamDetails?.data}
      showActivitiesPopUp={showTeamActivitiesPopUp}
      disableSettingsLink={disableProjectSettingsLink}
      setShowActivitiesPopUp={setShowTeamActivitiesPopUp}
      setDisableSettingsLink={setDisableProjectSettingsLink}
      setShowAddCollaboratorForm={setShowAddTeamCollaboratorForm}
      settingsPath={`/user/${userId}/projects/${projectId}/teams/${teamId}/settings`}
    />
  ) : (
    <div className="relative bg-[#141414]">
      <Loading />
    </div>
  );
}
