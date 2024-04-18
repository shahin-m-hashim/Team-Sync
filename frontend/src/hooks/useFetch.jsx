/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";

const useFetch = (url, reFetch) => {
  const user = getLocalSecureItem("user", "low");
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [response, setResponse] = useState({
    data: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching data...", url);
      try {
        const res = await axios.get(`${baseURL}/user/${user.id}/${url}`, {
          withCredentials: true,
        });

        setResponse({ data: res.data, error: null, isLoading: false });
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
        setResponse({
          data: null,
          isLoading: false,
          error: "serverError",
        });
      } else {
        setResponse({
          data: null,
          isLoading: false,
          error: error?.response?.data?.error || "Something went wrong",
        });
      }
    };

    const reAuthorize = async () => {
      try {
        await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true });
        fetchData();
      } catch (error) {
        {
          setResponse({
            data: null,
            isLoading: false,
            error: "unauthorized",
          });
        }
      }
    };

    if (user) {
      fetchData();
    } else {
      setResponse({
        data: null,
        isLoading: false,
        error: "unauthorized",
      });
    }

    return () => {};
  }, [url, reFetch]);

  return response;
};

export default useFetch;
