/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */

import useFetch from "@/hooks/useFetch";
import { ErrorContext } from "./ErrorProvider";
import { createContext, useContext, useState } from "react";

export const InvitationsContext = createContext();

const InvitationsProvider = ({ children }) => {
  const { setError } = useContext(ErrorContext);
  const [reFetchInvitations, setReFetchInvitations] = useState(false);

  const invitations = useFetch("invitations", reFetchInvitations);

  if (invitations?.error === "unauthorized") {
    setError("unauthorized");
    return null;
  }

  if (invitations?.error === "serverError") {
    setError("serverError");
    return null;
  }

  return (
    <InvitationsContext.Provider
      value={{
        setReFetchInvitations,
        invitations: invitations?.data,
      }}
    >
      {children}
    </InvitationsContext.Provider>
  );
};

export default InvitationsProvider;
