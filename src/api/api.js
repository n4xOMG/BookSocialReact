import axios from "axios";
import { EventEmitter } from "events";
import { isTokenExpired } from "../utils/useAuthCheck";

export const apiEvents = new EventEmitter();
apiEvents.setMaxListeners(20);

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8181";

// ==============================================================================
// AUTH API - For authentication requests that don't need token
// ==============================================================================
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================================================================
// MAIN API - For authenticated requests with token refresh
// ==============================================================================
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

// Add request interceptor
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

// Add response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting
    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"] || error.response.headers["x-rate-limit-retry-after-seconds"] || 60;
      apiEvents.emit("rateLimitExceeded", {
        retryAfter: typeof retryAfter === "string" ? parseInt(retryAfter, 10) : retryAfter,
      });
      return Promise.reject(error);
    }

    // Handle authentication errors
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
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
        // Try to refresh token
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

        // Backend sends token in 'data' field: { message, success, data: token }
        const newToken = response.data?.data || response.data?.token;

        if (newToken) {
          localStorage.setItem("jwt", newToken);
          localStorage.setItem("tokenTimestamp", Date.now().toString());

          // Update original request auth header
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

          // Process queue with new token
          processQueue(null, newToken);

          return api(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token
        processQueue(refreshError, null);

        // Redirect to login if needed
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

// ==============================================================================
// HTTP CLIENT - Alternative client with token expiry check (no auto-refresh)
// ==============================================================================
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

    if (!useAuth) {
      delete config.headers.Authorization;
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

// Default export for backward compatibility (was apiClient)
export default httpClient;
