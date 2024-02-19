import { useContext, useEffect } from "react";
import { authContext } from "@/contexts/authContext";

const useKeepUserAuthenticated = () => {
  const { user, status, authorize, logout } = useContext(authContext);

  console.log("User Status", status);

  useEffect(() => {
    authorize();
    const interval = setInterval(authorize, 1 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { user, status, logout };
};

export default useKeepUserAuthenticated;
