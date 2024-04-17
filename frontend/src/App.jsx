import Test from "./pages/Test";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import DummyPage from "./pages/DummyPage";
import LoginPage from "./pages/auth/LoginPage";
import Teams from "./components/dashBody/Teams";
import SignupPage from "./pages/auth/SignUpPage";
import UserDashboard from "./pages/UserDashboard";
import UserProvider from "./providers/UserProvider";
import FileProvider from "./providers/FileProvider";
import ErrorProvider from "./providers/ErrorProvider";
import Projects from "./components/dashBody/Projects";
import TeamSettings from "./pages/settings/TeamSettings";
import ProjectProvider from "./providers/ProjectProvider";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProjectSettings from "./pages/settings/ProjectSettings";
import SubTeamSettings from "./pages/settings/SubTeamSettings";
import UserSettingsPage from "./pages/settings/UserSettingsPage";
import InvitationsProvider from "./providers/InvitationsProvider";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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
        <InvitationsProvider>
          <ProjectProvider>
            <Outlet />
          </ProjectProvider>
        </InvitationsProvider>
      </UserProvider>
    ),
    children: [
      {
        index: true,
        element: <DummyPage />,
      },
      {
        path: "dashboard",
        element: (
          <UserDashboard>
            <Outlet />
          </UserDashboard>
        ),
        children: [
          {
            index: true,
            element: <Projects />,
          },
          {
            path: "projects/:projectId/teams",
            element: <Teams />,
          },
        ],
      },
      {
        path: "projects/:projectId/settings",
        element: <ProjectSettings />,
      },
      {
        path: "projects/:projectId/teams/:teamId/settings",
        element: <TeamSettings />,
      },
      {
        path: "projects/:projectId/teams/:teamId/subteams/:subTeamId/settings",
        element: <SubTeamSettings />,
      },
      {
        path: "projects/:projectId/teams/:teamId/subteams/:subTeamId/tasks/:taskId/settings",
        element: <ProjectSettings />,
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
  return (
    <ErrorProvider>
      <FileProvider>
        <RouterProvider router={router} />
      </FileProvider>
    </ErrorProvider>
  );
}

export default App;
