import { useFormik } from "formik";
import { loginValidationSchema as validationSchema } from "../../validations/authValidations";
import { Link, useNavigate } from "react-router-dom";
import rocket from "../../assets/images/rocket.png";
import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from "@/providers/AuthProvider";
import { getLocalSecureItem } from "@/lib/utils";

export default function LoginPage() {
  const navigate = useNavigate();
  const errorRef = useRef();

  const [render, setRender] = useState(false);
  const authState = getLocalSecureItem("auth", "low");

  useEffect(() => {
    if (authState === "LOGGED_IN" || authState === "AUTHORIZED")
      navigate("/user/projects", { replace: true });
    setRender(true);
  }, [authState]);

  const { login } = useContext(authContext);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleLoginError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handleLoginError);
    }
  };

  const onSubmit = async (values) => {
    try {
      await login(values);
      navigate("/user/projects", { replace: true });
    } catch (e) {
      if (e.code !== "ERR_NETWORK") {
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handleLoginError);
      } else {
        console.log(e);
        navigate("/serverError", { replace: true });
      }
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    render && (
      <>
        <div className="h-screen lg:grid lg:grid-cols-2">
          <div className="flex flex-col justify-center flex-1 min-h-full py-10 px-7 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
              <Link
                to="/"
                className="block mt-10 text-3xl font-bold leading-9 tracking-tight text-center text-gray-900"
              >
                TeamSync
              </Link>
              <h2 className="mt-10 text-2xl font-medium leading-9 tracking-tight text-center text-gray-900">
                Log in to your account
              </h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form
                className="w-full max-w-sm p-8 mx-auto space-y-6 bg-white rounded-md shadow-md"
                onSubmit={formik.handleSubmit}
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
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  {formik.errors.email && formik.touched.email ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formik.errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="text-sm">
                      <Link to="/resetPass">Forgot password?</Link>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  {formik.errors.password && formik.touched.password ? (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {formik.errors.password}
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
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Log in
                  </button>
                </div>
              </form>

              <p className="mt-10 text-sm text-center text-gray-500">
                Not a member?&nbsp;
                <Link
                  to="/signup"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up Right Now
                </Link>
              </p>
            </div>
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
