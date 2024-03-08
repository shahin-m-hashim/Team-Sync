// import { useContext } from "react";
// import { authContext } from "@/contexts/authContext";

import SideBar from "@/components/dashboard/SideBar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import BodyHeader from "@/components/dashboard/BodyHeader";
import ProjectHeader from "@/components/dashboard/ProjectHeader";
import ProjectBody from "@/components/dashboard/ProjectBody";
import StatusCard from "@/components/cards/StatusCard";

export default function DashboardPage() {
  // const { user, logout } = useContext(authContext);
  // const username = user ? user.username : "unknown";
  //       <h1>Welcome to Your Dashboard {username}</h1>
  //     <button onClick={logout}>LogOut</button>
  return (
    // grid-cols-[250px,1fr]
    <div className="grid h-screen grid-cols-[250px,1fr] ">
      <SideBar />
      <div className="grid grid-rows-[50px,1fr,2fr]">
        <DashboardNav />
        <div
          id="dashHeader"
          className="grid grid-cols-[1.3fr,1fr,270px] text-white"
        >
          <StatusCard />
          <ActivityCard />
          <MessageCard />
        </div>
        <div
          id="dashBody"
          className="bg-[#141414] m-1 mt-0 rounded-lg text-white"
        >
          <BodyHeader />
          <ProjectHeader />
          <ProjectBody />
        </div>
      </div>
    </div>
  );
}
