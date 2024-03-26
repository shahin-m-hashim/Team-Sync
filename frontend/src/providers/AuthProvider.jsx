/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { setLocalSecureItem } from "@/lib/utils";
import axios from "axios";
import { createContext, useState } from "react";
const base_url = import.meta.env.VITE_APP_BASE_URL;
export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState("LOADING");

  const signup = async (credentials) =>
    await axios.post(base_url + "auth/signup", credentials, {
      withCredentials: true,
    });

  const login = async (credentials) => {
    const response = await axios.post(base_url + "auth/login", credentials, {
      withCredentials: true,
    });
    setLocalSecureItem("auth", "LOGGED_IN", "low");
    setAuthState("LOGGED_IN");
    return response;
  };

  const authorize = async () => {
    try {
      const { data } = await axios.get(base_url + "api/primaryUser", {
        withCredentials: true,
      });
      setLocalSecureItem("primary-user", data.user, "medium");
      setLocalSecureItem("auth", "AUTHORIZED", "low");
      setAuthState("AUTHORIZED");
    } catch (error) {
      reAuthorize();
    }
  };

  const reAuthorize = async () => {
    try {
      await axios.get(base_url + "refresh", { withCredentials: true });
      authorize();
    } catch (error) {
      setAuthState("UNAUTHORIZED");
      setLocalSecureItem("auth", "UNAUTHORIZED", "low");
    }
  };

  const reqPassResetOTP = async (credentials) => {
    const response = await axios.post(
      base_url + "auth/reqPassResetOtp",
      credentials,
      {
        withCredentials: true,
      }
    );
    return response;
  };

  const verifyOTP = async (credentials) => {
    const response = await axios.post(
      base_url + "auth/verifyOTP",
      credentials,
      {
        withCredentials: true,
      }
    );
    return response;
  };

  const resetPassword = async (credentials) => {
    const response = await axios.post(
      base_url + "auth/resetPass",
      credentials,
      {
        withCredentials: true,
      }
    );
    return response;
  };

  const logout = async () => {
    localStorage.clear();
    await axios.get(base_url + "auth/logout", { withCredentials: true });
    setAuthState("LOGGED_OUT");
  };

  return (
    <authContext.Provider
      value={{
        authState,
        signup,
        login,
        authorize,
        logout,
        reqPassResetOTP,
        verifyOTP,
        resetPassword,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
