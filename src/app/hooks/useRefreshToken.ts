import { api, privateApi } from "@/app/lib/api";
import { useAuthContext } from "../contexts/authContext";

export default function useRefreshToken() {
  const { dispatch } = useAuthContext();
  privateApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
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
          return privateApi(originalRequest);
        } catch (error) {
          await api.post("/auth/logout/");
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
