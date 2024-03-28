/* eslint-disable react/prop-types */
import useFetch from "@/hooks/useFetch";
import { createContext, useEffect } from "react";

export default function UserProvider({ children }) {
  const userContext = createContext();
  const res = useFetch("/profile");

  useEffect(() => {
    console.log(res);
  });

  return <userContext.Provider>{children}</userContext.Provider>;
}
