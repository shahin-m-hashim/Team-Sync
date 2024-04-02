import { toast } from "react-toastify";
import { deleteAccount } from "@/services/db";
import showPass from "../../assets/images/ShowPass.png";
import hidePass from "../../assets/images/HidePass.png";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function DeleteAccount({ setError, setShowDeleteModal }) {
  const passwordRef = useRef();
  const navigate = useNavigate();
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!passwordRef.current.value) {
      setShowError(true);
      return;
    }

    try {
      await deleteAccount(passwordRef.current.value);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      if (error.response?.status === 401) {
        setError("unauthorized");
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error" ||
        error.response?.status === 500
      ) {
        setError("serverError");
      } else if (error.message === "Invalid password") {
        toast.error("Invalid password, Please try again");
      } else {
        toast.error("Account Deletion failed !!!");
        setShowDeleteModal(false);
      }
    }
  };

  return (
    <div className="absolute inset-0 z-50 text-center backdrop-blur-[1px] flex items-center justify-center size-full ">
      <form
        onSubmit={handleDeleteAccount}
        className="max-w-[30vw]  bg-white rounded-lg shadow p-4"
      >
        <svg
          width="50"
          height="50"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 100 100"
          className="text-gray-400 dark:text-gray-500 mx-auto mb-3.5"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="gray"
            strokeWidth="2"
          />
          <path fill="yellow" d="M50,30 L30,70 L70,70 Z" />
          <text
            x="50"
            y="70"
            textAnchor="middle"
            fontSize="40"
            fill="red"
            fontWeight="bold"
          >
            !
          </text>
        </svg>

        <p className="mb-4 text-gray-500 dark:text-gray-300">
          This will remove all your data. Your account will be permanently
          deleted. This action cannot be undone.
        </p>
        <p className="mb-4 text-gray-500 dark:text-gray-300">
          Are you sure you want to delete your account?
        </p>

        <div className="flex items-center gap-6 px-8 my-5 ">
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm
          </label>
          <div className="relative flex items-center justify-center w-full">
            <input
              id="password"
              ref={passwordRef}
              name="password"
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
            <img
              className="absolute cursor-pointer size-8 right-3"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
              src={showPassword ? showPass : hidePass}
            />
          </div>
        </div>
        {showError && (
          <p className="my-5 text-sm text-red-600 dark:text-red-400">
            Password is required
          </p>
        )}
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="px-3 py-2 text-sm font-medium text-center bg-blue-500 hover:bg-blue-400"
          >
            No, cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 text-sm font-medium text-center bg-red-500 hover:bg-red-400"
          >
            Yes, I&apos;m sure
          </button>
        </div>
      </form>
    </div>
  );
}
