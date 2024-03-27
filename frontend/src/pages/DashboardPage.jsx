import { getLocalSecureItem } from "@/lib/utils";
import Navbar from "@/components/dashboard/Navbar";
import SideBar from "@/components/dashboard/SideBar";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/Loading";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const user = getLocalSecureItem("user", "medium");

  useEffect(() => {
    if (user?.status === "LOGGED_IN") {
      setRender(true);
    } else navigate("/", { replace: true });
  }, [navigate, user?.status]);

  return render ? (
    <>
      <SideBar />
      <div className="flex pl-[235px] flex-col h-screen">
        <Navbar />
        {children}
      </div>
    </>
  ) : (
    <LoadingComponent />
  );
}
