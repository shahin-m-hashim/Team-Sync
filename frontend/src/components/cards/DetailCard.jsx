/* eslint-disable react/prop-types */
import Loading from "../Loading";
import useFetch from "@/hooks/useFetch";
import { Link } from "react-router-dom";
import GroupedUsers from "../GroupedUsers";
import { getLocalSecureItem } from "@/lib/utils";
import invite from "../../assets/images/invite.png";
import report from "../../assets/images/report.png";
import groupVoiceCall from "../../assets/images/Call.png";
import groupChat from "../../assets/images/Chat Messages.png";
import settings from "../../assets/images/settings colored.png";
import groupVideoCall from "../../assets/images/Video Call.png";

export default function DetailCard({
  projectId,
  renderList,
  setShowSendProjectInviteForm,
}) {
  const user = getLocalSecureItem("user", "low");
  const projectDetails = useFetch(`projects/${projectId}`);

  return projectDetails?.data ? (
    <div className="grid grid-cols-2 bg-[#141414] p-3 px-10 ">
      <div className="flex flex-col justify-around">
        <span className="ml-[-3px] text-4xl font-semibold">
          {projectDetails?.data.name}
        </span>
        <div className="flex items-center w-10 gap-3">
          <span>
            Leader&nbsp;:&nbsp;{projectDetails?.data?.leader?.username}
          </span>
          <img
            src={projectDetails?.data?.leader?.profilePic}
            className="object-cover object-center w-full rounded-full"
          />
        </div>
        <div className="flex items-center w-10 gap-3">
          <span>Guide&nbsp;:&nbsp;{projectDetails?.data?.guide?.username}</span>
          <img
            src={projectDetails?.data?.guide?.profilePic}
            className="object-cover object-center rounded-full"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSendProjectInviteForm(true)}
            className="flex items-center gap-1 h-7 p-3 text-xs  border-[1px] border-white rounded-xl"
          >
            <img src={invite} alt="invite" />
            <span>{renderList === "Project" ? "Invite" : "Add"}</span>
          </button>
          <Link to={`/user/${user.id}/projects/${projectId}/settings`}>
            <img src={settings} />
          </Link>
          <button>
            <img src={report} />
          </button>
        </div>
      </div>
      <div className="flex flex-col items-start justify-around">
        <GroupedUsers users={projectDetails?.data.members || []} />
        <span className="text-[#9685FF] text-lg">
          {projectDetails?.data?.NOM} member
          {projectDetails?.data?.NOM > 1 && "s"}
        </span>
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
