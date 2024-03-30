import { Link } from "react-router-dom";

const LoggedOutPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="mb-4 text-4xl font-bold">Logout Successful</h1>
      <p className="mb-8 text-lg text-gray-600">
        You have been successfully logged out.
      </p>
      <div className="flex gap-5">
        <Link
          to="/"
          className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
        >
          Home Page
        </Link>
        <Link
          to="/login"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login Again
        </Link>
      </div>
      <p className="mt-8 text-lg text-gray-600">
        Thank you for using our services.
      </p>
      <p className="mt-2 text-lg text-gray-600">Kindly visit again.</p>
    </div>
  );
};

export default LoggedOutPage;
