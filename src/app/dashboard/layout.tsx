"use client";
import { ReactNode, useEffect, useState } from "react";
import { useAuthContext } from "../contexts/authContext";
import { useRouter } from "next/navigation";
import AppSideBar from "../components/sidebar";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white flex items-center justify-between border-b shadow-sm sticky top-0 z-10">
        <span className="font-bold text-xl">AGLA</span>
        <Button
          icon="pi pi-bars"
          className="p-button-text"
          onClick={() => setMobileSidebarVisible(true)}
        />
      </div>

      {/* Mobile Drawer */}
      <Sidebar
        visible={mobileSidebarVisible}
        onHide={() => setMobileSidebarVisible(false)}
        className="w-64 p-0"
      >
        <AppSideBar />
      </Sidebar>

      {/* Desktop Sidebar */}
      <div className="hidden md:block border-r border-gray-200">
        <AppSideBar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
