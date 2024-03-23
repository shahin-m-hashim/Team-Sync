/* eslint-disable react/prop-types */
import { useContext, useRef, useState } from "react";
import { authContext } from "@/providers/AuthProvider";
import { useNavigate } from "react-router-dom";

const VerifyOTP = ({ setShowInput }) => {
  const errorRef = useRef();
  const otpInputRefs = [];
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const { verifyOTP } = useContext(authContext);

  const handleOtpError = (event) => {
    if (errorRef.current && !errorRef.current.contains(event.target)) {
      errorRef.current.innerText = "";
      document.body.removeEventListener("click", handleOtpError);
    }
  };

  const handleInputChange = (index, event) => {
    const newOtp = [...otp];
    newOtp[index] = event.target.value;
    setOtp(newOtp);

    // Focus next input if available
    if (event.target.value && otpInputRefs[index + 1]) {
      otpInputRefs[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && otpInputRefs[index - 1]) {
      otpInputRefs[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const otpValue = otp.join("");
      await verifyOTP({ otp: otpValue });
      setShowInput("passwordForm");
    } catch (e) {
      const status = e.response ? e.response.status : 500;
      if (status === 401) {
        errorRef.current.innerText = e.response.data.error;
        document.body.addEventListener("click", handleOtpError);
      } else {
        console.log(e);
        navigate("/serverError", { replace: true });
      }
    }
  };

  return (
    <form
      className="flex flex-col items-center w-full max-w-sm p-8 pt-0 mx-auto space-y-2 bg-white rounded-md shadow-md"
      onSubmit={handleSubmit}
    >
      <div>
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleInputChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            ref={(ref) => (otpInputRefs[index] = ref)}
            autoFocus={index === 0}
            style={{
              width: "2rem",
              height: "2rem",
              fontSize: "1.5rem",
              margin: "0.5rem",
              textAlign: "center",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
            }}
          />
        ))}
      </div>
      <p
        ref={errorRef}
        className="text-sm text-center text-red-600 dark:text-red-400"
      ></p>
      <button
        type="submit"
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
        <span>&nbsp;Verify OTP</span>
      </button>
    </form>
  );
};

export default VerifyOTP;
