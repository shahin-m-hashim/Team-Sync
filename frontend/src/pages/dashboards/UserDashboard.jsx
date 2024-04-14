import ActivityCard from "@/components/cards/ActivityCard";
import MessageCard from "@/components/cards/MessageCard";
import StatusCard from "@/components/cards/StatusCard";
import Navbar from "@/components/navbars/UserNavbar";
import SideBar from "@/components/sidebars/UserSideBar";

// eslint-disable-next-line react/prop-types
export default function UserDashboard({ children }) {
  return (
    <>
      <SideBar />
      <div className="flex relative flex-col h-full pl-[16vw]">
        <Navbar settings={"p-3 border-white border-2 rounded-md"} />
        <div className="grid grid-cols-[1fr,1fr,1.3fr] min-h-[17rem] border-white border-2 border-t-0 text-white">
          <ActivityCard />
          <MessageCard />
          <StatusCard list={[]} renderList="Project" />
        </div>
        {children}
      </div>
    </>
  );
}
