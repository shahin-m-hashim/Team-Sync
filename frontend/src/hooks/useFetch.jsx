/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { getLocalSecureItem } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const useFetch = (url) => {
  const navigate = useNavigate();
  const user = getLocalSecureItem("user", "low");
  const baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [data, setData] = useState({
    error: null,
    apiData: null,
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseURL}/user/${user.id}/${url}`, {
          withCredentials: true,
        });
        setData({ apiData: response.data.data, error: null, isLoading: false });
      } catch (error) {
        handleFetchError(error);
      }
    };

    const handleFetchError = async (error) => {
      if (error.response?.status === 401) {
        await reAuthorize();
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        setData({
          apiData: null,
          error: "Server Error",
          isLoading: false,
        });
        navigate("/serverError", { replace: true });
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
            error: "Unauthorized",
            isLoading: false,
          });
          localStorage.clear();
        }
      }
    };

    if (user) {
      fetchData();
    } else {
      setData({
        apiData: null,
        error: "Unauthorized",
        isLoading: false,
      });
    }

    return () => {};
  }, [url]);

  return data;
};

export default useFetch;
