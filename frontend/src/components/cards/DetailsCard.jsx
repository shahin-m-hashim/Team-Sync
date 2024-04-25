/* eslint-disable react/prop-types */

import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import GroupedUsers from "../GroupedUsers";
import invite from "../../assets/images/invite.png";
import report from "../../assets/images/report.png";
import defaultDp from "../../assets/images/defaultDp.png";
import groupVoiceCall from "../../assets/images/Call.png";
import TeamActivities from "../activities/TeamActivities";
import groupChat from "../../assets/images/Chat Messages.png";
import settings from "../../assets/images/settings colored.png";
import groupVideoCall from "../../assets/images/Video Call.png";
import ProjectActivities from "../activities/ProjectActivities";

export default function DetailsCard({
  entity,
  details,
  settingsPath,
  showActivitiesPopUp,
  disableSettingsLink,
  setShowActivitiesPopUp,
  setShowAddCollaboratorForm,
}) {
  const leader = details?.collaborators.find(
    (collaborator) => collaborator.role === "Leader"
  );

  const guide = details?.collaborators.find(
    (collaborator) => collaborator.role === "Guide"
  );

  return (
    <div className="grid grid-cols-2 bg-[#141414] p-3 px-10 ">
      <div className="flex flex-col justify-around">
        <span className="ml-[-3px] text-4xl font-semibold">
          {details?.name}
        </span>
        <div className="flex items-center w-10 gap-3">
          <span>Leader&nbsp;:&nbsp;{leader?.username}</span>
          <img
            src={leader?.profilePic}
            className="object-cover object-center w-full rounded-full"
          />
        </div>
        <div className="flex items-center w-10 gap-3">
          <span>
            Guide&nbsp;:&nbsp;
            {guide?.username || <span>NA</span>}
          </span>
          <img
            src={guide?.profilePic || defaultDp}
            className="object-cover object-center rounded-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            className={cn(
              disableSettingsLink ? "cursor-not-allowed" : "cursor-pointer",
              "flex items-center gap-1 h-7 p-3 text-xs  border-[1px] border-white rounded-xl"
            )}
            disabled={disableSettingsLink}
            onClick={() => setShowAddCollaboratorForm(true)}
          >
            <img src={invite} />
            <span>{entity === "Project" ? "Invite" : "Add"}</span>
          </button>
          {disableSettingsLink ? (
            <img src={settings} className="cursor-not-allowed" />
          ) : (
            <Link to={settingsPath}>
              <img src={settings} />
            </Link>
          )}
          <button>
            <img src={report} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-around">
        <GroupedUsers users={details?.collaborators || []} />
        <div className="flex justify-around w-full gap-3">
          <span className="text-[#9685FF] text-lg">
            {details?.NOC}
            {details?.NOC > 1 ? " Collaborators" : " Collaborator"}
          </span>
          {entity === "project" && (
            <ProjectActivities
              showProjectActivitiesPopUp={showActivitiesPopUp}
              setShowProjectActivitiesPopUp={setShowActivitiesPopUp}
            />
          )}
          {entity === "team" && (
            <TeamActivities
              showTeamActivitiesPopUp={showActivitiesPopUp}
              setShowTeamActivitiesPopUp={setShowActivitiesPopUp}
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
  );
}
