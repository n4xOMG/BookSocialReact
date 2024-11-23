import axios from "axios";
import {
  FETCH_USER_CHATS_REQUEST,
  FETCH_USER_CHATS_SUCCESS,
  FETCH_USER_CHATS_FAILED,
  FETCH_CHAT_MESSAGES_REQUEST,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILED,
  RECEIVE_MESSAGE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILED,
} from "./chat.actionType";
import { api, API_BASE_URL } from "../../api/api";

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
    dispatch({ type: FETCH_CHAT_MESSAGES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_CHAT_MESSAGES_FAILED, payload: error.message });
  }
};

// Receive message from WebSocket
export const receiveMessage = (message) => ({
  type: RECEIVE_MESSAGE,
  payload: message,
});

// Send a message
export const sendMessage = (chatId, content) => async (dispatch, getState) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });
  try {
    const { stompClient } = getState().websocket;
    const message = {
      receiverId: chatId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    stompClient.publish({
      destination: `${API_BASE_URL}/api/chat.sendMessage`,
      body: JSON.stringify(message),
    });

    dispatch({ type: SEND_MESSAGE_SUCCESS, payload: message });
  } catch (error) {
    dispatch({ type: SEND_MESSAGE_FAILED, payload: error.message });
  }
};
