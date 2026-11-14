"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { AxiosError } from "axios";
import { Messages } from "primereact/messages";
import { api } from "@/app/lib/api";
import { isBadLinkError, parseAPIError } from "@/app/utils/errorHandling";
import { showMessage } from "@/app/utils/showMessage";

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const messages = useRef<Messages>(null);
  // Activation tokens are single-use; guard against React strict-mode double effects.
  const activationRequested = useRef(false);

  useEffect(() => {
    if (!params.uid || !params.token || activationRequested.current) return;
    activationRequested.current = true;

    showMessage(messages, "info", "Activating your account. Please wait...");

    api
      .post("/auth/users/activation/", {
        uid: params.uid,
        token: params.token,
      })
      .then(() => {
        showMessage(
          messages,
          "success",
          "Account activated successfully. Redirecting to login page..."
        );
        setTimeout(() => router.push("/"), 3000);
      })
      .catch((error: AxiosError) => {
        const parsed = parseAPIError(error);
        // Djoser returns 403 "Stale token" when the account is already active.
        if (parsed.status === 403) {
          showMessage(
            messages,
            "info",
            "This account is already activated. Redirecting to login page..."
          );
          setTimeout(() => router.push("/"), 3000);
          return;
        }
        showMessage(
          messages,
          "error",
          isBadLinkError(parsed)
            ? "This activation link is invalid or has expired. Please check your email for the correct link."
            : parsed.message
        );
        setTimeout(() => router.push("/"), 10000);
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
