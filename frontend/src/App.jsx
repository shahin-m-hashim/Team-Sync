import Test from "./pages/Test";
import HomePage from "./pages/HomePage";
import ErrorPage from "./pages/ErrorPage";
import DummyPage from "./pages/DummyPage";
import DummyUserPage from "./pages/DummyPage";
import LoginPage from "./pages/auth/LoginPage";
import Teams from "./components/dashBody/Teams";
import Tasks from "./components/dashBody/Tasks";
import SignupPage from "./pages/auth/SignUpPage";
import PublicProfile from "./pages/PublicProfile";
import UserDashboard from "./pages/UserDashboard";
import UserProvider from "./providers/UserProvider";
import FileProvider from "./providers/FileProvider";
import ErrorProvider from "./providers/ErrorProvider";
import Projects from "./components/dashBody/Projects";
import SubTeams from "./components/dashBody/SubTeams";
import TeamSettings from "./pages/settings/TeamSettings";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProjectSettings from "./pages/settings/ProjectSettings";
import SubTeamSettings from "./pages/settings/SubTeamSettings";
import UserSettingsPage from "./pages/settings/UserSettingsPage";
import SecuritySettingsPage from "./pages/settings/SecuritySettingsPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ProjectProvider from "./providers/ProjectProvider";
import InvitationsProvider from "./providers/InvitationsProvider";

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
        <InvitationsProvider>
          <Outlet />
        </InvitationsProvider>
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
          <UserDashboard>
            <Outlet />
          </UserDashboard>
        ),
        children: [
          {
            index: true,
            element: <DummyUserPage />,
          },
          {
            path: "projects",
            element: (
              <ProjectProvider>
                <Projects />
              </ProjectProvider>
            ),
          },
          {
            path: "teams",
            element: <Teams />,
          },
          {
            path: "subteams",
            element: <SubTeams />,
          },
          {
            path: "tasks",
            element: <Tasks />,
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
