"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { sampleArticles } from "../utils/sampleArticles";
import { Article, User } from "../utils/types";
import useRefreshToken from "../hooks/useRefreshToken";
import { useAuthContext } from "./authContext";

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
  | { type: "HIDE_ARTICLES_MODAL" }
  | { type: "ADD_USER"; user: User }
  | { type: "REMOVE_USER" };

interface ArticlesContextType {
  articles: Article[];
  loading: boolean;
  error: string | null;
  showArticlesModal: boolean;
  currentUser: null | User;
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
    case "ADD_USER":
      return {
        ...state,
        currentUser: action.user,
      };
    case "REMOVE_USER":
      return {
        ...state,
        currentUser: null,
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
  currentUser: null,
  dispatch: () => {},
};

const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(articlesReducer, initialState);
  const privateApi = useRefreshToken();
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) return;
    const fetchArticles = async () => {
      try {
        dispatch({ type: "SET_LOADING", loading: true });
        const response = await privateApi.get("/publications/me/");
        console.log("Articles response data", response.data);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({
          type: "SET_ARTICLES_LOADING",
          loading: false,
          articles: response.data,
          error: null,
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "SET_ARTICLES_LOADING",
          loading: false,
          articles: [],
          error: "Error fetching articles",
        });
      }
    };

    fetchArticles();
  }, [user]);

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
