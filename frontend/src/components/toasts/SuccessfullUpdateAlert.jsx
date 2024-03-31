/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SuccessfullUpdateAlert() {
  useEffect(() => {
    notifyUpdateSuccess();
  }, []);

  const notifyUpdateSuccess = () => {
    toast.success("Update Successful !!!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      className: "custom-toast",
      transition: Bounce,
    });
  };

  return (
    <ToastContainer
      position="top-right"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
      style={{ width: "fit-content" }}
      toastClassName="custom-toast"
    />
  );
}
