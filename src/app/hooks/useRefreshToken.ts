import { useEffect } from "react";
import { api, privateApi } from "@/app/lib/api";
import { useAuthContext } from "../contexts/authContext";

export default function useRefreshToken() {
  const { dispatch } = useAuthContext();

  useEffect(() => {
    // Add interceptor only once when hook mounts
    const interceptor = privateApi.interceptors.response.use(
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
            await privateApi.post("/auth/jwt/refresh/", {});
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

    // Cleanup: eject interceptor when component unmounts
    return () => {
      privateApi.interceptors.response.eject(interceptor);
    };
  }, [dispatch]);

  return privateApi;
}
