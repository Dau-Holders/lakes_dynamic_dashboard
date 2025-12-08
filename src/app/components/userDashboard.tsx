import ArticleList from "./articleList";
import { useArticles } from "../contexts/articlesContext";
import { Dialog } from "primereact/dialog";
import AddArticleModal from "./addArticleModal";
import AppSidebar from "./sidebar";
import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";


export default function UserDashboard() {
  const { showArticlesModal, dispatch } = useArticles();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  function AddArticleModalTitle() {
    return (
      <div>
        <p>Add Article</p>
      </div>
    );
  }

  const modalHeader = AddArticleModalTitle;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden p-4 bg-white flex items-center justify-between border-b shadow-sm">
        <span className="font-bold text-xl">AGLA Dashboard</span>
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
        <AppSidebar />
      </Sidebar>

      {/* Desktop Sidebar */}
      {showSidebar && (
        <div className="hidden md:block border-r border-gray-200">
          <AppSidebar />
        </div>
      )}
      <div className="container mx-auto">

        <ArticleList />
        <Dialog
          visible={showArticlesModal}
          className="w-[95%] sm:max-w-md md:max-w-lg"
          onHide={() => dispatch({ type: "HIDE_ARTICLES_MODAL" })}
          header={modalHeader}
        >
          <AddArticleModal />
        </Dialog>
      </div>
    </div>
  );
}
