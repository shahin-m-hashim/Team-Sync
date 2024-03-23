/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { forgotPasswordEmailValidationSchema as validationSchema } from "../../validations/authValidations";
import { useContext, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { authContext } from "@/providers/AuthProvider";
import VerifyOTP from "./VerifyOTP";

const RequestPassResetOTP = ({ setShowInput }) => {
  const navigate = useNavigate();
  const errorRef = useRef();

  const authState = localStorage.getItem("authState");
  const { reqPassResetOTP } = useContext(authContext);

  const [time, setTime] = useState(60);
  const [retry, setRetry] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    authState === "LOGGED_IN" && navigate("/user/dashboard");
  }, []);

  const initialValues = { email: "" };

  const handleGlobalError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handleGlobalError);
    }
  };

  const onSubmit = async (values) => {
    try {
      setTime(60);
      await reqPassResetOTP(values);
      setRetry(true);
      setShowOtp(true);
      const interval = setInterval(
        () => setTime((prevTime) => prevTime - 1),
        1000
      );

      setTimeout(() => {
        clearInterval(interval);
        setRetry(false);
      }, 60 * 1000);
    } catch (e) {
      const status = e.response ? e.response.status : 500;
      if (status === 404) {
        console.log(e);
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handleGlobalError);
      } else {
        navigate("/serverError", { replace: true });
        console.log(e);
      }
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
    <>
      <form
        className="w-full max-w-sm p-8 mx-auto space-y-6 bg-white rounded-md shadow-md"
        onSubmit={handleSubmit}
        method="post"
        action="/api/login"
      >
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div className="mt-2">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Your registered email address"
              {...getFieldProps("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          {errors.email && touched.email ? (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email}
            </p>
          ) : null}
        </div>
        <p
          ref={errorRef}
          className="text-sm text-center text-red-600 dark:text-red-400"
        ></p>
        {retry && (
          <p className="text-sm text-center text-blue-500 dark:text-red-400">
            Didn&apos;t receive email, retry in {time} seconds
          </p>
        )}
        <button
          type="submit"
          disabled={retry || !isValid || isSubmitting}
          className={cn(
            retry ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-500",
            "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          )}
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
          <span>&nbsp;Request Password Reset OTP</span>
        </button>
      </form>
      {showOtp && <VerifyOTP setShowInput={setShowInput} />}
    </>
  );
};

export default RequestPassResetOTP;
