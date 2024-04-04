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

export default function SideBar() {
  const { userData, setUserStatus } = useContext(UserContext);

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
      <div
        id="userCard"
        className="bg-[#202020] flex gap-6 items-center w-full h-max p-3 rounded-xl"
      >
        <img
          src={userData?.profilePic || defaultDp}
          alt="userDP"
          className="rounded-[50%] object-cover object-center size-10"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {userData?.username || "loading..."}
          </span>
          <span className="text-[#BDBDBD] text-xs">
            {userData?.tag || "random user"}
          </span>
        </div>
      </div>
    </div>
  );
}
