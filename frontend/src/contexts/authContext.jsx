/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import axios from "axios";
import { createContext, useState } from "react";
const base_url = import.meta.env.VITE_APP_BASE_URL;
export const authContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState("LOADING");

  const signup = async (credentials) =>
    await axios.post(base_url + "auth/signup", credentials, {
      withCredentials: true,
    });

  const login = async (credentials) => {
    console.log("Logging In");
    const response = await axios.post(base_url + "auth/login", credentials, {
      withCredentials: true,
    });
    localStorage.setItem("authState", "LOGGED_IN");
    setAuthState("LOGGED_IN");
    return response;
  };

  const authorize = async () => {
    console.log("Authorizing");
    try {
      const { data } = await axios.get(base_url + "api/primaryUser", {
        withCredentials: true,
      });
      setUser(data.user);
      localStorage.setItem("authState", "AUTHORIZED");
      setAuthState("AUTHORIZED");
    } catch (error) {
      reAuthorize();
    }
  };

  const reAuthorize = async () => {
    console.log("Reauthorizing");
    try {
      await axios.get(base_url + "refresh", { withCredentials: true });
      authorize();
    } catch (error) {
      setUser(null);
      setAuthState("UNAUTHORIZED");
      localStorage.setItem("authState", "UNAUTHORIZED");
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
    console.log("Password Request OTP Send");
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
    console.log("OTP verified successfully");
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
    console.log("Password Reset Successfully");
    return response;
  };

  const logout = async () => {
    console.log("Logging out");
    try {
      await axios.get(base_url + "auth/logout", { withCredentials: true });
      setUser(null);
      setAuthState("LOGGED_OUT");
      localStorage.setItem("authState", "LOGGED_OUT");
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
