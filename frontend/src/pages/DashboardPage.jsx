import LoadingComponent from "../components/LoadingComponent";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { authContext } from "@/contexts/authContext";

export default function DashboardPage() {
  const { user, authState, authorize, logout } = useContext(authContext);
  const localAuthState = localStorage.getItem("authState");
  const navigate = useNavigate();

  useEffect(() => {
    if (localAuthState === "LOGGED_IN") {
      authorize();
      const interval = setInterval(authorize, 10 * 1000);
      return () => clearInterval(interval);
    } else if (localAuthState === "UNAUTHORIZED") {
      navigate("/reLogin", { replace: true });
    }
  }, [authState]);

  if (authState === "AUTHORIZED") {
    return (
      <>
        <h1>Welcome to Your Dashboard {user.username}</h1>;
        <button onClick={logout}>LogOut</button>
      </>
    );
  } else if (authState === "UNAUTHORIZED") {
    navigate("/reLogin", { replace: true });
    return null;
  } else if (authState === "LOGGED_OUT") {
    navigate("/", { replace: true });
    return null;
  } else if (authState === "LOADING" || authState === "LOGGED_IN") {
    return <LoadingComponent />;
  } else {
    navigate("/error", { replace: true });
    return null;
  }
}
