/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import axios from "axios";
import { createContext, useState } from "react";
const base_url = import.meta.env.VITE_APP_BASE_URL;
export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState("LOADING");

  const signup = async (credentials) => {
    const response = await axios.post(base_url + "auth/signup", credentials, {
      withCredentials: true,
    });
    return response;
  };

  const login = async (credentials) => {
    const response = await axios.post(base_url + "auth/login", credentials, {
      withCredentials: true,
    });
    localStorage.setItem("authState", "LOGGED_IN");
    setAuthState("LOGGED_IN");
    return response;
  };

  const authorize = async () => {
    console.log("authorizing");
    try {
      const { data } = await axios.get(base_url + "api/primaryUser", {
        withCredentials: true,
      });
      setUser(data.user);
      setAuthState("AUTHORIZED");
    } catch (error) {
      reAuthorize();
    }
  };

  const reAuthorize = async () => {
    console.log("reauthorizing");
    try {
      await axios.get(`${base_url}refresh`, { withCredentials: true });
      authorize();
    } catch (error) {
      setUser(null);
      setAuthState("UNAUTHORIZED");
    }
  };

  const logout = async () => {
    try {
      await axios.get(base_url + "auth/logout", { withCredentials: true });
      localStorage.setItem("authState", "LOGGED_OUT");
      setAuthState("LOGGED_OUT");
      setUser(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <authContext.Provider
      value={{
        user,
        authState,
        signup,
        login,
        authorize,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
