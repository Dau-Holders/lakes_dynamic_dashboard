import React from "react";
import { Menu } from "primereact/menu";
import { MenuItem } from "primereact/menuitem";
import { useRouter } from "next/navigation";
import { useArticles } from "../contexts/articlesContext";
import { Dialog } from "primereact/dialog";
import AddArticleModal from "./addArticleModal";
import { useAuthContext } from "../contexts/authContext";
import { api, logout } from "../lib/api";

export default function AppSideBar() {
  const { dispatch, showArticlesModal } = useArticles();
  const router = useRouter();
  const { dispatch: authDispatch } = useAuthContext();

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
      label: "Documents",
      items: [
        {
          label: "Add Article",
          icon: "pi pi-plus",
          command: () => {
            console.log("Button Clicked");
            dispatch({
              type: "SHOW_ARTICLES_MODAL",
            });
          },
        },
        {
          label: "Articles",
          icon: "pi pi-file",
          command: () => {
            router.push("/dashboard/articles");
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
        {
          label: "Security",
          icon: "pi pi-cog",
          command: () => {
            router.push("/dashboard/security");
          },
        },
        {
          label: "Contact",
          icon: "pi pi-envelope",
          command: () => {
            router.push("/dashboard/contact");
          },
        },
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
    <div className="min-h-screen min-w-64 bg-white">
      <Menu model={items} className="w-full md:w-15rem border-none" />
      <Dialog
        visible={showArticlesModal}
        className="w-[95%] sm:max-w-md md:max-w-lg"
        onHide={() => dispatch({ type: "HIDE_ARTICLES_MODAL" })}
        header={modalHeader}
      >
        <AddArticleModal />
      </Dialog>
    </div>
  );
}
