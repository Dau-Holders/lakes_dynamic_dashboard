"use client";

import { Menubar } from "primereact/menubar";

import UserForm from "@/app/components/userForm";
import AppMenuBar from "@/app/components/appMenuBar";
import AppSideBar from "@/app/components/sidebar";

export default function Page() {
  return (
    <div className="flex">
      <AppSideBar />
      <div className="container mx-auto">
        <div className=" justify-end flex px-6">
          <AppMenuBar />
        </div>
        <UserForm />
      </div>
    </div>
  );
}
