import Navbar from "@/components/navbars/UserNavbar";
import SideBar from "@/components/sidebars/UserSideBar";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  return (
    <>
      <SideBar />
      <div className="flex relative flex-col h-full pl-[16vw]">
        <Navbar settings={"p-3 border-white border-2 rounded-md"} />
        {children}
      </div>
    </>
  );
}
