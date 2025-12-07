import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api/api";
import { receiveNotification } from "../redux/notification/notification.action";
import { RECEIVE_MESSAGE } from "../redux/chat/chat.actionType";
import { store } from "../redux/store";
import { createLogger } from "../utils/logger";

const logger = createLogger("WebSocket");

let stompClient = null;
let notificationSubscription = null;
let chatSubscriptions = {}; // Map of chatId -> subscription
let isConnecting = false;
let reconnectTimer = null;
let activeUsername = null;

export const connectWebSocket = (username) => {
  if (!username || isConnecting) return null;

  // Save username for reconnection purposes
  activeUsername = username;

  try {
    // Clear any existing reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    // Clean up any existing connection first
    disconnectWebSocket();

    isConnecting = true;

    const socket = new SockJS(`${API_BASE_URL}/ws`);
    stompClient = Stomp.over(socket);

    // Connect with better error handling
    stompClient.connect(
      {},
      () => {
        logger.success("Connected successfully");
        isConnecting = false;

        // Subscribe to the user's notification channel
        const topic = `/user/${username}/notifications`;
        notificationSubscription = stompClient.subscribe(topic, (message) => {
          try {
            const notification = JSON.parse(message.body);
            logger.info("New notification received", notification);

            // Dispatch the notification to Redux store
            store.dispatch(
              receiveNotification({
                ...notification,
                read: false,
                time: notification.time || new Date().toISOString(),
                createdDate: notification.createdDate || notification.time || new Date().toISOString(),
              })
            );
          } catch (error) {
            logger.error("Error processing notification", error);
          }
        });
        logger.info(`Subscribed to topic: ${topic}`);
      },
      (error) => {
        logger.error("Connection error", error);
        isConnecting = false;

        // Set up reconnection
        reconnectTimer = setTimeout(() => {
          logger.info("Attempting to reconnect...");
          if (activeUsername) {
            connectWebSocket(activeUsername);
          }
        }, 5000);
      }
    );

    return stompClient;
  } catch (error) {
    logger.error("Error establishing connection", error);
    isConnecting = false;

    // Set up reconnection
    reconnectTimer = setTimeout(() => {
      logger.info("Attempting to reconnect after error...");
      if (activeUsername) {
        connectWebSocket(activeUsername);
      }
    }, 5000);

    return null;
  }
};

// Subscribe to chat messages for all user's chats
export const subscribeToChatMessages = (chatIds) => {
  if (!stompClient || !stompClient.connected) {
    logger.warn("Cannot subscribe to chats - WebSocket not connected");
    return;
  }

  // Unsubscribe from chats that are no longer in the list
  Object.keys(chatSubscriptions).forEach((existingChatId) => {
    if (!chatIds.includes(existingChatId)) {
      try {
        chatSubscriptions[existingChatId].unsubscribe();
        delete chatSubscriptions[existingChatId];
        logger.info(`Unsubscribed from chat: ${existingChatId}`);
      } catch (error) {
        logger.error(`Error unsubscribing from chat ${existingChatId}`, error);
      }
    }
  });

  // Subscribe to new chats
  chatIds.forEach((chatId) => {
    if (!chatSubscriptions[chatId]) {
      try {
        const topic = `/group/${chatId}/private`;
        chatSubscriptions[chatId] = stompClient.subscribe(topic, (message) => {
          try {
            const receivedMessage = JSON.parse(message.body);
            logger.info(`Chat message received for chat: ${chatId}`);
            store.dispatch({ type: RECEIVE_MESSAGE, payload: receivedMessage });
          } catch (error) {
            logger.error("Error processing chat message", error);
          }
        });
        logger.info(`Subscribed to chat: ${chatId}`);
      } catch (error) {
        logger.error(`Error subscribing to chat ${chatId}`, error);
      }
    }
  });
};

// Unsubscribe from all chat messages
export const unsubscribeFromChatMessages = () => {
  Object.keys(chatSubscriptions).forEach((chatId) => {
    try {
      chatSubscriptions[chatId].unsubscribe();
    } catch (error) {
      logger.error(`Error unsubscribing from chat ${chatId}`, error);
    }
  });
  chatSubscriptions = {};
  logger.info("Unsubscribed from all chat messages");
};

// Get WebSocket connection status
export const isWebSocketConnected = () => {
  return stompClient && stompClient.connected;
};

export const disconnectWebSocket = () => {
  try {
    // Unsubscribe from chat messages
    unsubscribeFromChatMessages();

    if (notificationSubscription) {
      notificationSubscription.unsubscribe();
      notificationSubscription = null;
      logger.info("Unsubscribed from notifications");
    }

    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
      logger.info("Disconnected");
    }

    stompClient = null;
  } catch (error) {
    logger.error("Error disconnecting", error);
  }
};

// Add a health check function that can be called periodically
export const checkWebSocketConnection = () => {
  if (!stompClient || !stompClient.connected) {
    logger.warn("Connection lost, attempting to reconnect...");
    if (activeUsername) {
      connectWebSocket(activeUsername);
    }
    return false;
  }
  return true;
};

