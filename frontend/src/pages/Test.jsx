import axios from "axios";
import { socket } from "@/App";
import { useEffect } from "react";
import { toast } from "react-toastify";
const baseURL = import.meta.env.VITE_APP_BASE_URL;

export default function Test() {
  useEffect(() => {
    socket.on("message", (data) => toast.success(data));
    return () => socket.off("message");
  }, []);

  const handleClick = async () => {
    try {
      await axios.get(`${baseURL}/test`);
    } catch (e) {
      toast.error(e.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="p-10 space-y-3">
      <button onClick={() => handleClick()} className="p-2 bg-blue-500">
        test
      </button>
      <div className="w-1/4 bg-orange-300 h-28">
        <h1 className="p-2 text-lg font-bold">Test socket io</h1>
      </div>
    </div>
  );
}
