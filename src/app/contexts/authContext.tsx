import FullPageLoading from "../components/fullPageLoading";
import useRefreshToken from "../hooks/useRefreshToken";
import { api } from "../lib/api";
import { User } from "../utils/types";
import {
  useContext,
  createContext,
  ReactNode,
  useReducer,
  Dispatch,
  useEffect,
} from "react";

type AuthContextActions =
  | {
      type: "SET_USER";
      payload: User;
    }
  | { type: "REMOVE_USER" }
  | { type: "SET_LOADING"; payload: boolean };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  dispatch: Dispatch<AuthContextActions>;
}

const initialState: AuthContextType = {
  user: null,
  loading: true,
  dispatch: () => {},
};

const AuthContext = createContext<AuthContextType | undefined>(initialState);

function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider"
    );
  }
  return context;
}

function authContextReducer(
  state: AuthContextType,
  action: AuthContextActions
): AuthContextType {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "REMOVE_USER":
      return {
        ...state,
        user: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextProviderProps {
  children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [state, dispatch] = useReducer(authContextReducer, initialState);
  const { loading, user } = state;
  const privateApi = useRefreshToken();

  useEffect(() => {
    if (user) return;

    async function fetchUser() {
      try {
        dispatch({
          type: "SET_LOADING",
          payload: true,
        });

        const response = await privateApi.get("/profile/me/");
        const currentUser = response.data.profile;
        dispatch({
          type: "SET_USER",
          payload: currentUser,
        });
      } catch (error) {
        console.log(error);
        dispatch({
          type: "REMOVE_USER",
        });
      } finally {
        dispatch({
          type: "SET_LOADING",
          payload: false,
        });
      }
    }

    fetchUser();
  }, [user]);

  const value = {
    ...state,
    dispatch,
  };

  return (
    <>
      {loading ? (
        <FullPageLoading />
      ) : (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
      )}
    </>
  );
}

export { useAuthContext, AuthContextProvider };
