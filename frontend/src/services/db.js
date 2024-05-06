import axios from "axios";
import { getLocalSecureItem } from "@/lib/utils";

const baseURL = import.meta.env.VITE_APP_BASE_URL;

const addData = async (url, newData) => {
  // console.log("Adding data...");
  const user = getLocalSecureItem("user", "low");

  try {
    await axios.post(`${baseURL}/api/user/${user?.id}/${url}`, newData, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      await reAuthorizeAdd(url);
    } else throw error;
  }
};

const updateData = async (url, newData) => {
  // console.log("Updating data...");
  const user = getLocalSecureItem("user", "low");

  try {
    return await axios.patch(`${baseURL}/api/user/${user?.id}/${url}`, newData, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      if (
        error.response?.data?.error === "Invalid password, Please try again."
      ) {
        throw new Error("Invalid password");
      } else await reAuthorizeUpdate(url, newData);
    } else throw error;
  }
};

const deleteData = async (url) => {
  // console.log("Deleting data...");
  const user = getLocalSecureItem("user", "low");
  try {
    return await axios.delete(`${baseURL}/api/user/${user?.id}/${url}`, {
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
    await axios.delete(`${baseURL}/api/user/${user.id}`, {
      data: { password },
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      if (error.response.data.error === "Invalid password, Please try again.") {
        throw new Error("Invalid password");
      } else await reAuthorizeAccountDelete(password);
    } else throw error;
  }
};

const reAuthorizeAdd = async (url, newData) => {
  // console.log("Reauthorizing add...");
  await axios.get(`${baseURL}/api/auth/refresh`, { withCredentials: true });
  await addData(url, newData);
};

const reAuthorizeUpdate = async (url, newData) => {
  // console.log("Reauthorizing update...");
  await axios.get(`${baseURL}/api/auth/refresh`, { withCredentials: true });
  await updateData(url, newData);
};

const reAuthorizeDelete = async (url) => {
  // console.log("Reauthorizing delete...");
  await axios.get(`${baseURL}/api/auth/refresh`, { withCredentials: true });
  await deleteData(url);
};

const reAuthorizeAccountDelete = async (password) => {
  // console.log("Reauthorizing account deletion...");
  await axios.get(`${baseURL}/api/auth/refresh`, { withCredentials: true });
  await deleteAccount(password);
};

export { updateData, deleteData, deleteAccount, addData };
