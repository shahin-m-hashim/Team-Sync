import axios from "axios";
import { getLocalSecureItem } from "@/lib/utils";

const user = getLocalSecureItem("user", "low");
const baseURL = import.meta.env.VITE_APP_BASE_URL;

const updateData = async (url, newData) => {
  console.log("Updating data...");

  try {
    await axios.patch(`${baseURL}/user/${user.id}/${url}`, newData, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      await reAuthorize(url, newData);
    } else throw error;
  }
};

const deleteData = async (url) => {
  console.log("Deleting data...");

  try {
    await axios.delete(`${baseURL}/user/${user.id}/${url}`, {
      withCredentials: true,
    });
  } catch (error) {
    if (error.response?.status === 401) {
      await reAuthorize(url);
    } else throw error;
  }
};

const reAuthorize = async (url, newData) => {
  await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
  await updateData(url, newData);
};

export { updateData, deleteData };
