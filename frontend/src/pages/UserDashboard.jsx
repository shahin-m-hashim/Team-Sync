import UserNavbar from "@/components/navbars/UserNavbar";
import SideBar from "@/components/sidebars/UserSideBar";

// eslint-disable-next-line react/prop-types
export default function UserDashboard({ children }) {
  return (
    <>
      <SideBar />
      <div className="flex relative flex-col h-full pl-[16vw]">
        <UserNavbar settings={"p-2 border-white border-2 rounded-md"} />
        {children}
      </div>
    </>
  );
}
