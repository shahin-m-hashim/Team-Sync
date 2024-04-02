import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import DummyUserPage from "./pages/DummyPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import TaskDash from "./components/dashboard/TaskDash";
import TeamDash from "./components/dashboard/TeamDash";
import UserSettingsPage from "./pages/user/UserSettingsPage";
import SubTeamDash from "./components/dashboard/SubTeamDash";
import ProjectDash from "./components/dashboard/ProjectDash";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Test from "./pages/Test";
import DummyPage from "./pages/DummyPage";
import UserProvider from "./providers/UserProvider";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";

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
      <UserProvider>
        <Outlet />
      </UserProvider>
    ),
    children: [
      {
        index: true,
        element: <DummyUserPage />,
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
        ],
      },
      {
        path: "settings",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <DummyPage />,
          },
          {
            path: "general",
            element: <UserSettingsPage />,
          },
          {
            path: "security",
            element: <SecuritySettingsPage />,
          },
        ],
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
    path: "*",
    element: <ErrorPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
