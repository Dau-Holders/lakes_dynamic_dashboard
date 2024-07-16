"use client";

import { Menubar } from "primereact/menubar";
import AppSideBar from "../components/sidebar";
import AppMenuBar from "../components/appMenuBar";
import UserForm from "../components/userForm";

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
