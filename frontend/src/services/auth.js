import axios from "axios";
import { setLocalSecureItem } from "@/lib/utils";

const base_url = import.meta.env.VITE_APP_BASE_URL;

const signup = async (credentials) =>
  await axios.post(base_url + "auth/signup", credentials);

const login = async (credentials) => {
  const { data } = await axios.post(base_url + "auth/login", credentials, {
    withCredentials: true,
  });

  setLocalSecureItem(
    "user",
    {
      id: data.data.userId,
      status: "LOGGED_IN",
    },
    "low"
  );
  return data.data.userId;
};

const reAuthorize = async () => {
  try {
    await axios.get(base_url + "auth/refresh", { withCredentials: true });
  } catch (error) {
    localStorage.clear();
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
  const response = await axios.post(base_url + "auth/verifyOTP", credentials, {
    withCredentials: true,
  });
  return response;
};

const resetPassword = async (credentials) => {
  const response = await axios.post(base_url + "auth/resetPass", credentials, {
    withCredentials: true,
  });
  return response;
};

const logout = async () => {
  localStorage.clear();
  await axios.get(base_url + "auth/logout", { withCredentials: true });
};

export {
  signup,
  login,
  reAuthorize,
  reqPassResetOTP,
  verifyOTP,
  resetPassword,
  logout,
};
