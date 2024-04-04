/* eslint-disable react/prop-types */
import ReLoginPage from "@/pages/ReLoginPage";
import { createContext, useState } from "react";
import ServerErrorPage from "@/pages/ServerErrorPage";

export const ErrorContext = createContext();

export default function ErrorProvider({ children }) {
  const [error, setError] = useState();

  if (error === "unauthorized") {
    localStorage.clear();
    return <ReLoginPage />;
  }

  if (error === "serverError") {
    return <ServerErrorPage />;
  }

  return (
    <ErrorContext.Provider value={{ setError }}>
      {children}
    </ErrorContext.Provider>
  );
}
