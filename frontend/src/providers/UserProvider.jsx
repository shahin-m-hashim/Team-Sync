/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import { socket } from "@/App";
import useFetch from "@/hooks/useFetch";
import { logout } from "@/services/auth";
import Loading from "@/components/Loading";
import ReLoginPage from "@/pages/ReLoginPage";
import { createContext, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";
import LoggedOutPage from "@/pages/LoggedOutPage";
import ServerErrorPage from "@/pages/ServerErrorPage";
import { deleteData, updateData } from "@/services/db";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { id, status } = getLocalSecureItem("user", "low");
  status === "LOGGED_IN" && socket.emit("loggedIn", id);

  const [error, setError] = useState();
  const [userStatus, setUserStatus] = useState();
  const [reFetchUser, setReFetchUser] = useState(false);
  const [reFetchProjects, setReFetchProjects] = useState(false);

  const user = useFetch("user", reFetchUser);

  const updateUserDetails = async (url, newData) =>
    await updateData(url, newData);

  const deleteUserData = async (url) => await deleteData(url);

  if (userStatus === "LOGGED_OUT") {
    try {
      logout();
      return <LoggedOutPage />;
    } catch (e) {
      if (e.response.status === 500) {
        return <ServerErrorPage />;
      }
    }
  } else if (user?.error === "unauthorized" || error === "unauthorized") {
    localStorage.clear();
    return <ReLoginPage />;
  } else if (user?.error === "serverError" || error === "serverError") {
    return <ServerErrorPage />;
  } else {
    return user?.isLoading ? (
      <div className="h-screen">
        <Loading />
      </div>
    ) : (
      <UserContext.Provider
        value={{
          setError,
          setUserStatus,
          deleteUserData,
          setReFetchUser,
          reFetchProjects,
          user: user?.data,
          updateUserDetails,
          setReFetchProjects,
        }}
      >
        {children}
      </UserContext.Provider>
    );
  }
};

export default UserProvider;
