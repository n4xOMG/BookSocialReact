import { api, API_BASE_URL } from "../../api/api";
import {
  CREATE_CHAT_FAILED,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_MESSAGE_FAILED,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
  FETCH_CHAT_MESSAGES_FAILED,
  FETCH_CHAT_MESSAGES_REQUEST,
  FETCH_CHAT_MESSAGES_SUCCESS,
  FETCH_USER_CHATS_FAILED,
  FETCH_USER_CHATS_REQUEST,
  FETCH_USER_CHATS_SUCCESS,
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
// Create a new message with another user
export const createMessage = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_MESSAGE_REQUEST });
  console.log("Creating message", reqData.message);
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/chats/create-message`, reqData.message);
    console.log("Message created", data);
    reqData.sendMessageToServer(data);
    dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: CREATE_MESSAGE_FAILED, payload: error.message });
    throw error;
  }
};
