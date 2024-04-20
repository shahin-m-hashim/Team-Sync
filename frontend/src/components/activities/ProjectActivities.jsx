/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { updateData } from "@/services/db";
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

  const handleProjectActivities = async () => {
    try {
      await updateData("notifications");
      setReFetchProjectActivities((prev) => !prev);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    socket.on("projectActivities", (notification) =>
      setReFetchProjectActivities(notification)
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
      <span>Activities</span>
      {projectActivities?.data?.filter((n) => !n.isRead).length > 0 && (
        <div className="absolute bottom-3 right-[-10px] rounded-full px-2 py-1 text-xs font-semibold bg-blue-500 text-white flex items-center justify-center">
          {projectActivities.data.filter((n) => !n.isRead).length}
        </div>
      )}
    </div>
  ) : (
    <ActivitiesPopUp
      activities={projectActivities?.data}
      handleActivities={handleProjectActivities}
      setShowActivitiesPopUp={setShowProjectActivitiesPopUp}
    />
  );
}
