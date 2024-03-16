import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import ErrorPage from "./pages/ErrorPage";
import AuthProvider from "./contexts/authContext";
import DashboardPage from "./pages/DashboardPage";
import ReLoginPage from "./pages/auth/ReLoginPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import AuthWrapper from "./components/auth/AuthWrapper";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ServerErrorPage from "./pages/ServerErrorPage";

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
    element: (
      <AuthWrapper>
        <Outlet />
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        element: <ErrorPage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
    ],
  },
  {
    path: "resetPass",
    element: <ResetPasswordPage />,
  },
  {
    path: "projects",
    element: <DashboardPage tab="Project" />,
  },
  {
    path: "teams",
    element: <DashboardPage tab="Team" />,
  },
  {
    path: "subTeams",
    element: <DashboardPage tab="Sub Team" />,
  },
  {
    path: "tasks",
    element: <DashboardPage tab="Task" />,
  },
  {
    path: "reLogin",
    element: <ReLoginPage />,
  },
  {
    path: "serverError",
    element: <ServerErrorPage />,
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
