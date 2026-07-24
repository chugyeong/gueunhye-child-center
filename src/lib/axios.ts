import axios, { AxiosHeaders } from "axios";

const AUTH_TOKEN_STORAGE_KEY = "child-center.admin.access-token";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT ?? 10000),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers = AxiosHeaders.from(config.headers);

    if (!config.headers.has("Authorization")) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      const message = getApiErrorMessage(error.response?.data);

      if (message) {
        error.message = message;
      }

      if (error.response?.status === 401) {
        clearAuthToken();
      }
    }

    return Promise.reject(error);
  },
);

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function getApiErrorMessage(data: unknown) {
  if (!data || typeof data !== "object" || !("message" in data)) {
    return null;
  }

  const message = (data as { message?: unknown }).message;

  return typeof message === "string" ? message : null;
}
