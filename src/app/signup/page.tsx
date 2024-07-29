"use client";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Link from "next/link";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useState } from "react";

import { useForm } from "react-hook-form";
import { useRef } from "react";
import { Messages } from "primereact/messages";
import { AxiosError } from "axios";
import { api } from "../lib/api";

interface SignUpInterface {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  re_password: string;
}

export default function Page() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setError,
  } = useForm<SignUpInterface>();

  const [loading, setLoading] = useState(false);

  const password = watch("password");
  const messages = useRef(null);

  async function onSubmit(data: SignUpInterface) {
    setLoading(true);
    try {
      const response = await api.post("/auth/users/", data);
      console.log(response.data);
      reset();
      // messages.current?.show([
      //   {
      //     severity: "info",
      //     detail: `Registration successful! Click the link sent to ${data.email} to activate your account`,
      //     sticky: true,
      //     closable: false,
      //   },
      // ]);
      // setTimeout(() => messages.current?.clear(), 10000);
    } catch (error: AxiosError | any) {
      if (error.response?.data) {
        const serverErrors = error.response.data;
        Object.keys(serverErrors).forEach((field) => {
          const messages = serverErrors[field];
          messages.forEach((message: string) => {
            setError(field as keyof SignUpInterface, {
              type: "server",
              message,
            });
          });
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen gradient-bg">
      <div className="w-full max-w-md lg:max-w-lg p-4 lg:p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 md:p-10 rounded-lg shadow-md w-full lg:w-[450px]"
        >
          <Messages ref={messages} />
          <div className="text-center mb-4 flex justify-center items-center gap-2"></div>
          <div className="mb-8">
            <h1 className="text-medium mt-2 font-semibold">Register</h1>
            <p className="text-[#757575] text-sm mt-1">Create a new account</p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 mb-4">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-user"> </InputIcon>
                <InputText
                  {...register("username", {
                    required: "Username is required",
                  })}
                  id="username"
                  name="username"
                  type="text"
                  placeholder="User Name"
                  className={`w-full p-inputtext-sm ${
                    errors.username && "p-invalid"
                  }`}
                />
              </IconField>
              {errors.username && (
                <small className="p-error">{errors.username.message}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-user"> </InputIcon>
                <InputText
                  {...register("first_name", {
                    required: "First name is required",
                  })}
                  id="first_name"
                  name="first_name"
                  type="text"
                  placeholder="First Name"
                  className={`w-full p-inputtext-sm ${
                    errors.first_name && "p-invalid"
                  }`}
                />
              </IconField>
              {errors.first_name && (
                <small className="p-error">{errors.first_name.message}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-4">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-user"> </InputIcon>
                <InputText
                  {...register("last_name", {
                    required: "Last name is required",
                  })}
                  id="last_name"
                  name="last_name"
                  type="text"
                  placeholder="Last Name"
                  className={`w-full p-inputtext-sm ${
                    errors.last_name && "p-invalid"
                  }`}
                />
              </IconField>
              {errors.last_name && (
                <small className="p-error">{errors.last_name.message}</small>
              )}
            </div>
            <div className="flex flex-col gap-2 mb-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-envelope"> </InputIcon>
                <InputText
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Entered value does not match email format",
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
            <div className="flex flex-col gap-2 mb-3">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-lock"> </InputIcon>
                <InputText
                  {...register("re_password", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                  id="re_password"
                  name="re_password"
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full p-inputtext-sm ${
                    errors.re_password && "p-invalid"
                  }`}
                />
              </IconField>
              {errors.re_password && (
                <small className="p-error">{errors.re_password.message}</small>
              )}
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button type="submit" size="small" disabled={loading}>
              <div className="flex w-full justify-center">
                {loading ? (
                  <i className="pi pi-spin pi-spinner"></i>
                ) : (
                  <p className="text-center">Sign Up</p>
                )}
              </div>
            </Button>
          </div>
          <div className="mt-4">
            <span className="text-gray-600 text-sm">
              Already have an account?{" "}
            </span>
            <Link href="/">
              <span className="text-blue-600 text-sm hover:underline">
                Log in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
