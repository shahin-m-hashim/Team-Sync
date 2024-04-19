/* eslint-disable react-refresh/only-export-components */

import Test from "./pages/Test";
import { useEffect } from "react";
import { io } from "socket.io-client";
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
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProjectSettings from "./pages/settings/ProjectSettings";
import SubTeamSettings from "./pages/settings/SubTeamSettings";
import UserSettingsPage from "./pages/settings/UserSettingsPage";
import InvitationsProvider from "./providers/InvitationsProvider";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import SubTeams from "./components/dashBody/SubTeams";

const baseURL = import.meta.env.VITE_APP_SOCKET_URL;
export const socket = io(baseURL, { withCredentials: true });

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
          <Outlet />
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
            path: "projects/:projectId",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Teams />,
              },
              {
                path: "teams/:teamId",
                element: <Outlet />,
                children: [
                  {
                    index: true,
                    element: <SubTeams />,
                  },
                  {
                    path: "subteams/:subTeamId",
                    element: <Teams />,
                  },
                ],
              },
            ],
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
        element: <Outlet />,
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
  useEffect(() => {
    socket.on("connect", () => console.log(`Connected: ${socket.id}`));
    socket.on("disconnect", () => console.log(`Disconnected`));
  }, []);

  return (
    <ErrorProvider>
      <FileProvider>
        <RouterProvider router={router} />
      </FileProvider>
    </ErrorProvider>
  );
}

export default App;
