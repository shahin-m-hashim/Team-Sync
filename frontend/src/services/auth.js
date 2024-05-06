import axios from "axios";
import { getLocalSecureItem, setLocalSecureItem } from "@/lib/utils";

const base_url = import.meta.env.VITE_APP_BASE_URL;

const signup = async (credentials) =>
  await axios.post(base_url + "/api/auth/signup", credentials);

const login = async (credentials) => {
  const { data } = await axios.post(base_url + "/api/auth/login", credentials, {
    withCredentials: true,
  });

  setLocalSecureItem(
    "user",
    {
      id: data.userId,
      status: "LOGGED_IN",
      username: data.username,
    },
    "low"
  );
  return data.userId;
};

const reqPassResetOTP = async (credentials) => {
  const response = await axios.post(
    base_url + "/api/auth/reqPassResetOtp",
    credentials,
    {
      withCredentials: true,
    }
  );
  return response;
};

const verifyOTP = async (otp) => {
  const response = await axios.post(
    base_url + "/api/auth/verifyPassResetOtp",
    otp,
    {
      withCredentials: true,
    }
  );
  return response;
};

const resetPassword = async (credentials) => {
  const response = await axios.post(base_url + "/api/auth/resetPass", credentials, {
    withCredentials: true,
  });
  return response;
};

const logout = async () => {
  const { id } = getLocalSecureItem("user", "low");
  localStorage.clear();
  await axios.post(
    base_url + "/api/auth/logout",
    { userId: id },
    { withCredentials: true }
  );
};

export { signup, login, reqPassResetOTP, verifyOTP, resetPassword, logout };
