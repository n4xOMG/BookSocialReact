import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { receiveMessage } from "../chat/chat.action";
import { receiveNotification } from "../notification/notification.action";

// Action to connect WebSocket
export const connectWebSocket = () => (dispatch, getState) => {
  const { user } = getState().auth;
  const token = localStorage.getItem("jwt");
  if (!user) return;

  const socket = new SockJS("http://localhost:80/ws-chat");
  const stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`, // Adjust based on your auth setup
    },
    debug: function (str) {
      console.log(str);
    },
    onConnect: () => {
      console.log("WebSocket Connected");

      // Subscribe to user-specific messages
      stompClient.subscribe(`/user/${user.username}/queue/messages`, (message) => {
        const msg = JSON.parse(message.body);
        dispatch(receiveMessage(msg));
      });

      // Subscribe to user-specific notifications
      stompClient.subscribe(`/user/${user.username}/topic/notifications`, (notification) => {
        const notif = JSON.parse(notification.body);
        dispatch(receiveNotification(notif));
      });
    },
    onStompError: (frame) => {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    },
  });

  stompClient.activate();

  // Save stompClient to state if needed for sending messages
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
  const { stompClient, user } = getState().websocket;
  if (stompClient && user) {
    stompClient.subscribe(`/user/${user.username}/queue/chat/${chatId}`, (message) => {
      const msg = JSON.parse(message.body);
      dispatch(receiveMessage(msg));
    });
  }
};

// Action to unsubscribe from a specific chat
export const unsubscribeFromChat = (chatId) => (dispatch, getState) => {
  const { stompClient } = getState().websocket;
  if (stompClient) {
    stompClient.unsubscribe(`/user/${chatId}`);
  }
};
