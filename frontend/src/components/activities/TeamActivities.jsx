/* eslint-disable react/prop-types */

import { socket } from "@/App";
import { toast } from "react-toastify";
import useFetch from "@/hooks/useFetch";
import { updateData } from "@/services/db";
import { useParams } from "react-router-dom";
import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import ActivitiesPopUp from "../popups/ActivitiesPopUp";

export default function TeamActivities({
  showTeamActivitiesPopUp,
  setShowTeamActivitiesPopUp,
}) {
  const { projectId, teamId } = useParams();
  const { setError } = useContext(UserContext);
  const [reFetchTeamActivities, setReFetchTeamActivities] = useState(false);

  const teamActivities = useFetch(
    `projects/${projectId}/teams/${teamId}/activities`,
    reFetchTeamActivities
  );

  useEffect(() => {}, [teamActivities]);

  const handleTeamActivities = async () => {
    try {
      await updateData("notifications");
      setReFetchTeamActivities((prev) => !prev);
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    socket.on("teamActivities", (notification) =>
      setReFetchTeamActivities(notification)
    );

    return () => socket.off("teamActivities");
  }, []);

  if (teamActivities?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (teamActivities?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return !showTeamActivitiesPopUp ? (
    <div
      className="relative cursor-pointer"
      onClick={() => setShowTeamActivitiesPopUp(true)}
    >
      <span>Activities</span>
      {teamActivities?.data?.filter((n) => !n.isRead).length > 0 && (
        <div className="absolute bottom-3 right-[-10px] rounded-full px-2 py-1 text-xs font-semibold bg-blue-500 text-white flex items-center justify-center">
          {teamActivities.data.filter((n) => !n.isRead).length}
        </div>
      )}
    </div>
  ) : (
    <ActivitiesPopUp
      activities={teamActivities?.data}
      handleActivities={handleTeamActivities}
      setShowActivitiesPopUp={setShowTeamActivitiesPopUp}
    />
  );
}
