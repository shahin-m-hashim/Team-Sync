import axios from "axios";
import { getLocalSecureItem } from "@/lib/utils";

const user = getLocalSecureItem("user", "low");
const baseURL = import.meta.env.VITE_APP_BASE_URL;

const updateData = async (url, newData) => {
  // console.log("Updating data...");

  try {
    const response = await axios.patch(
      `${baseURL}/user/${user.id}/${url}`,
      newData,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (error) {
    if (error.response?.status === 401) {
      await reAuthorize(url, newData);
    } else throw error;
  }
};

const reAuthorize = async (url, newData) => {
  await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
  await updateData(url, newData);
};

export default updateData;
