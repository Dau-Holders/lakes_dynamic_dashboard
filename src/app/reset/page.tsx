"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { Messages } from "primereact/messages";
import { api } from "../lib/api";

interface ResetPasswordInterface {
  email: string;
}

export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInterface>();

  const [loading, setLoading] = useState(false);
  const messages = useRef<Messages>(null);

  async function onSubmit(data: ResetPasswordInterface) {
    setLoading(true);
    try {
      await api.post("/auth/users/reset_password/", data);

      if (messages.current) {
        messages.current.show([
          {
            severity: "success",
            detail: "Password reset email sent successfully.",
            sticky: true,
            closable: false,
          },
        ]);

        setTimeout(() => {
          messages.current?.clear();
        }, 5000);
      }
    } catch (error: AxiosError | any) {
      if (error.response?.data.detail && messages.current) {
        messages.current.show([
          {
            severity: "error",
            detail: error.response?.data.detail,
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
              Enter your email address to reset your password
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 mb-3">
              <InputText
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Please enter a valid email",
                  },
                })}
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className={`w-full p-inputtext-sm ${
                  errors.email && "p-invalid"
                }`}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
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
