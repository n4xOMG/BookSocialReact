import { useState, useEffect } from "react";
import { apiEvents } from "../api/api";

/**
 * Custom hook for handling rate limit alerts
 * Listens to API rate limit events and manages alert state
 */
export const useRateLimitAlert = () => {
  const [rateLimitAlert, setRateLimitAlert] = useState({
    open: false,
    retryAfter: null,
  });

  useEffect(() => {
    const handleRateLimit = (data) => {
      setRateLimitAlert({
        open: true,
        retryAfter: data.retryAfter,
      });
    };

    apiEvents.on("rateLimitExceeded", handleRateLimit);

    return () => {
      apiEvents.off("rateLimitExceeded", handleRateLimit);
    };
  }, []);

  const handleClose = () => {
    setRateLimitAlert((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    rateLimitAlert,
    handleCloseRateLimitAlert: handleClose,
  };
};
