import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import AuthProvider from "./contexts/authContext";
import DashboardPage from "./pages/DashboardPage";
import ReLoginPage from "./pages/ReLoginPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./components/Auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "user",
    children: [
      {
        index: true,
        element: <ErrorPage />,
      },
      {
        path: "dashboard",
        element: <Auth><DashboardPage /></Auth>
      },
    ],
  },
  {
    path: "reLogin",
    element: <ReLoginPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
