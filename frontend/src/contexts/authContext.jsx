/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import axios from "axios";
import { createContext, useState } from "react";
const base_url = import.meta.env.VITE_APP_BASE_URL;
export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("LOADING");

  const authorize = async () => {
    console.log("Authorizing User...");
    try {
      const { data } = await axios.get(`${base_url}api/primaryUser`, {
        withCredentials: true,
      });
      setUser(data.user);
      setStatus("AUTHENTICATED");
    } catch (error) {
      reAuthorize(); // Call reAuthorize instead of undefined function
    }
  };

  const reAuthorize = async () => {
    console.log("Reauthorizing User...");
    try {
      await axios.get(`${base_url}refresh`, { withCredentials: true });
      authorize(); // Reauthorize after refreshing the token
    } catch (error) {
      setUser(null);
      setStatus("UNAUTHENTICATED");
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${base_url}auth/logout`, { withCredentials: true });
      setUser(null);
      setStatus("LOGGED_OUT");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <authContext.Provider value={{ user, status, authorize, logout }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
