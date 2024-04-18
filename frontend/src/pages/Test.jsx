import axios from "axios";
import { socket } from "@/App";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
const baseURL = import.meta.env.VITE_APP_BASE_URL;

export default function Test() {
  const [res, setRes] = useState(null);

  useEffect(() => {
    socket.on("notify", (data) => {
      console.log("A new notification received", data);
      setRes(data);
    });

    return () => {};
  }, []);

  const handleClick = async () => {
    try {
      await axios.get(`${baseURL}/notify`);
      toast.success("Server notified");
    } catch (e) {
      toast.error(e.response?.data?.error || "Error occurred");
    }
  };

  return (
    <div className="p-10 space-y-3">
      <button onClick={() => handleClick()} className="p-2 bg-blue-500">
        Notify
      </button>
      <div className="w-1/4 bg-orange-300 h-28">
        <h1 className="p-2 text-lg font-bold">Test socket io</h1>
        <hr />
        <div className="p-2">Server: {res}</div>
      </div>
    </div>
  );
}
