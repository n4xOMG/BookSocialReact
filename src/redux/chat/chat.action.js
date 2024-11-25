import { api, API_BASE_URL } from "../../api/api";
import {
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
    if (stompClient) {
      stompClient.publish({
        destination: `${API_BASE_URL}/app/chat.sendMessage`,
        body: JSON.stringify({
          chatId: chatId,
          content: message.content,
          senderId: message.senderId,
          receiverId: message.receiverId,
          timestamp: message.timestamp,
        }),
      });
      dispatch({ type: SEND_MESSAGE_SUCCESS, payload: message });
    } else {
      throw new Error("WebSocket is not connected.");
    }
  } catch (error) {
    dispatch({ type: SEND_MESSAGE_FAILED, payload: error.message });
  }
};
