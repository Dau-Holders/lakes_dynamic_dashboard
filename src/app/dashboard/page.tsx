"use client";
import UserDashboard from "../components/userDashboard";
import { useAuthContext } from "../contexts/authContext";

export default function Page() {
  const { user, loading } = useAuthContext();
  console.log({ user, loading });
  return <UserDashboard />;
}
