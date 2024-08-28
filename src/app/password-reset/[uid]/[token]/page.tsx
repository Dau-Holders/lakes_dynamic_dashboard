"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { Messages } from "primereact/messages";

import { useRouter } from "next/navigation";
import { api } from "@/app/lib/api";

interface ResetPasswordInterface {
  new_password: string;
}

export default function Page({
  params,
}: {
  params: { uid: string; token: string };
}) {
  const router = useRouter();
  const messages = useRef<Messages>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInterface>();

  console.log(params);

  async function onSubmit(data: ResetPasswordInterface) {
    setLoading(true);
    try {
      await api.post("/auth/users/reset_password_confirm/", {
        uid: params.uid,
        token: params.token,
        new_password: data.new_password,
      });

      if (messages.current) {
        messages.current.show([
          {
            severity: "success",
            detail: "Password has been reset successfully.",
            sticky: true,
            closable: false,
          },
        ]);

        setTimeout(() => {
          messages.current?.clear();
          router.push("/");
        }, 5000);
      }
    } catch (error: AxiosError | any) {
      console.log(error.response);
      if (error.response?.data.new_password && messages.current) {
        messages.current.show([
          {
            severity: "error",
            detail: error.response?.data.new_password,
            sticky: true,
            closable: false,
          },
        ]);

        setTimeout(() => {
          messages.current?.clear();
        }, 5000);
      } else {
        messages.current?.show([
          {
            severity: "error",
            detail: "An unexpected error occurred. Please try again.",
            sticky: true,
            closable: false,
          },
        ]);

        setTimeout(() => {
          messages.current?.clear();
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen max-h-screen max-w-[100%] p-4 gradient-bg">
      <div className="w-full max-w-md lg:max-w-lg p-4 lg:p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded md:shadow-md w-full lg:w-[450px] p-8 md:p-10"
        >
          <Messages ref={messages} />
          <div className="mb-8">
            <h1 className="text-medium mt-2 font-semibold">Reset Password</h1>
            <p className="text-[#757575] text-sm mt-1">
              Enter your new password to reset your account password.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 mb-3">
              <InputText
                {...register("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must have at least 8 characters",
                  },
                })}
                id="new_password"
                name="new_password"
                type="password"
                placeholder="New Password"
                className={`w-full p-inputtext-sm ${
                  errors.new_password && "p-invalid"
                }`}
              />
              {errors.new_password && (
                <small className="p-error">{errors.new_password.message}</small>
              )}
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              style={{ width: "100%" }}
              type="submit"
              size="small"
              disabled={loading}
            >
              <div className="flex w-full justify-center">
                {loading ? (
                  <i className="pi pi-spin pi-spinner"></i>
                ) : (
                  <p className="text-center">Reset Password</p>
                )}
              </div>
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
