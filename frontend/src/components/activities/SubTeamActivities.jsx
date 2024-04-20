/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { updateData } from "@/services/db";
import { useParams } from "react-router-dom";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import ActivitiesPopUp from "../popups/ActivitiesPopUp";

export default function SubTeamActivities({
  showSubTeamActivitiesPopUp,
  setShowSubTeamActivitiesPopUp,
}) {
  const { setError } = useContext(UserContext);
  const { projectId, teamId, subTeamId } = useParams();

  const [reFetchSubTeamActivities, setReFetchSubTeamActivities] =
    useState(false);

  const subTeamActivities = useFetch(
    `projects/${projectId}/teams/${teamId}/subTeam/${subTeamId}/activities`,
    reFetchSubTeamActivities
  );

  useEffect(() => {}, [subTeamActivities]);

  const handleSubTeamActivities = async () => {
    try {
      await updateData("notifications");
      setReFetchSubTeamActivities((prev) => !prev);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    socket.on("subTeamActivities", (notification) =>
      setReFetchSubTeamActivities(notification)
    );

    return () => socket.off("subTeamActivities");
  }, []);

  if (subTeamActivities?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (subTeamActivities?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return !showSubTeamActivitiesPopUp ? (
    <div
      className="relative cursor-pointer"
      onClick={() => setShowSubTeamActivitiesPopUp(true)}
    >
      <span>Activities</span>
      {subTeamActivities?.data?.filter((n) => !n.isRead).length > 0 && (
        <div className="absolute bottom-3 right-[-10px] rounded-full px-2 py-1 text-xs font-semibold bg-blue-500 text-white flex items-center justify-center">
          {subTeamActivities.data.filter((n) => !n.isRead).length}
        </div>
      )}
    </div>
  ) : (
    <ActivitiesPopUp
      activities={subTeamActivities?.data}
      handleActivities={handleSubTeamActivities}
      setShowActivitiesPopUp={setShowSubTeamActivitiesPopUp}
    />
  );
}
