/* eslint-disable react/prop-types */

import { socket } from "@/App";
import Loading from "../Loading";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import DetailsCard from "../cards/DetailsCard";
import { getLocalSecureItem } from "@/lib/utils";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";

export default function ProjectDetailsCard({
  showProjectActivitiesPopUp,
  setShowProjectActivitiesPopUp,
  setShowInviteProjectCollaboratorForm,
}) {
  const { userId, projectId } = useParams();
  const { setError } = useContext(UserContext);

  const [disableProjectSettingsLink, setDisableProjectSettingsLink] =
    useState(false);

  const [reFetchProjectDetails, setReFetchProjectDetails] = useState(false);

  useEffect(() => {
    const projects = getLocalSecureItem("projects", "medium");

    projects?.forEach((project) => {
      if (project.id === projectId && project.role !== "Leader")
        setDisableProjectSettingsLink(true);
    });
  }, [projectId]);

  const projectDetails = useFetch(
    `projects/${projectId}/details`,
    reFetchProjectDetails
  );

  useEffect(() => {}, [projectDetails]);

  useEffect(() => {
    socket.on("projectDetails", (projectDetails) =>
      setReFetchProjectDetails(projectDetails)
    );

    return () => socket.off("projectDetails");
  }, []);

  if (projectDetails?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projectDetails?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return projectDetails?.data ? (
    <DetailsCard
      entity="project"
      details={projectDetails?.data}
      showActivitiesPopUp={showProjectActivitiesPopUp}
      disableSettingsLink={disableProjectSettingsLink}
      setShowActivitiesPopUp={setShowProjectActivitiesPopUp}
      setDisableSettingsLink={setDisableProjectSettingsLink}
      setShowAddCollaboratorForm={setShowInviteProjectCollaboratorForm}
      settingsPath={`/user/${userId}/projects/${projectId}/settings`}
    />
  ) : (
    <div className="relative bg-[#141414]">
      <Loading />
    </div>
  );
}
