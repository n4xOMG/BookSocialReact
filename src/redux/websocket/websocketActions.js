import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { receiveMessage } from "../chat/chat.action";
import { receiveNotification } from "../notification/notification.action";
import { API_BASE_URL } from "../../api/api";

// Action to connect WebSocket
export const connectWebSocket = () => (dispatch, getState) => {
  const { websocket } = getState();
  if (websocket.stompClient && websocket.stompClient.connected) {
    console.log("WebSocket already connected. Skipping reconnection.");
    return;
  }

  const { user } = getState().auth;
  const token = localStorage.getItem("jwt");
  if (!user) return;

  const socket = new SockJS(`${API_BASE_URL}/ws-chat`);
  const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    debug: (str) => {
      console.log("[WebSocket Debug]:", str);
    },
    onConnect: () => {
      console.log("WebSocket Connected");

      // Subscribe to user-specific messages using username
      stompClient.subscribe(`/user/${user.username}/queue/messages`, (message) => {
        const msg = JSON.parse(message.body);
        console.log("Received message on /queue/messages:", msg);
        dispatch(receiveMessage(msg));
      });

      // Subscribe to user-specific notifications
      stompClient.subscribe(`/user/${user.username}/topic/notifications`, (notification) => {
        const notif = JSON.parse(notification.body);
        console.log("Received notification:", notif);
        dispatch(receiveNotification(notif));
      });

      // Subscribe to existing chats using username
      const { chats } = getState().chat;
      chats.forEach((chat) => {
        stompClient.subscribe(`/user/${user.username}/queue/chat/${chat.id}`, (message) => {
          const msg = JSON.parse(message.body);
          console.log(`Received message on /queue/chat/${chat.id}:`, msg);
          dispatch(receiveMessage(msg));
        });
      });
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
    reconnectDelay: 5000, // Optional: Attempt reconnection after 5 seconds
  });

  stompClient.activate();

  dispatch({ type: "WEBSOCKET_CONNECTED", payload: stompClient });
};

// Action to disconnect WebSocket
export const disconnectWebSocket = () => (dispatch, getState) => {
  const { stompClient } = getState().websocket;
  if (stompClient) {
    stompClient.deactivate();
    dispatch({ type: "WEBSOCKET_DISCONNECTED" });
  }
};

// Action to subscribe to a specific chat
export const subscribeToChat = (chatId) => (dispatch, getState) => {
  const { stompClient } = getState().websocket;
  const { user } = getState().auth;
  if (stompClient && stompClient.connected && user) {
    stompClient.subscribe(`/user/${user.username}/queue/chat/${chatId}`, (msg) => {
      const message = JSON.parse(msg.body);
      console.log(`Received message on /user/${user.username}/queue/chat/${chatId}:`, message);
      dispatch(receiveMessage(message));
    });
    console.log(`Subscribed to /user/${user.username}/queue/chat/${chatId}`);
  } else {
    console.warn("Cannot subscribe to chat: STOMP client is not connected.");
  }
};

// Action to unsubscribe from a specific chat
export const unsubscribeFromChat = (chatId) => (dispatch, getState) => {
  const { stompClient } = getState().websocket;
  const { user } = getState().auth;
  if (stompClient && user) {
    try {
      stompClient.unsubscribe(`/user/${user.username}/queue/chat/${chatId}`);
      console.log(`Unsubscribed from /user/${user.username}/queue/chat/${chatId}`);
    } catch (error) {
      console.error(`Error unsubscribing from chat ${chatId}:`, error);
    }
  }
};
