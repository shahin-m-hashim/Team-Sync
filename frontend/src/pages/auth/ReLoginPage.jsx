import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ReLoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => navigate("/login", { replace: true }), 3000);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-semibold text-red-500">401</h1>
        <p className="mb-4 text-lg text-gray-600">
          Oops! Your Session has expired.
          <br /> Please Login Again.
        </p>
        <div className="animate-bounce">
          <svg
            className="w-16 h-16 mx-auto text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>

        <p> We are getting you back.</p>
      </div>
    </div>
  );
}
