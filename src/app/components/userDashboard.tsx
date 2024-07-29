import ArticleList from "./articleList";
import { useArticles } from "../contexts/articlesContext";
import { Dialog } from "primereact/dialog";
import AddArticleModal from "./addArticleModal";
import AppSidebar from "./sidebar";
import { useState } from "react";
import AppMenuBar from "./appMenuBar";

export default function UserDashboard() {
  const { showArticlesModal, dispatch } = useArticles();
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  function AddArticleModalTitle() {
    return (
      <div>
        <p>Add Article</p>
      </div>
    );
  }

  const modalHeader = AddArticleModalTitle;

  return (
    <div className="flex">
      {showSidebar ? (
        <div className="">
          <AppSidebar />
        </div>
      ) : null}
      <div className="container mx-auto">
        <div className=" justify-end flex px-6">
          <AppMenuBar />
        </div>
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
