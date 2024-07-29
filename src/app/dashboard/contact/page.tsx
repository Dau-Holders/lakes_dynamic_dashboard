"use client";

import AppMenuBar from "@/app/components/appMenuBar";
import ContactUsForm from "@/app/components/contactUsForm";
import AppSideBar from "@/app/components/sidebar";

export default function Page() {
  return (
    <div className="flex">
      <AppSideBar />
      <div className="w-full">
        <div className="flex justify-end px-6">
          <AppMenuBar />
        </div>
        <ContactUsForm />
      </div>
    </div>
  );
}
