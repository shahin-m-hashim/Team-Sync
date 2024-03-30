import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import UserProvider from "@/providers/UserProvider";
import LoggedOutPage from "./LoggedOutPage";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  const [showLoggedOut, setShowLoggedOut] = useState(false);

  if (showLoggedOut) {
    return <LoggedOutPage />;
  }

  return (
    <UserProvider>
      <SideBar setShowLoggedOut={setShowLoggedOut} />
      <div className="flex pl-[235px] flex-col h-screen">
        <Navbar />
        {children}
      </div>
    </UserProvider>
  );
}
