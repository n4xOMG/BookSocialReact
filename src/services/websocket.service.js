import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../api/api";
import { receiveNotification } from "../redux/notification/notification.action";
import { store } from "../redux/store";

let stompClient = null;
let subscription = null;
let isConnecting = false;
let reconnectTimer = null;

export const connectWebSocket = (username) => {
  if (!username || isConnecting) return null;

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
        console.log("WebSocket connected successfully!");
        isConnecting = false;

        // Subscribe to the user's notification channel (no need to check stompClient.connected here)
        const topic = `/user/${username}/notifications`;
        subscription = stompClient.subscribe(topic, (message) => {
          try {
            const notification = JSON.parse(message.body);
            //   store.dispatch(getNotifications());
            store.dispatch(
              receiveNotification({
                ...notification,
                read: false,
                time: notification.time || new Date().toISOString(),
                createdDate: notification.createdDate || notification.time || new Date().toISOString(),
              })
            );
          } catch (error) {
            console.error("Error processing WebSocket notification:", error);
          }
        });
        console.log("Subscription to notifications topic complete.");
      },
      (error) => {
        console.error("WebSocket connection error:", error);
        isConnecting = false;

        // Set up reconnection
        reconnectTimer = setTimeout(() => {
          console.log("Attempting to reconnect WebSocket...");
          connectWebSocket(username);
        }, 5000);
      }
    );

    return stompClient;
  } catch (error) {
    console.error("Error establishing WebSocket connection:", error);
    isConnecting = false;

    // Set up reconnection
    reconnectTimer = setTimeout(() => {
      console.log("Attempting to reconnect WebSocket after error...");
      connectWebSocket(username);
    }, 5000);

    return null;
  }
};

export const disconnectWebSocket = () => {
  try {
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
      console.log("Unsubscribed from WebSocket topics");
    }

    if (stompClient && stompClient.connected) {
      stompClient.disconnect();
      console.log("WebSocket disconnected");
    }

    stompClient = null;
  } catch (error) {
    console.error("Error disconnecting WebSocket:", error);
  }
};
