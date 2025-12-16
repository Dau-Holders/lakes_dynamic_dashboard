import ArticleList from "./articleList";
import { useArticles } from "../contexts/articlesContext";
import { Dialog } from "primereact/dialog";
import AddArticleModal from "./addArticleModal";

export default function UserDashboard() {
  const { showArticlesModal, dispatch } = useArticles();

  function AddArticleModalTitle() {
    return (
      <div>
        <p>Add Article</p>
      </div>
    );
  }

  const modalHeader = AddArticleModalTitle;

  return (
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
  );
}
