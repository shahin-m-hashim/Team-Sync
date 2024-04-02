/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import ReLoginPage from "@/pages/ReLoginPage";
import { createContext, useState } from "react";
import ServerErrorPage from "@/pages/ServerErrorPage";
import { deleteData, updateData } from "@/services/db";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [reFetchUser, setReFetchUser] = useState(false);
  const res = useFetch("userDetails", reFetchUser);
  const userData = res?.apiData;

  const updateUserDetails = async (url, newData) =>
    await updateData(url, newData);

  const deleteUserData = async (url) => {
    await deleteData(url);
  };

  if (res?.error === "unauthorized") {
    localStorage.clear();
    return <ReLoginPage />;
  }

  if (res?.error === "serverError") {
    return <ServerErrorPage />;
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
        updateUserDetails,
        deleteUserData,
        setReFetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
