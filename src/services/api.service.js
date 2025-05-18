import axios from "axios";

// Create an event emitter for rate limit events
export const apiEvents = {
  listeners: {},

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  },

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  },

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  },
};

// API client setup
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add response interceptor to handle rate limiting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      // Extract retry-after information
      const retryAfter = error.response.headers["x-rate-limit-retry-after-seconds"];

      // Emit rate limit event
      apiEvents.emit("rateLimitExceeded", {
        retryAfter: retryAfter ? parseInt(retryAfter, 10) : null,
      });
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
