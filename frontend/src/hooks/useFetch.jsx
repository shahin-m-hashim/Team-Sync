/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { reAuthorize } from "@/services/auth";
import { getCookie, getLocalSecureItem, setLocalSecureItem } from "@/lib/utils";

const token = getCookie("accJWT");
const baseURL = import.meta.env.VITE_APP_BASE_URL;
const userId = getLocalSecureItem("user_id", "low");

console.log("Token:", token);

export default function useFetch(url) {
  const [data, setData] = useState({
    isLoading: true,
    apiData: null,
    serverError: null,
  });

  const authorizeAndFetchData = async () => {
    try {
      setData((prev) => ({ ...prev, isLoading: true }));

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const response = await axios.get(
        `${baseURL}/user/${userId}/${url}`,
        config
      );

      setData((prev) => ({
        ...prev,
        apiData: response.data,
      }));

      setLocalSecureItem("auth", "AUTHORIZED", "low");
    } catch (error) {
      reAuthorize();
      setData((prev) => ({
        ...prev,
        serverError: error.message,
      }));
    } finally {
      setData((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    if (!url) return;
    authorizeAndFetchData();
  }, [url]);

  return data;
}
