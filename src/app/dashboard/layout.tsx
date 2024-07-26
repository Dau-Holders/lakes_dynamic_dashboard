"use client";
import { ReactNode, useEffect } from "react";
import { useAuthContext } from "../contexts/authContext";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);
  return <>{children}</>;
}
