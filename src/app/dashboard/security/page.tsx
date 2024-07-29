"use client";

import AppSideBar from "@/app/components/sidebar";
import AppMenuBar from "@/app/components/appMenuBar";
import ChangePasswordForm from "@/app/components/changePassword";

export default function Page() {
  return (
    <div className="flex">
      <AppSideBar />
      <div className="w-full">
        <div className="flex justify-end px-6">
          <AppMenuBar />
        </div>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
