import { User } from "../utils/types";
import {
  useContext,
  createContext,
  ReactNode,
  useReducer,
  Dispatch,
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
  loading: false,
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

  const value = {
    ...state,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { useAuthContext, AuthContextProvider };
