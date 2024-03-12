import SideBar from "@/components/dashboard/SideBar";
import DashboardNav from "@/components/dashboard/DashboardNav";
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import BodyHeader from "@/components/dashboard/BodyHeader";
import ProjectHeader from "@/components/dashboard/ProjectHeader";
import ProjectBody from "@/components/dashboard/ProjectBody";
import StatusCard from "@/components/cards/StatusCard";
import AddComponent from "@/components/AddComponent";
import { useState } from "react";

export default function DashboardPage() {
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  console.log(showAddPopUp);
  return (
    <div className="grid h-screen grid-cols-[250px,1fr] relative ">
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
          <BodyHeader setShowAddPopUp={setShowAddPopUp} />
          <ProjectHeader />
          <ProjectBody />
        </div>
      </div>
      {showAddPopUp && (
        <AddComponent name="Project" setShowAddPopUp={setShowAddPopUp} />
      )}
    </div>
  );
}
