import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";

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
