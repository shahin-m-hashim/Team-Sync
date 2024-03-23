import SideBar from "@/components/dashboard/SideBar";
import Navbar from "@/components/dashboard/Navbar";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { authContext } from "@/contexts/authContext";
import ReLoginPage from "./auth/ReLoginPage";
import HomePage from "./HomePage";
import LoadingComponent from "@/components/Loading";

// eslint-disable-next-line react/prop-types
export default function DashboardPage({ children }) {
  const navigate = useNavigate();
  const localAuthState = localStorage.getItem("authState");
  const { authState, authorize } = useContext(authContext);

  useEffect(() => {
    if (localAuthState === "LOGGED_IN" || localAuthState === "AUTHORIZED") {
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
