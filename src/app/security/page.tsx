"use client";
import AppMenuBar from "../components/appMenuBar";
import ChangePasswordForm from "../components/changePassword";
import ContactUsForm from "../components/contactUsForm";
import AppSideBar from "../components/sidebar";

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
