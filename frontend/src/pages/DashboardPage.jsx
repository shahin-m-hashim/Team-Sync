import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import ReLoginPage from "./auth/ReLoginPage";
import LoadingComponent from "@/components/Loading";
import { authContext } from "@/providers/AuthProvider";
import HomePage from "./HomePage";
import { getLocalSecureItem } from "@/lib/utils";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  const navigate = useNavigate();
  const localAuth = getLocalSecureItem("auth", "low");
  const { authState, authorize } = useContext(authContext);

  useEffect(() => {
    if (localAuth === "LOGGED_IN" || localAuth === "AUTHORIZED") {
      authorize();
      const interval = setInterval(authorize, 15 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      navigate("/reLogin", { replace: true });
    }
  }, [authState]);

  if (authState === "AUTHORIZED") {
    return (
      <>
        <SideBar />
        <div className="flex pl-[235px] flex-col h-screen">
          <Navbar />
          {children}
        </div>
      </>
    );
  } else if (authState === "UNAUTHORIZED") {
    return <ReLoginPage />;
  } else if (authState === "LOGGED_OUT") {
    return <HomePage />;
  } else {
    return <LoadingComponent />;
  }
}
