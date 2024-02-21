import { useContext } from "react";
import { authContext } from "@/contexts/authContext";

export default function DashboardPage() {
  const { user, logout } = useContext(authContext);
  return (
    <>
      <h1>Welcome to Your Dashboard {user.username}</h1>;
      <button onClick={logout}>LogOut</button>
    </>
  );
}
