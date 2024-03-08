/* eslint-disable react/prop-types */
import LoadingComponent from "../Loading";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { authContext } from "@/contexts/authContext";
import ReLoginPage from "@/pages/auth/ReLoginPage";
import HomePage from "@/pages/HomePage";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const localAuthState = localStorage.getItem("authState");
  const { authState, authorize } = useContext(authContext);

  useEffect(() => {
    if (localAuthState === "LOGGED_IN" || localAuthState === "AUTHORIZED") {
      authorize();
      const interval = setInterval(authorize, 15 * 60 * 1000);
      return () => clearInterval(interval);
    } else if (localAuthState === "LOGGED_OUT") {
      navigate("/", { replace: true });
    } else {
      navigate("/reLogin", { replace: true });
    }
  }, [authState]);

  if (authState === "AUTHORIZED") {
    return <>{children}</>;
  } else if (authState === "UNAUTHORIZED") {
    return <ReLoginPage />;
  } else if (authState === "LOGGED_OUT") {
    return <HomePage />;
  } else {
    return <LoadingComponent />;
  }
};

export default AuthWrapper;
