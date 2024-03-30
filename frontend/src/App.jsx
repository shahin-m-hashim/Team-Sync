import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import ServerErrorPage from "./pages/ServerErrorPage";
import TaskDash from "./components/dashboard/TaskDash";
import DummyUserPage from "./pages/user/DummyUserPage";
import TeamDash from "./components/dashboard/TeamDash";
import UserSettingsPage from "./pages/user/UserSettingsPage";
import SubTeamDash from "./components/dashboard/SubTeamDash";
import ProjectDash from "./components/dashboard/ProjectDash";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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
        element: <DummyUserPage />,
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
      {
        path: "settings/general",
        element: <UserSettingsPage />,
      },
      {
        path: "settings/security",
        element: <SecuritySettingsPage />,
      },
    ],
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
