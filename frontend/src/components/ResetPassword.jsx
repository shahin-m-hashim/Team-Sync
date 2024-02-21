/* eslint-disable react/prop-types */
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { resetPasswordValidationSchema as validationSchema } from "../validations/authValidations";
import { useEffect, useRef } from "react";

const ResetPassword = ({ setShowInput }) => {
  const navigate = useNavigate();
  const errorRef = useRef();

  const authState = localStorage.getItem("authState");

  useEffect(() => {
    authState === "LOGGED_IN" && navigate("/user/dashboard");
  }, []);

  const initialValues = {
    password: "",
    cPassword: "",
  };

  //   const { signup } = useContext(authContext);

  const handleGlobalError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handleGlobalError);
    }
  };

  const onSubmit = async (values) => {
    // const { username, email, password } = values;

    try {
      //   const res = await signup({
      //     username,
      //     email,
      //     password,
      //   });
      //   console.log(res);
      //   res && navigate("/login", { replace: true });
      console.log(values);
      setShowInput("success");
    } catch (e) {
      if (e.code !== "ERR_NETWORK") {
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handleGlobalError);
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
      method="post"
      action="/api/login"
    >
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="password"
        >
          New Password
        </label>
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password"
          id="password"
          name="password"
          placeholder="Enter a secure password"
          {...getFieldProps("password")}
        />
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
        <input
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
          type="password"
          id="cPassword"
          name="cPassword"
          placeholder="Confirm Your Password"
          {...getFieldProps("cPassword")}
        />
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
