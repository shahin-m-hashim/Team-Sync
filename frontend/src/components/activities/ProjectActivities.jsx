/* eslint-disable react/prop-types */

import { socket } from "@/App";
import useFetch from "@/hooks/useFetch";
import { useParams } from "react-router-dom";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import ActivitiesPopUp from "../popups/ActivitiesPopUp";

export default function ProjectActivities({
  showProjectActivitiesPopUp,
  setShowProjectActivitiesPopUp,
}) {
  const { projectId } = useParams();
  const { setError } = useContext(UserContext);
  const [reFetchProjectActivities, setReFetchProjectActivities] =
    useState(false);

  const projectActivities = useFetch(
    `projects/${projectId}/activities`,
    reFetchProjectActivities
  );

  useEffect(() => {}, [projectActivities]);

  useEffect(() => {
    socket.on("projectActivities", (projectActivities) =>
      setReFetchProjectActivities(projectActivities)
    );

    return () => socket.off("projectActivities");
  }, []);

  if (projectActivities?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (projectActivities?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return !showProjectActivitiesPopUp ? (
    <div
      className="relative cursor-pointer"
      onClick={() => setShowProjectActivitiesPopUp(true)}
    >
      Activities
    </div>
  ) : (
    <ActivitiesPopUp
      entity="Project"
      activities={projectActivities?.data}
      setShowActivitiesPopUp={setShowProjectActivitiesPopUp}
    />
  );
}
