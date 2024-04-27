/* eslint-disable react-refresh/only-export-components */

import Test from "./pages/Test";
import { useEffect } from "react";
import { io } from "socket.io-client";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import DummyPage from "./pages/DummyPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignUpPage";
import { getLocalSecureItem } from "./lib/utils";
import UserProvider from "./providers/UserProvider";
import FileProvider from "./providers/FileProvider";
import SideBar from "./components/sidebars/UserSideBar";
import TeamSettings from "./pages/settings/TeamSettings";
import UserNavbar from "./components/navbars/UserNavbar";
import TaskSettings from "./pages/settings/TaskSettings";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProjectSettings from "./pages/settings/ProjectSettings";
import UserSettingsPage from "./pages/settings/UserSettingsPage";
import TeamDashboard from "./components/dashBoards/TeamDashboard";
import UserDashboard from "./components/dashBoards/UserDashboard";
import TaskUploadsProvider from "./providers/TaskUploadsProvider";
import ProjectDashboard from "./components/dashBoards/ProjectDashboard";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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
        <Outlet />
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
          <>
            <SideBar />
            <div className="flex relative flex-col h-full pl-[16vw]">
              <UserNavbar settings={"p-2 border-white border-2 rounded-md"} />
              <Outlet />
            </div>
          </>
        ),
        children: [
          {
            index: true,
            element: <UserDashboard />,
          },
          {
            path: "projects/:projectId",
            children: [
              {
                index: true,
                element: <ProjectDashboard />,
              },
              {
                path: "teams/:teamId",
                children: [
                  {
                    index: true,
                    element: <TeamDashboard />,
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
        path: "projects/:projectId/teams/:teamId/tasks/:taskId/settings",
        element: <TaskSettings />,
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
  const { id = null, status = null } = getLocalSecureItem("user", "low") ?? {};

  useEffect(() => {
    socket.on("connect", () => console.log(`Connected: ${socket.id}`));
    socket.on("disconnect", () => console.log(`Disconnected`));
  }, []);

  useEffect(() => {
    if (status === "LOGGED_IN") socket.emit("loggedIn", id);
  }, [id, status]);

  return (
    <FileProvider>
      <TaskUploadsProvider>
        <RouterProvider router={router} />
      </TaskUploadsProvider>
    </FileProvider>
  );
}

export default App;
