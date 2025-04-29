import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";
import axios from "axios";

export const useAxios = () => {
  const { getToken } = useAuth();

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL:
        import.meta.env.MODE === "development"
          ? "http://localhost:3000/api"
          : "/api",
    });

    instance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return instance;
  }, [getToken]);

  return axiosInstance;
};
