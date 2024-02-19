import axios from "axios";
import { useFormik } from "formik";
import rocket from "../assets/images/rocket.png";
import { Link, useNavigate } from "react-router-dom";
import { validationSchema } from "../validations/signupValidation";
import { useRef } from "react";

const base_url = import.meta.env.VITE_APP_BASE_URL;

export default function SignupPage() {
  const navigate = useNavigate();
  const errorRef = useRef();

  const initialValues = {
    username: "johndoe",
    email: "john@yahoo.com",
    password: "John@12345",
    cPassword: "John@12345",
  };

  const onSubmit = async (values) => {
    const { username, email, password } = values;

    try {
      const response = await axios.post(base_url + "auth/signup", {
        username,
        email,
        password,
      });
      console.log(response.data);
      navigate("/login", { replace: true });
    } catch (e) {
      errorRef.current.innerText = e.response.data.error;
    }
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    touched,
    getFieldProps,
    isValid,
    isSubmitting,
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <div className="h-screen lg:grid lg:grid-cols-2">
        <div className="flex flex-col justify-center flex-1 min-h-full lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-5 text-3xl font-bold leading-9 tracking-tight text-center text-gray-900 sm:mt-3 sm:text-2xl">
              TeamSync
            </h2>
            <h1 className="my-5 text-2xl font-medium leading-9 tracking-tight text-center text-gray-900 sm:text-xl">
              Registration Form
            </h1>
          </div>
          <form
            onSubmit={handleSubmit}
            method="post"
            action="/api/signup"
            className="w-full max-w-sm p-5 mx-auto bg-white rounded-md shadow-md"
          >
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="username"
              >
                Username
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="text"
                id="username"
                name="username"
                placeholder="john123"
                {...getFieldProps("username")}
                // this reduces boiler plate for the below 3 repeating lines of code in formik input
                // onBlur={formik.handleBlur}
                // value={formik.values.email}
                // onChange={formik.handleChange}
              />
              {errors.username && touched.username ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.username}
                </p>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@example.com"
                {...getFieldProps("email")}
              />
              {errors.email && touched.email ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.email}
                </p>
              ) : null}
            </div>
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
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
                Confirm Password
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                type="password"
                id="cPassword"
                name="cPassword"
                placeholder="Confirm Your Password"
                value={values.cPassword}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors.cPassword && touched.cPassword ? (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.cPassword}
                </p>
              ) : null}
            </div>
            <p
              ref={errorRef}
              className="mb-3 text-sm text-center text-red-600 dark:text-red-400"
            ></p>
            <button
              className="w-full px-4 py-2 text-sm font-bold text-white transition duration-300 bg-indigo-500 rounded-md hover:bg-indigo-600"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              Register
            </button>
            <button
              className="w-full px-4 py-2 mt-3 text-sm font-bold text-white transition duration-300 bg-red-500 rounded-md hover:bg-red-600"
              type="reset"
              onClick={resetForm}
            >
              Reset Form
            </button>
            <Link
              to="/login"
              className="block mt-3 font-semibold leading-6 text-center text-indigo-600 hover:text-indigo-500"
            >
              Already have an account ? Login Here
            </Link>
          </form>
        </div>
        <img
          src={rocket}
          alt="rocket"
          className="hidden object-contain object-center h-screen p-7 lg:block"
        />
      </div>
    </>
  );
}
