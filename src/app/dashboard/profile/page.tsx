"use client";

import { Menubar } from "primereact/menubar";

import UserForm from "@/app/components/userForm";

export default function Page() {
  return (
    <div className="container mx-auto">
        <div className=" justify-end flex px-6">
        </div>
        <UserForm />
    </div>
  );
}
