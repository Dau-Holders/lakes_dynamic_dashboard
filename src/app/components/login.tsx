"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Link from "next/link";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { AxiosError } from "axios";
import { Messages } from "primereact/messages";
import { useRouter } from "next/navigation";
import { api } from "../lib/api";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuthContext } from "../contexts/authContext";

interface LoginInterface {
  email: string;
  password: string;
}

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const messages = useRef(null);
  const privateApi = useRefreshToken();
  const { dispatch } = useAuthContext();

  async function onSubmit(data: LoginInterface) {
    setLoading(true);
    try {
      await api.post("/auth/jwt/create/", data);
      const userResponse = await privateApi.get("/profile/me/");
      console.log(userResponse.data.profile);
      dispatch({
        type: "SET_USER",
        payload: userResponse.data?.profile,
      });
    } catch (error: AxiosError | any) {
      if (error.response?.data.detail) {
        // messages.current?.show([
        //   {
        //     severity: "info",
        //     detail: error.response?.data.detail,
        //     sticky: true,
        //     closable: false,
        //   },
        // ]);

        setTimeout(() => {
          // messages.current?.clear();
        }, 5000);
      } else {
        // messages.current?.show([
        //   {
        //     severity: "info",
        //     detail: "An unexpected error occurred. Please try again.",
        //     sticky: true,
        //     closable: false,
        //   },
        // ]);

        setTimeout(() => {
          // messages.current?.clear();
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen p-4 gradient-bg">
      <div className="w-full max-w-md lg:max-w-lg p-4 lg:p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded shadow-md w-full lg:w-[450px] p-8 md:p-10 "
        >
          <Messages ref={messages} />
          <div className="text-center mb-4 flex justify-center items-center gap-2"></div>
          <div className="mb-8">
            <h1 className="text-medium mt-2 font-semibold">Log In</h1>
            <p className="text-[#757575] text-sm mt-1">
              Log in to access your account
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 mb-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-envelope"> </InputIcon>
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
              </IconField>
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-lock"> </InputIcon>
                <InputText
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  className={`w-full p-inputtext-sm ${
                    errors.password && "p-invalid"
                  }`}
                />
              </IconField>
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
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
                  <p className="text-center">Log in</p>
                )}
              </div>
            </Button>
          </div>
          <div className="mt-4">
            <span className="text-gray-600 text-sm">
              Don't have an account?{" "}
            </span>
            <Link href="/signup">
              <span className="text-blue-600 text-sm hover:underline">
                Sign Up
              </span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
