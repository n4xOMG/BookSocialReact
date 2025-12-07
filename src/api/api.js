import axios from "axios";
import { EventEmitter } from "events";
import { isTokenExpired } from "../utils/useAuthCheck";

export const apiEvents = new EventEmitter();
apiEvents.setMaxListeners(20);

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8181";

// AUTH API - For authentication requests that don't need token
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// MAIN API - For authenticated requests with token refresh
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Store pending requests that need to be retried after token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || error.response.headers["x-rate-limit-retry-after-seconds"] || 60;
      apiEvents.emit("rateLimitExceeded", {
        retryAfter: typeof retryAfter === "string" ? parseInt(retryAfter, 10) : retryAfter,
      });
      return Promise.reject(error);
    }

    // Handle banned/suspended account errors (403)
    if (error.response && error.response.status === 403) {
      const errorMessage = error.response.data?.message || "";
      if (errorMessage.includes("banned") || errorMessage.includes("suspended")) {
        apiEvents.emit("accountRestricted", {
          message: errorMessage,
          isBanned: errorMessage.toLowerCase().includes("banned"),
          isSuspended: errorMessage.toLowerCase().includes("suspended"),
        });
        localStorage.removeItem("jwt");
        localStorage.removeItem("tokenTimestamp");
      }
      return Promise.reject(error);
    }


    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = localStorage.getItem("jwt");
        const rememberMe = localStorage.getItem("rememberMe") === "true";

        if (!rememberMe || !token) {
          throw new Error("No refresh available");
        }

        const response = await authApi.post(
          "/auth/refresh-token",
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const newToken = response.data?.data || response.data?.token;

        if (newToken) {
          localStorage.setItem("jwt", newToken);
          localStorage.setItem("tokenTimestamp", Date.now().toString());

          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          processQueue(null, newToken);

          return api(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        if (window.location.pathname !== "/sign-in") {
          localStorage.removeItem("jwt");
          localStorage.removeItem("tokenTimestamp");
          window.location.href = "/sign-in";
        }
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


// HTTP CLIENT - Alternative client with token expiry check (no auto-refresh)
const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle rate limiting
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || error.response.headers["x-rate-limit-retry-after-seconds"] || 60;
      apiEvents.emit("rateLimitExceeded", {
        retryAfter: typeof retryAfter === "string" ? parseInt(retryAfter, 10) : retryAfter,
      });
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token
httpClient.interceptors.request.use(
  (config) => {
    if (!config) {
      return config;
    }

    const useAuth = config.useAuth !== false;
    if (!config.headers) {
      config.headers = {};
    }

    const hasCustomAuthHeader = Object.prototype.hasOwnProperty.call(config.headers, "Authorization");

    if (!useAuth) {
      if (!hasCustomAuthHeader) {
        delete config.headers.Authorization;
      }
      delete config.useAuth;
      return config;
    }

    if (hasCustomAuthHeader) {
      delete config.useAuth;
      return config;
    }

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("jwt") : null;
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    } catch (err) {
      delete config.headers.Authorization;
    }

    delete config.useAuth;
    return config;
  },
  (error) => Promise.reject(error)
);

export default httpClient;
