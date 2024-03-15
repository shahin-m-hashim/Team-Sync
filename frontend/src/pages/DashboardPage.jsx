import { useState } from "react";
import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";
import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import StatusCard from "@/components/cards/StatusCard";
import AddComponent from "@/components/AddComponent";
import ListHeader from "@/components/list/ListHeader";
import ListBody from "@/components/list/ListBody";
import ListSubHeader from "@/components/list/ListSubHeader";
import ProjectProvider from "@/contexts/projectContext";
import TeamProvider from "@/contexts/teamContext";

export default function DashboardPage() {
  const [showAddPopUp, setShowAddPopUp] = useState(false);
  const [displayList, setDisplayList] = useState("Project");

  return (
    <>
      <SideBar />
      <Navbar />
      <div className="grid max-h-[703px] m-0 ml-[235px] grid-rows-[1fr,2fr]">
        <div
          id="dashHeader"
          className="grid mt-11 grid-cols-[1.3fr,1fr,270px] text-white"
        >
          <StatusCard />
          <ActivityCard />
          <MessageCard />
        </div>
        <ProjectProvider>
          <TeamProvider>
            <div
              id="dashBody"
              className="bg-[#141414] m-1 mt-0 rounded-lg text-white"
            >
              <ListHeader
                setShowAddPopUp={setShowAddPopUp}
                setDisplayList={setDisplayList}
                displayList={displayList}
              />
              <ListSubHeader />
              <ListBody displayList={displayList} />
            </div>
          </TeamProvider>
        </ProjectProvider>
      </div>
      {showAddPopUp && (
        <AddComponent
          displayList={displayList}
          setShowAddPopUp={setShowAddPopUp}
        />
      )}
    </>
  );
}
