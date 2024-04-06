import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import LoggedOutPage from "./LoggedOutPage";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  const [showLoggedOut, setShowLoggedOut] = useState(false);

  if (showLoggedOut) {
    return <LoggedOutPage />;
  }

  return (
    <>
      <SideBar setShowLoggedOut={setShowLoggedOut} />
      <div className="flex relative flex-col h-full pl-[16vw]">
        <Navbar setShowLoggedOut={setShowLoggedOut} />
        {children}
      </div>
    </>
  );
}
