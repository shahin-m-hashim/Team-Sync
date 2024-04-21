/* eslint-disable react/prop-types */

import { socket } from "@/App";
import Loading from "../Loading";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import DetailCard from "../cards/DetailsCard";
import { getLocalSecureItem } from "@/lib/utils";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";

export default function SubTeamDetailsCard({
  showSubTeamActivitiesPopUp,
  showAddTeamCollaboratorForm,
  setShowSubTeamActivitiesPopUp,
}) {
  const { userId, projectId, teamId, subTeamId } = useParams();
  const { setError } = useContext(UserContext);

  const [disableSubTeamSettingsLink, setDisableProjectSettingsLink] =
    useState(false);

  const [reFetchProjectDetails, setReFetchProjectDetails] = useState(false);

  useEffect(() => {
    const subTeams = getLocalSecureItem("subTeams", "medium");

    subTeams?.forEach((subTeam) => {
      if (subTeam.subTeam === projectId && subTeam.role !== "Leader")
        setDisableProjectSettingsLink(true);
    });
  }, [projectId]);

  const subTeamDetails = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/details`,
    reFetchProjectDetails
  );

  useEffect(() => {}, [subTeamDetails]);

  useEffect(() => {
    socket.on("subTeamDetails", (subTeamDetails) =>
      setReFetchProjectDetails(subTeamDetails)
    );

    return () => socket.off("subTeamDetails");
  }, []);

  if (subTeamDetails?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (subTeamDetails?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return subTeamDetails?.data ? (
    <DetailCard
      entity="sub team"
      details={subTeamDetails?.data}
      showActivitiesPopUp={showSubTeamActivitiesPopUp}
      disableSettingsLink={disableSubTeamSettingsLink}
      setShowActivitiesPopUp={setShowSubTeamActivitiesPopUp}
      setDisableSettingsLink={setDisableProjectSettingsLink}
      setShowAddCollaboratorForm={showAddTeamCollaboratorForm}
      settingsPath={`/user/${userId}/projects/${projectId}/settings`}
    />
  ) : (
    <div className="relative bg-[#141414]">
      <Loading />
    </div>
  );
}
