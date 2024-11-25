import { api, API_BASE_URL } from "../../api/api";
import {
  CREATE_CHAT_FAILED,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILED,
  FETCH_CHAT_MESSAGES_REQUEST,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_USER_CHATS_FAILED,
  FETCH_USER_CHATS_REQUEST,
  FETCH_USER_CHATS_SUCCESS,
  RECEIVE_MESSAGE,
  SEND_MESSAGE_FAILED,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
} from "./chat.actionType";

// Fetch user's chat list
export const fetchUserChats = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_CHATS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/chats`);
    dispatch({ type: FETCH_USER_CHATS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_USER_CHATS_FAILED, payload: error.message });
  }
};

// Fetch messages for a specific chat
export const fetchChatMessages = (chatId) => async (dispatch) => {
  dispatch({ type: FETCH_CHAT_MESSAGES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/chats/${chatId}/messages`);
    dispatch({
      type: FETCH_CHAT_MESSAGES_SUCCESS,
      payload: { chatId, messages: response.data },
    });
  } catch (error) {
    dispatch({ type: FETCH_CHAT_MESSAGES_FAILED, payload: error.message });
  }
};
// Create a new chat with another user
export const createChat = (otherUserId) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/chats/${otherUserId}`);
    dispatch({ type: CREATE_CHAT_SUCCESS, payload: response.data });
    return response.data.id; // Return the chatId for navigation
  } catch (error) {
    dispatch({ type: CREATE_CHAT_FAILED, payload: error.message });
    throw error;
  }
};
// Receive message from WebSocket
export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});

// Send a message
export const sendMessage = (chatId, message) => async (dispatch, getState) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try {
    const { stompClient } = getState().websocket;
    if (stompClient && stompClient.connected) {
      const messagePayload = {
        chatId: chatId,
        content: message.content,
        imageUrl: message.imageUrl || "",
        sender: { id: message.senderId },
        receiver: { id: message.receiverId },
        timestamp: new Date().toISOString(), // Include timestamp
      };

      stompClient.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messagePayload),
      });

      dispatch({ type: SEND_MESSAGE_SUCCESS, payload: { chatId, ...messagePayload } });
    } else {
      throw new Error("WebSocket is not connected.");
    }
  } catch (error) {
    dispatch({ type: SEND_MESSAGE_FAILED, payload: error.message });
  }
};
