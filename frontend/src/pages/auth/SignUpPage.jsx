import { useFormik } from "formik";
import rocket from "../../assets/images/rocket.png";
import showPass from "../../assets/images/ShowPass.png";
import hidePass from "../../assets/images/HidePass.png";
import { Link, useNavigate } from "react-router-dom";
import { signupValidationSchema as validationSchema } from "../../validations/authValidations";
import { useEffect, useRef, useState } from "react";
import { cn, getLocalSecureItem } from "@/lib/utils";
import { signup } from "@/services/auth";

export default function SignupPage() {
  const errorRef = useRef();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const [render, setRender] = useState(false);

  useEffect(() => {
    const user = getLocalSecureItem("user", "low");
    if (user?.status === "LOGGED_IN") {
      navigate(`/user/${user?.id}/projects`, { replace: true });
    } else setRender(true);
  }, [navigate]);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    cPassword: "",
  };

  const handleSignUpError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handleSignUpError);
    }
  };

  const onSubmit = async (values) => {
    const { username, email, password } = values;

    try {
      await signup({
        username,
        email,
        password,
      });
      navigate("/login", { replace: true });
    } catch (e) {
      if (e.code !== "ERR_NETWORK") {
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handleSignUpError);
      } else {
        console.log(e);
        navigate("/serverError", { replace: true });
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
    resetForm,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    render && (
      <>
        <div className="h-screen lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-center flex-1 min-h-full lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Link
                to="/"
                className="block mt-5 text-3xl font-bold leading-9 tracking-tight text-center text-gray-900 sm:mt-3 sm:text-2xl"
              >
                TeamSync
              </Link>
              <h1 className="my-5 text-2xl font-medium leading-9 tracking-tight text-center text-gray-900 sm:text-xl">
                Registration Form
              </h1>
            </div>
            <form
              method="post"
              action="/api/signup"
              onSubmit={handleSubmit}
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
                  className="flex mb-2 text-sm font-bold text-gray-700"
                  htmlFor="cPassword"
                >
                  Confirm Password
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
                onClick={() => {
                  setShowPassword(false);
                  setShowCPassword(false);
                  resetForm();
                }}
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
    )
  );
}
