import axios from "axios";
import { getLocalSecureItem } from "@/lib/utils";

const baseURL = import.meta.env.VITE_APP_BASE_URL;

const updateData = async (url, newData) => {
  // console.log("Updating data...");
  const user = getLocalSecureItem("user", "low");

  try {
    await axios.patch(`${baseURL}/user/${user?.id}/${url}`, newData, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      if (error.response.data.error === "Invalid password, Please try again") {
        throw new Error("Invalid password");
      } else await reAuthorizeUpdate(url, newData);
    } else throw error;
  }
};

const deleteData = async (url) => {
  // console.log("Deleting data...");
  const user = getLocalSecureItem("user", "low");
  try {
    await axios.delete(`${baseURL}/user/${user?.id}/${url}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      await reAuthorizeDelete(url);
    } else throw error;
  }
};

const deleteAccount = async (password) => {
  // console.log("Deleting account...");
  const user = getLocalSecureItem("user", "low");
  try {
    await axios.delete(`${baseURL}/user/${user.id}`, {
      data: { password },
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      if (error.response.data.error === "Invalid password, Please try again") {
        throw new Error("Invalid password");
      } else await reAuthorizeAccountDelete(password);
    } else throw error;
  }
};

const reAuthorizeUpdate = async (url, newData) => {
  // console.log("Reauthorizing update...");
  await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
  await updateData(url, newData);
};

const reAuthorizeDelete = async (url) => {
  // console.log("Reauthorizing delete...");
  await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
  await deleteData(url);
};

const reAuthorizeAccountDelete = async (password) => {
  // console.log("Reauthorizing account deletion...");
  await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
  await deleteAccount(password);
};

export { updateData, deleteData, deleteAccount };
