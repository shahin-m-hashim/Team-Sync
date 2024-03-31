/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Loading from "@/components/Loading";
import ReLoginPage from "@/pages/ReLoginPage";
import { createContext, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [reFetch, setReFetch] = useState(false);
  const user = getLocalSecureItem("user", "low");
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const updateData = async (url, newData) => {
    try {
      const response = await axios.patch(
        `${baseURL}/user/${user.id}/${url}`,
        newData,
        { withCredentials: true }
      );
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 401) {
        await reAuthorize(url, newData);
      } else throw error;
    }
  };

  const reAuthorize = async (url, newData) => {
    await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
    await updateData(url, newData);
  };

  const primaryDetails = useFetch("primaryDetails", reFetch);
  const secondaryDetails = useFetch("secondaryDetails", reFetch);

  const primaryData = primaryDetails.apiData;
  const secondaryData = secondaryDetails.apiData;

  if (
    primaryDetails.error === "Unauthorized" ||
    secondaryDetails.error === "Unauthorized"
  ) {
    return <ReLoginPage />;
  }

  if (primaryDetails.isLoading && secondaryDetails.isLoading) {
    return (
      <div className="h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <UserContext.Provider
      value={{
        primaryData,
        secondaryData,
        updateData,
        setReFetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
