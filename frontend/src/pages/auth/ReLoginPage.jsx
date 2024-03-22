import { Link } from "react-router-dom";

export default function ReLoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-5 p-20 bg-white rounded-lg shadow-lg">
        <h1 className="text-6xl font-semibold text-red-500">401</h1>
        <h2 className="text-3xl font-semibold text-gray-800">
          Oops! Un Authorized
        </h2>
        <p className="mt-4 text-lg text-center text-gray-600">
          <span>It appears that your session has expired&nbsp;</span>
          <br />
          <span>
            or you are currently{" "}
            <span className="font-semibold">logged out.</span>
          </span>
          <br />
          Please&nbsp;&nbsp;&nbsp;
          <Link to="/login" className="text-2xl text-blue-500 underline">
            log in
          </Link>
          &nbsp;&nbsp;again to continue.
        </p>
        <div className="mt-8">
          <svg
            className="w-16 h-16 text-red-500 animate-bounce"
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
      </div>
    </div>
  );
}
