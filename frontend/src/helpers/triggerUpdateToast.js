import { Bounce, toast } from "react-toastify";

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

const notifyUpdateFailure = () => {
  toast.error("Update Failed !!!", {
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

export { notifyUpdateSuccess, notifyUpdateFailure };
