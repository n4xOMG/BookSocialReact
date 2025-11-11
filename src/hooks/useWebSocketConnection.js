import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { connectWebSocket, disconnectWebSocket } from "../services/websocket.service";
import { logInfo } from "../utils/errorLogger";

/**
 * Custom hook for managing WebSocket connection
 * Automatically connects/disconnects based on authentication state
 */
export const useWebSocketConnection = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    // Don't connect if not authenticated or no username
    if (!isAuthenticated || !user?.username) {
      disconnectWebSocket();
      hasConnectedRef.current = false;
      return undefined;
    }

    // Avoid duplicate connections
    if (hasConnectedRef.current) {
      return undefined;
    }

    logInfo(`Initializing WebSocket connection for user: ${user.username}`, "WebSocket");
    connectWebSocket(user.username);
    hasConnectedRef.current = true;

    return () => {
      logInfo("Cleaning up WebSocket connection", "WebSocket");
      disconnectWebSocket();
      hasConnectedRef.current = false;
    };
  }, [isAuthenticated, user?.username]);
};
