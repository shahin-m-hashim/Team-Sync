/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import { useFormik } from "formik";
import showPass from "../../assets/images/ShowPass.png";
import hidePass from "../../assets/images/HidePass.png";
import { resetPasswordValidationSchema as validationSchema } from "../../validations/authValidations";
import { resetPassword } from "@/services/auth";
import { cn } from "@/lib/utils";

const ResetPassword = ({ setShowInput }) => {
  const errorRef = useRef();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const initialValues = {
    password: "",
    cPassword: "",
  };

  const handlePasswordResetError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handlePasswordResetError);
    }
  };

  const onSubmit = async (values) => {
    try {
      await resetPassword(values);
      setShowInput("success");
    } catch (e) {
      if (e.code !== "ERR_NETWORK") {
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handlePasswordResetError);
      } else console.log(e);
    }
  };

  const {
    errors,
    handleSubmit,
    touched,
    getFieldProps,
    isValid,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form
      className="w-full max-w-sm p-8 mx-auto space-y-6 bg-white rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="password"
        >
          New Password
        </label>
        <div className="relative flex items-center">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter a secure password"
            {...getFieldProps("password")}
          />
          <img
            className={cn(
              showPassword ? "size-8" : "size-9 pb-1",
              " size-8 absolute right-3 cursor-pointer"
            )}
            onClick={() => {
              setShowPassword(!showPassword);
            }}
            src={showPassword ? showPass : hidePass}
          />
        </div>
        {errors.password && touched.password ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.password}
          </p>
        ) : null}
      </div>
      <div className="mb-3">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="cPassword"
        >
          Confirm New Password
        </label>
        <div className="relative flex items-center gap-3">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            type={showCPassword ? "text" : "password"}
            id="cPassword"
            name="cPassword"
            placeholder="Confirm Your Password"
            {...getFieldProps("cPassword")}
          />
          <img
            className={cn(
              showCPassword ? "size-8" : "size-9 pb-1",
              " size-8 absolute right-3 cursor-pointer"
            )}
            onClick={() => {
              setShowCPassword(!showCPassword);
            }}
            src={showCPassword ? showPass : hidePass}
          />
        </div>
        {errors.cPassword && touched.cPassword ? (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.cPassword}
          </p>
        ) : null}
      </div>
      <p
        ref={errorRef}
        className="text-sm text-center text-red-600 dark:text-red-400"
      ></p>
      <div>
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
            />
          </svg>
          <span>&nbsp;Reset password</span>
        </button>
      </div>
    </form>
  );
};

export default ResetPassword;
