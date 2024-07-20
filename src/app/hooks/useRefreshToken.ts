import { privateApi } from "@/app/lib/api";
import { useAuthContext } from "../contexts/authContext";

export default function useRefreshToken() {
  const { dispatch } = useAuthContext();
  privateApi.interceptors.response.use(
    (response) => {
      console.log("Response from interceptors", response);
      return response;
    },

    async (error) => {
      console.log("Error from interceptor", error);
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        try {
          const newTokenResponse = await privateApi.post(
            "/auth/jwt/refresh/",
            {}
          );
          console.log(
            "Token response from interceptor, when errored",
            newTokenResponse
          );
          return privateApi(originalRequest);
        } catch (error) {
          console.log("Token fetching error from interceptor", error);
          privateApi.post("/auth/logout/", {});
          dispatch({
            type: "REMOVE_USER",
          });
        }
      }
      return Promise.reject(error);
    }
  );

  return privateApi;
}
