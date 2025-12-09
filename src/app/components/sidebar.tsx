import React from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { useArticles } from "../contexts/articlesContext";
import { Dialog } from "primereact/dialog";
import AddArticleModal from "./addArticleModal";
import { useAuthContext } from "../contexts/authContext";
import { api, logout } from "../lib/api";
import { Avatar } from "primereact/avatar";

export default function AppSideBar() {
  const { dispatch, showArticlesModal } = useArticles();
  const { dispatch: authDispatch, user } = useAuthContext();
  const router = useRouter();

  const items: MenuItem[] = [
    {
      template: () => {
        return (
          <span className="inline-flex align-items-center gap-1 px-2 py-2">
            <span className="font-medium text-xl">AGLA</span>
          </span>
        );
      },
    },
    {
      separator: true,
    },
    {
      label: "Publications",
      items: [

        {
          label: "Publications",
          icon: "pi pi-file",
          command: () => {
            router.push("/dashboard/articles");
          },
        },
        {
          label: "Metadata",
          icon: "pi pi-list",
          command: () => {
            router.push("/dashboard/metadata");
          },
        },
        {
          label: "Projects",
          icon: "pi pi-briefcase",
          command: () => {
            router.push("/dashboard/projects");
          },
        },
        {
          label: "Photo Gallery",
          icon: "pi pi-images",
          command: () => {
            router.push("/dashboard/photos");
          },
        },
      ],
    },
    {
      label: "Profile",
      items: [
        {
          label: "Profile",
          icon: "pi pi-user",
          command: () => {
            router.push("/dashboard/profile");
          },
        },
        // {
        //   label: "Security",
        //   icon: "pi pi-cog",
        //   command: () => {
        //     router.push("/dashboard/security");
        //   },
        // },
        // {
        //   label: "Contact",
        //   icon: "pi pi-envelope",
        //   command: () => {
        //     router.push("/dashboard/contact");
        //   },
        // },
      ],
    },
    {
      label: "Logout",
      items: [
        {
          label: "Logout",
          icon: "pi pi-sign-out",
          command: async () => {
            console.log("Logging Out");
            await api.post("/auth/logout/");
            authDispatch({
              type: "REMOVE_USER",
            });
          },
        },
      ],
    },
  ];

  function AddArticleModalTitle() {
    return (
      <div>
        <p>Add Article</p>
      </div>
    );
  }

  const modalHeader = AddArticleModalTitle;

  return (
    <div className="h-screen min-w-64 bg-white flex flex-col justify-between overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <Menu model={items} className="w-full md:w-15rem border-none" />
      </div>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <Avatar 
            image={user?.photo || undefined}
            label={!user?.photo ? (user?.first_name?.charAt(0) || user?.email?.charAt(0)) : undefined} 
            icon={!user?.photo && !user?.first_name ? "pi pi-user" : undefined} 
            className="p-overlay-badge" 
            shape="circle" 
            size="normal"
            style={{ backgroundColor: user?.photo ? 'transparent' : '#2196F3', color: '#ffffff' }}
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-sm truncate text-gray-900">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-gray-500 truncate mt-0.5">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
