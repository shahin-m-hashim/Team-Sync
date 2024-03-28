import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import LogOutPage from "./pages/LogOutPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ReLoginPage from "./pages/auth/ReLoginPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import TeamDash from "./components/dashboard/TeamDash";
import TaskDash from "./components/dashboard/TaskDash";
import SubTeamDash from "./components/dashboard/SubTeamDash";
import ProjectDash from "./components/dashboard/ProjectDash";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import UserSettingsPage from "./pages/user/UserSettingsPage";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";
import ChangeUserDp from "./components/ChangeUserDp";
import Test from "./pages/Test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "signup",
    element: <SignupPage />,
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "user/:userId",
    element: (
      <DashboardPage>
        <Outlet />
      </DashboardPage>
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
    path: "settings/general",
    element: <UserSettingsPage />,
  },
  {
    path: "settings/security",
    element: <SecuritySettingsPage />,
  },
  {
    path: "dp",
    element: <ChangeUserDp />,
  },
  {
    path: "test",
    element: <Test />,
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
  return <RouterProvider router={router} />;
}

export default App;
