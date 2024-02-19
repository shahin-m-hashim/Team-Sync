import ReLoginPage from "./ReLoginPage";
import useKeepUserAuthenticated from "@/hooks/useKeepUserAuthenticated";
import LoadingComponent from "../components/LoadingComponent";
import ServerErrorPage from "./ServerErrorPage";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const { user, status, logout } = useKeepUserAuthenticated();
  const navigate = useNavigate();

  if (status === "AUTHENTICATED") {
    return (
      <>
        <h1>Welcome to Your Dashboard {user.username}</h1>;
        <button onClick={logout}>LogOut</button>
      </>
    );
  } else if (status === "UNAUTHENTICATED") {
    return <ReLoginPage />;
  } else if (status === "LOGGED_OUT") {
    navigate("/", { replace: true });
  } else if (status === "LOADING") {
    return <LoadingComponent />;
  } else {
    return <ServerErrorPage />;
  }
}
