"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { sampleArticles } from "../utils/sampleArticles";
import { Article } from "../utils/types";

type ArticlesAction =
  | { type: "ADD_ARTICLE"; article: Article }
  | { type: "REMOVE_ARTICLE"; id: string }
  | { type: "UPDATE_ARTICLE"; article: Article }
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_ARTICLES"; articles: Article[] }
  | {
      type: "SET_ARTICLES_LOADING";
      loading: boolean;
      articles: Article[];
      error: string | null;
    }
  | { type: "SHOW_ARTICLES_MODAL" }
  | { type: "HIDE_ARTICLES_MODAL" };

interface ArticlesContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  showArticlesModal: boolean;
  dispatch: React.Dispatch<ArticlesAction>;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(
  undefined
);

const articlesReducer = (
  state: ArticlesContextType,
  action: ArticlesAction
): ArticlesContextType => {
  switch (action.type) {
    case "ADD_ARTICLE":
      return { ...state, articles: [...state.articles, action.article] };
    case "REMOVE_ARTICLE":
      return {
        ...state,
        articles: state.articles.filter((article) => article.id !== action.id),
      };
    case "UPDATE_ARTICLE":
      return {
        ...state,
        articles: state.articles.map((article) =>
          article.id === action.article.id ? action.article : article
        ),
      };
    case "SET_ARTICLES":
      return {
        ...state,
        articles: action.articles,
      };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    case "SET_ERROR":
      return { ...state, error: action.error };
    case "SET_ARTICLES_LOADING":
      return {
        ...state,
        loading: action.loading,
        articles: action.articles,
        error: action.error,
      };
    case "SHOW_ARTICLES_MODAL":
      return {
        ...state,
        showArticlesModal: true,
      };
    case "HIDE_ARTICLES_MODAL":
      return {
        ...state,
        showArticlesModal: false,
      };
    default:
      return state;
  }
};

const initialState: ArticlesContextType = {
  articles: [],
  loading: false,
  error: null,
  showArticlesModal: false,
  dispatch: () => {},
};

const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(articlesReducer, initialState);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        dispatch({ type: "SET_LOADING", loading: true });
        await new Promise((resolve) => setTimeout(resolve, 1000));

        dispatch({
          type: "SET_ARTICLES_LOADING",
          loading: false,
          articles: sampleArticles,
          error: null,
        });
      } catch (error) {
        dispatch({
          type: "SET_ARTICLES_LOADING",
          loading: false,
          articles: [],
          error: "Error fetching articles",
        });
      }
    };

    fetchArticles();
  }, []);

  return (
    <ArticlesContext.Provider value={{ ...state, dispatch }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticlesProvider");
  }
  return context;
};

export { ArticlesProvider, ArticlesContext };
