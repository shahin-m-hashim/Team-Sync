/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import useFetch from "@/hooks/useFetch";
import { logout } from "@/services/auth";
import Loading from "@/components/Loading";
import { ErrorContext } from "./ErrorProvider";
import LoggedOutPage from "@/pages/LoggedOutPage";
import { deleteData, updateData } from "@/services/db";
import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const { setError } = useContext(ErrorContext);
  const [userStatus, setUserStatus] = useState();
  const [reFetchUser, setReFetchUser] = useState(false);

  let res;

  res = useFetch("user", reFetchUser);
  const userData = res?.apiData;

  res = useFetch("invitations", reFetchUser);
  const invitations = res?.apiData;

  console.log(invitations);

  const updateUserDetails = async (url, newData) =>
    await updateData(url, newData);

  const deleteUserData = async (url) => await deleteData(url);

  if (userStatus === "LOGGED_OUT") {
    try {
      logout();
      return <LoggedOutPage />;
    } catch (e) {
      if (e.response.status === 500) {
        setError("serverError");
      }
    }
  }

  if (res?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (res?.error === "serverError") {
    setError("serverError");
    return null;
  }

  if (res?.isLoading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        userData,
        invitations,
        setUserStatus,
        deleteUserData,
        setReFetchUser,
        updateUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
