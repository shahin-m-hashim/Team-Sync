/* eslint-disable react/prop-types */
import { useContext } from "react";
import tasks from "../../assets/images/tasks.png";
import teams from "../../assets/images/teams.png";
import { UserContext } from "@/providers/UserProvider";
import logoutIcon from "../../assets/images/logout.png";
import projects from "../../assets/images/projects.png";
import subTeams from "../../assets/images/subTeams.png";
import defaultDp from "../../assets/images/defaultDp.png";
import teamSyncLogo from "../../assets/images/Team Sync Logo.png";
import techSupport from "../../assets/images/Technical Support.png";

const MenuItem = ({ icon, text }) => (
  <div className="inline-flex items-center justify-around gap-5">
    <img src={icon} alt={text} className="w-10 h-8" />
    <span>{text}</span>
  </div>
);

export default function UserSideBar() {
  const { user, setUserStatus } = useContext(UserContext);

  if (user?.username.length > 13)
    user.username = user?.username.substring(0, 13) + "...";

  if (user?.tag.length > 15) user.tag = user?.tag.substring(0, 15) + "...";

  return (
    <div className="bg-[#141414] z-10 w-[16vw] border-2 rounded-md border-white border-r-0 fixed left-0 top-0 bottom-0  flex flex-col gap-20 justify-around items-start p-3 text-white">
      <img src={teamSyncLogo} alt="teamSyncLogo" className="w-16 mt-5 h-14" />
      <div
        id="sidebarMenu"
        className="inline-flex flex-col items-start gap-5 justify-evenly"
      >
        <MenuItem icon={projects} text="Projects" />
        <MenuItem icon={teams} text="Teams" />
        <MenuItem icon={subTeams} text="Sub Teams" />
        <MenuItem icon={tasks} text="Tasks" />
      </div>
      <div
        id="forUser"
        className="inline-flex flex-col items-start gap-5 justify-evenly"
      >
        <MenuItem icon={techSupport} text="Support" />
        <button onClick={() => setUserStatus("LOGGED_OUT")}>
          <MenuItem icon={logoutIcon} text="Logout" />
        </button>
      </div>
      <div className="bg-[#202020] flex justify-around items-center w-full py-2 rounded-xl">
        <img
          src={user?.profilePic || defaultDp}
          className="rounded-[50%] object-cover object-center size-14"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {user?.username || "loading..."}
          </span>
          <span className="text-[#BDBDBD] text-xs">
            {user?.tag || "random user"}
          </span>
        </div>
        {user?.status === "active" && (
          <div className="bg-green-400 size-3 rounded-[50%]" />
        )}
      </div>
    </div>
  );
}
