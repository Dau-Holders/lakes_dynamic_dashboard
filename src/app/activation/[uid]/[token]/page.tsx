"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { AxiosError } from "axios";
import { Messages } from "primereact/messages";
import { api } from "@/app/lib/api";
import { parseAPIError } from "@/app/utils/errorHandling";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const messages = useRef<Messages>(null);
  // Activation tokens are single-use; guard against React strict-mode double effects.
  const started = useRef(false);

  useEffect(() => {
    if (!params.uid || !params.token || started.current) return;
    started.current = true;

    messages.current?.clear();
    messages.current?.show([
      {
        severity: "info",
        detail: "Activating your account. Please wait...",
        sticky: true,
        closable: false,
      },
    ]);

    api
      .post("/auth/users/activation/", {
        uid: params.uid,
        token: params.token,
      })
      .then(() => {
        messages.current?.clear();
        messages.current?.show([
          {
            severity: "success",
            detail: "Account activated successfully. Redirecting to login page...",
            sticky: true,
            closable: false,
          },
        ]);
        setTimeout(() => router.push("/"), 3000);
      })
      .catch((error: AxiosError) => {
        const { message, fieldErrors, status } = parseAPIError(error);
        let detail = message;
        if (status === 403) {
          // Djoser returns 403 "Stale token" when the account is already active.
          detail = "This account is already activated. Redirecting to login page...";
        } else if ("uid" in fieldErrors || "token" in fieldErrors) {
          detail =
            "This activation link is invalid or has expired. Please check your email for the correct link.";
        }
        messages.current?.clear();
        messages.current?.show([
          {
            severity: status === 403 ? "info" : "error",
            detail,
            sticky: true,
            closable: true,
          },
        ]);
        setTimeout(() => router.push("/"), status === 403 ? 3000 : 10000);
      });
  }, [params, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <Messages ref={messages} />
      </div>
    </div>
  );
}
