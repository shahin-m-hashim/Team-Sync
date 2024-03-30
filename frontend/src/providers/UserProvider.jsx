/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import Loading from "@/components/Loading";
import useFetch from "@/hooks/useFetch";
import ReLoginPage from "@/pages/ReLoginPage";
import { createContext } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const primaryDetails = useFetch("primaryDetails");
  const secondaryDetails = useFetch("secondaryDetails");

  console.log(
    "primaryDetails: ",
    primaryDetails,
    "\nsecondaryDetails: ",
    secondaryDetails
  );

  const primaryData = primaryDetails.apiData;
  const secondaryData = secondaryDetails.apiData;

  if (
    primaryDetails.error === "Unauthorized" ||
    secondaryDetails.error === "Unauthorized"
  ) {
    return <ReLoginPage />;
  }

  if (primaryDetails.isLoading && secondaryDetails.isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ primaryData, secondaryData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
