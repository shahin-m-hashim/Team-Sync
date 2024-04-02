/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";

const useFetch = (url, reFetch) => {
  const user = getLocalSecureItem("user", "low");
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [data, setData] = useState({
    error: null,
    apiData: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data...");
      try {
        const { data } = await axios.get(`${baseURL}/user/${user.id}/${url}`, {
          withCredentials: true,
        });
        setData({ apiData: data, error: null, isLoading: false });
      } catch (error) {
        handleFetchError(error);
      }
    };

    const handleFetchError = async (error) => {
      if (error.response?.status === 401) {
        await reAuthorize();
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response.status === 500
      ) {
        setData({
          apiData: null,
          error: "serverError",
          isLoading: false,
        });
      } else {
        setData({
          apiData: null,
          error: error?.response?.data?.error || "Something went wrong",
          isLoading: false,
        });
      }
    };

    const reAuthorize = async () => {
      try {
        await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
        fetchData();
      } catch (error) {
        {
          setData({
            apiData: null,
            error: "unauthorized",
            isLoading: false,
          });
        }
      }
    };

    if (user) {
      fetchData();
    } else {
      setData({
        apiData: null,
        error: "unauthorized",
        isLoading: false,
      });
    }

    return () => {};
  }, [url, reFetch]);

  return data;
};

export default useFetch;
