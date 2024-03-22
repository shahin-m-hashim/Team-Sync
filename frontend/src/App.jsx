import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import LogOutPage from "./pages/LogOutPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import AuthProvider from "./contexts/authContext";
import DashboardPage from "./pages/DashboardPage";
import ReLoginPage from "./pages/auth/ReLoginPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import TeamDash from "./components/dashboard/TeamDash";
import TaskDash from "./components/dashboard/TaskDash";
import AuthWrapper from "./components/auth/AuthWrapper";
import SubTeamDash from "./components/dashboard/SubTeamDash";
import ProjectDash from "./components/dashboard/ProjectDash";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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
        <DashboardPage>
          <Outlet />
        </DashboardPage>
      </AuthWrapper>
    ),
    children: [
      {
        index: true,
        element: <ErrorPage />,
      },
      {
        path: "projects",
        element: <ProjectDash />,
      },
      {
        path: "teams",
        element: <TeamDash />,
      },
      {
        path: "subTeams",
        element: <SubTeamDash />,
      },
      {
        path: "tasks",
        element: <TaskDash />,
      },
    ],
  },
  {
    path: "dashboard",
    element: (
      <DashboardPage>
        <Outlet />
      </DashboardPage>
    ),
    children: [
      {
        path: "projects",
        element: <ProjectDash />,
      },
      {
        path: "teams",
        element: <TeamDash />,
      },
      {
        path: "subTeams",
        element: <SubTeamDash />,
      },
      {
        path: "tasks",
        element: <TaskDash />,
      },
    ],
  },
  {
    path: "resetPass",
    element: <ResetPasswordPage />,
  },
  {
    path: "reLogin",
    element: <ReLoginPage />,
  },
  {
    path: "loggedOut",
    element: <LogOutPage />,
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
