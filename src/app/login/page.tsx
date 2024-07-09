"use client";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { FormEvent } from "react";
import { PrimeIcons } from "primereact/api";
import { Divider } from "primereact/divider";
import Link from "next/link";

export default function Page() {
  function handleLogin(event: FormEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log({ email, password });
  }

  return (
    <main className="flex justify-center items-center min-h-screen p-4">
      <div className="w-full max-w-md lg:max-w-lg p-4 lg:p-0">
        <form
          onSubmit={handleLogin}
          className="bg-white p-4 rounded shadow-md w-full lg:w-[450px]"
        >
          <div className="text-center mb-4 flex justify-center items-center gap-2">
            <Link href="/">
              <i
                className={`pi ${PrimeIcons.HOME} text-xl cursor-pointer font-extralight`}
              ></i>
            </Link>
          </div>
          <div className="text-center mb-4">
            <p className="text-medium mt-2">Log into your account</p>
          </div>
          <Divider />
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="email">Email</label>
              <InputText id="email" name="email" type="email" required />
            </div>
            <div className="flex flex-col gap-4">
              <label htmlFor="password">Password</label>
              <InputText
                id="password"
                name="password"
                type="password"
                required
              />
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button style={{ width: "100%" }} label="Submit" type="submit" />
          </div>
          <div className="mt-4 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/signup">
              <span className="text-blue-600 hover:underline">Sign Up</span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
