import axios from "axios";
import { EventEmitter } from "events";

export const apiEvents = new EventEmitter();
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

// Create an axios instance for auth-related requests that don't need token
export const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Main API instance for authenticated requests
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
      const retryAfter = error.response.headers["retry-after"] || 60;
      apiEvents.emit("rateLimitExceeded", { retryAfter });
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

        if (response.data.token) {
          localStorage.setItem("jwt", response.data.token);
          localStorage.setItem("tokenTimestamp", Date.now().toString());

          // Update original request auth header
          originalRequest.headers["Authorization"] = `Bearer ${response.data.token}`;

          // Process queue with new token
          processQueue(null, response.data.token);

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
