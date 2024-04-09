import Test from "./pages/Test";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import DummyPage from "./pages/DummyPage";
import DummyUserPage from "./pages/DummyPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import DashboardPage from "./pages/DashboardPage";
import PublicProfile from "./pages/PublicProfile";
import UserProvider from "./providers/UserProvider";
import FileProvider from "./providers/FileProvider";
import ErrorProvider from "./providers/ErrorProvider";
import TaskDash from "./components/dashboard/TaskDash";
import TeamDash from "./components/dashboard/TeamDash";
import UserSettingsPage from "./pages/user/UserSettingsPage";
import SubTeamDash from "./components/dashboard/SubTeamDash";
import ProjectDash from "./components/dashboard/ProjectDash";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import SecuritySettingsPage from "./pages/user/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProjectSettings from "./pages/user/ProjectSettings";
import TeamSettings from "./pages/user/TeamSettings";
import SubTeamSettings from "./pages/user/SubTeamSettings";

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
    path: ":username",
    element: <PublicProfile />,
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
            element: (
              // <ProjectProvider>
              <ProjectDash />
              // </ProjectProvider>
            ),
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
            path: "project",
            element: <ProjectSettings />,
          },
          {
            path: "team",
            element: <TeamSettings />,
          },
          {
            path: "subTeam",
            element: <SubTeamSettings />,
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
  return (
    <ErrorProvider>
      <FileProvider>
        <RouterProvider router={router} />
      </FileProvider>
    </ErrorProvider>
  );
}

export default App;
