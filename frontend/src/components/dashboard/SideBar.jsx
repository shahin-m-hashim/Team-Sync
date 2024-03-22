/* eslint-disable react/prop-types */
import ajmalDp from "../../assets/images/ajmalDp.png";
import teamSyncLogo from "../../assets/images/Team Sync Logo.png";
import projects from "../../assets/images/projects.png";
import teams from "../../assets/images/teams.png";
import subTeams from "../../assets/images/subTeams.png";
import tasks from "../../assets/images/tasks.png";
import techSupport from "../../assets/images/Technical Support.png";
import logoutIcon from "../../assets/images/logout.png";
import { useContext } from "react";
import { authContext } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

const MenuItem = ({ icon, text }) => (
  <div className="inline-flex items-center justify-around gap-3">
    <img src={icon} alt={text} className="w-10 h-8" />
    <span>{text}</span>
  </div>
);

export default function SideBar() {
  const { logout } = useContext(authContext);

  const navigate = useNavigate();

  return (
    <div
      id="sidebar"
      className="bg-[#141414] z-50 w-[232px] fixed left-0 top-0 bottom-0 m-1 mr-0 flex flex-col gap-20 justify-around items-start p-3 rounded-lg text-white"
    >
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
        <button
          onClick={() => {
            navigate("/loggedOut");
            logout();
          }}
        >
          <MenuItem icon={logoutIcon} text="Logout" />
        </button>
      </div>
      <div
        id="userCard"
        className="bg-[#202020] flex gap-6 items-center w-full h-max p-3 rounded-xl"
      >
        <img src={ajmalDp} alt="userDP" className="size-10" />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Ajmal Sajeev</span>
          <span className="text-[#BDBDBD] text-xs">Front-End Developer</span>
        </div>
      </div>
    </div>
  );
}
