import { getLocalSecureItem } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorPage() {
  const navigate = useNavigate();
  const [render, setRender] = useState(false);

  useEffect(() => {
    const user = getLocalSecureItem("user", "low");
    if (user?.status === "LOGGED_IN") {
      navigate(`/user/${user?.id}/dashboard/projects`, { replace: true });
    }
    setRender(true);
    const timeoutId = setTimeout(() => navigate(-1, { replace: true }), 3000);
    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    render && (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
          <p className="mb-4 text-lg text-gray-600">
            Oops! Looks like you are lost.
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

          <p>We are getting you back.</p>
        </div>
      </div>
    )
  );
}
