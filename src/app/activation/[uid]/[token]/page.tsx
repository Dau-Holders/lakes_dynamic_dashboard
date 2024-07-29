"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { AxiosError } from "axios";
import { Messages } from "primereact/messages";
import { api } from "@/app/lib/api";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const messages = useRef(null);

  useEffect(() => {
    console.log(params);
    if (!params.uid || !params.token) return;
    console.log(params.uid, params.token);
    // messages.current?.clear();
    // messages.current?.show([
    //   {
    //     severity: "info",
    //     detail: "Activating your account. Please wait..",
    //     sticky: true,
    //     closable: false,
    //   },
    // ]);
    api
      .post("/auth/users/activation/", params)
      .then((response) => {
        // messages.current?.clear();
        // messages.current?.show([
        //   {
        //     severity: "success",
        //     detail:
        //       "Account activated successfully. Redirecting to login page...",
        //     sticky: true,
        //     closable: false,
        //   },
        // ]);
        setTimeout(() => router.push("/"), 3000);
      })
      .catch((error: AxiosError) => {
        console.log(error.response?.data);
        // messages.current?.clear();
        // messages.current?.show([
        //   {
        //     severity: "error",
        //     detail:
        //       "Account activation failed. Please check your email for the correct activation link",
        //     sticky: true,
        //     closable: false,
        //   },
        // ]);
        setTimeout(() => router.push("/"), 10000);
      });
  }, [params]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <Messages ref={messages} />
      </div>
    </div>
  );
}
