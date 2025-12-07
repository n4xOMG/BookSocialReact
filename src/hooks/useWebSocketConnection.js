import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connectWebSocket, disconnectWebSocket, subscribeToChatMessages, isWebSocketConnected } from "../services/websocket.service";
import { fetchUserChats } from "../redux/chat/chat.action";
import { logInfo } from "../utils/errorLogger";

/**
 * Custom hook for managing WebSocket connection
 * Automatically connects/disconnects based on authentication state
 * Also subscribes to all user's chats for real-time message updates
 */
export const useWebSocketConnection = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { chats } = useSelector((state) => state.chat);
  const hasConnectedRef = useRef(false);
  const hasFetchedChatsRef = useRef(false);

  // Connect/disconnect based on auth state
  useEffect(() => {
    // Don't connect if not authenticated or no username
    if (!isAuthenticated || !user?.username) {
      disconnectWebSocket();
      hasConnectedRef.current = false;
      hasFetchedChatsRef.current = false;
      return undefined;
    }

    // Avoid duplicate connections
    if (hasConnectedRef.current) {
      return undefined;
    }

    logInfo(`Initializing WebSocket connection for user: ${user.username}`, "WebSocket");
    connectWebSocket(user.username);
    hasConnectedRef.current = true;

    // Fetch user chats to subscribe to them
    if (!hasFetchedChatsRef.current) {
      dispatch(fetchUserChats());
      hasFetchedChatsRef.current = true;
    }

    return () => {
      logInfo("Cleaning up WebSocket connection", "WebSocket");
      disconnectWebSocket();
      hasConnectedRef.current = false;
      hasFetchedChatsRef.current = false;
    };
  }, [isAuthenticated, user?.username, dispatch]);

  // Subscribe to chat messages when chats are loaded
  useEffect(() => {
    if (!isAuthenticated || !chats || chats.length === 0) {
      return;
    }

    // Wait a bit for WebSocket to be connected
    const timer = setTimeout(() => {
      if (isWebSocketConnected()) {
        const chatIds = chats.map((chat) => chat.id);
        subscribeToChatMessages(chatIds);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, chats]);
};

