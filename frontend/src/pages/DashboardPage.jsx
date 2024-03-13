import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import StatusCard from "@/components/cards/StatusCard";
import AddComponent from "@/components/AddComponent";
import { useState } from "react";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";

export default function DashboardPage() {
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [listOnlyAdminProjects, setListOnlyAdminProjects] = useState(false);
  return (
    <div className="grid h-screen grid-cols-[250px,1fr] relative ">
      <SideBar />
      <div className="grid grid-rows-[50px,1fr,2fr]">
        <Navbar />
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
          <ListHeader
            setShowAddPopUp={setShowAddPopUp}
            setListOnlyAdminProjects={setListOnlyAdminProjects}
          />
          <ListSubHeader />
          <ListBody listOnlyAdminProjects={listOnlyAdminProjects} />
        </div>
      </div>
      {showAddPopUp && (
        <AddComponent name="Project" setShowAddPopUp={setShowAddPopUp} />
      )}
    </div>
  );
}
