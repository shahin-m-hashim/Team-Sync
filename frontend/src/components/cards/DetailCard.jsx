/* eslint-disable react/prop-types */

import Loading from "../Loading";
import GroupedUsers from "../GroupedUsers";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import invite from "../../assets/images/invite.png";
import report from "../../assets/images/report.png";
import { cn, getLocalSecureItem } from "@/lib/utils";
import groupVoiceCall from "../../assets/images/Call.png";
import groupChat from "../../assets/images/Chat Messages.png";
import settings from "../../assets/images/settings colored.png";
import groupVideoCall from "../../assets/images/Video Call.png";
import ProjectActivities from "../activities/ProjectActivities";
import TeamActivities from "../activities/TeamActivities";
import SubTeamActivities from "../activities/SubTeamActivities";

export default function DetailCard({
  renderList,
  parentDetails,
  setShowAddCollaboratorForm,
}) {
  const [settingsPath, setSettingsPath] = useState("/");
  const { userId, projectId, teamId, subTeamId } = useParams();
  const [showProjectSettings, setShowProjectSettings] = useState(true);

  const [showEntityActivitiesPopUp, setShowEntityActivitiesPopUp] =
    useState(false);

  useEffect(() => {
    switch (renderList) {
      case "Team": {
        const projects = getLocalSecureItem("projects", "medium");
        projects?.forEach((project) => {
          if (project.project === projectId && project.role !== "Leader")
            setShowProjectSettings(false);
        });

        setSettingsPath(`/user/${userId}/projects/${projectId}/settings`);
        break;
      }
      case "Sub Team": {
        const teams = getLocalSecureItem("teams", "medium");
        teams?.forEach((team) => {
          if (team.team === teamId && team.role !== "Leader")
            setShowProjectSettings(false);
        });
        setSettingsPath(
          `/user/${userId}/projects/${projectId}/teams/${teamId}/settings`
        );
        break;
      }
      case "Task": {
        const teams = getLocalSecureItem("teams", "medium");
        teams?.forEach((team) => {
          if (team.team === teamId && team.role !== "Leader")
            setShowProjectSettings(false);
        });
        setSettingsPath(
          `/user/${userId}/projects/${projectId}/teams/${teamId}/subTeams/${subTeamId}/settings`
        );
        break;
      }
      default:
        break;
    }

    return () => setShowProjectSettings(true);
  }, [projectId, renderList, subTeamId, teamId, userId]);

  return parentDetails?.data ? (
    <div className="grid grid-cols-2 bg-[#141414] p-3 px-10 ">
      <div className="flex flex-col justify-around">
        <span className="ml-[-3px] text-4xl font-semibold">
          {parentDetails?.data.name}
        </span>
        <div className="flex items-center w-10 gap-3">
          <span>
            Leader&nbsp;:&nbsp;{parentDetails?.data?.leader?.username}
          </span>
          <img
            src={parentDetails?.data?.leader?.profilePic}
            className="object-cover object-center w-full rounded-full"
          />
        </div>
        <div className="flex items-center w-10 gap-3">
          <span>
            Guide&nbsp;:&nbsp;
            {parentDetails?.data?.guide?.username || <span>NA</span>}
          </span>
          <img
            src={parentDetails?.data?.guide?.profilePic}
            className="object-cover object-center rounded-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            className={cn(
              showProjectSettings ? "cursor-pointer" : "cursor-not-allowed",
              "flex items-center gap-1 h-7 p-3 text-xs  border-[1px] border-white rounded-xl"
            )}
            disabled={!showProjectSettings}
            onClick={() => setShowAddCollaboratorForm(true)}
          >
            <img src={invite} />
            <span>{renderList === "Project" ? "Invite" : "Add"}</span>
          </button>
          {showProjectSettings ? (
            <Link to={settingsPath}>
              <img src={settings} />
            </Link>
          ) : (
            <img src={settings} className="cursor-not-allowed" />
          )}
          <button>
            <img src={report} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-around">
        <GroupedUsers users={parentDetails?.data.members || []} />
        <div className="flex justify-around w-full gap-3">
          <span className="text-[#9685FF] text-lg">
            {parentDetails?.data?.NOM} member
            {parentDetails?.data?.NOM > 1 && "s"}
          </span>
          {renderList === "Team" && (
            <ProjectActivities
              showProjectActivitiesPopUp={showEntityActivitiesPopUp}
              setShowProjectActivitiesPopUp={setShowEntityActivitiesPopUp}
            />
          )}
          {renderList === "Sub Team" && (
            <TeamActivities
              showTeamActivitiesPopUp={showEntityActivitiesPopUp}
              setShowTeamActivitiesPopUp={setShowEntityActivitiesPopUp}
            />
          )}
          {renderList === "Task" && (
            <SubTeamActivities
              showSubTeamActivitiesPopUp={showEntityActivitiesPopUp}
              setShowSubTeamActivitiesPopUp={setShowEntityActivitiesPopUp}
            />
          )}
        </div>

        <div className="flex items-center gap-10 ml-[-10px]">
          <img src={groupChat} />
          <img src={groupVoiceCall} />
          <img src={groupVideoCall} />
        </div>
      </div>
    </div>
  ) : (
    <div className="relative bg-[#141414]">
      <Loading />
    </div>
  );
}
