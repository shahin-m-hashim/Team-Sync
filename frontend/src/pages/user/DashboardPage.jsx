import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  return (
    <>
      <SideBar />
      <div className="flex pl-[235px] flex-col h-screen">
        <Navbar />
        {children}
      </div>
    </>
  );
}
