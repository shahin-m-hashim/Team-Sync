import { useState } from "react";
import rocket from "../../assets/images/rocket.png";
import ForgotPassword from "@/components/ForgotPassword";
import OtpInput from "@/components/OtpInput";
import { Link } from "react-router-dom";
import ResetPassword from "@/components/ResetPassword";

const ResetPasswordPage = () => {
  const [showInput, setShowInput] = useState("emailForm");

  return (
    <div className="h-screen lg:grid lg:grid-cols-2">
      <div className="flex flex-col justify-center flex-1 min-h-full py-10 px-7 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link
            to="/"
            className="block mt-10 text-3xl font-bold leading-9 tracking-tight text-center text-gray-900"
          >
            TeamSync
          </Link>
          {showInput !== "success" && (
            <h2 className="mt-10 text-2xl font-medium leading-9 tracking-tight text-center text-gray-900">
              Reset Your Password
            </h2>
          )}
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {showInput === "emailForm" && (
            <ForgotPassword setShowInput={setShowInput} />
          )}
          {showInput === "otpForm" && <OtpInput setShowInput={setShowInput} />}
          {showInput === "passwordForm" && (
            <ResetPassword setShowInput={setShowInput} />
          )}
          {showInput === "success" && (
            <div
              className="p-4 mt-10 text-green-700 border-l-4 border-green-500 pl-7 bg-green-50"
              role="alert"
            >
              <div className="flex">
                <div className="py-1">
                  <svg
                    className="w-6 h-6 mr-4 text-green-500 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 9a1 1 0 012 0v4a1 1 0 01-2 0V9zm1-5a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold">Success</p>
                  <p className="text-sm">
                    You have successfully reset your password
                  </p>
                </div>
              </div>
            </div>
          )}
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
  );
};

export default ResetPasswordPage;
