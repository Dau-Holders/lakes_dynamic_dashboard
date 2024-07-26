"use client";
import { useEffect } from "react";
import Login from "./components/login";
import { useAuthContext } from "./contexts/authContext";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);
  return <Login />;
}
