import { api, API_BASE_URL } from "../../api/api";
import { extractErrorMessage, extractResponsePayload } from "../../utils/apiResponseHelpers";
import { createLogger } from "../../utils/logger";
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

const logger = createLogger("ChatActions");
export const fetchUserChats = () => async (dispatch) => {
  dispatch({ type: FETCH_USER_CHATS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/chats`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: FETCH_USER_CHATS_SUCCESS, payload: data || [] });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: FETCH_USER_CHATS_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const fetchChatMessages = (chatId) => async (dispatch) => {
  dispatch({ type: FETCH_CHAT_MESSAGES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/chats/${chatId}/messages`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({
      type: FETCH_CHAT_MESSAGES_SUCCESS,
      payload: { chatId, messages: data || [] },
    });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: FETCH_CHAT_MESSAGES_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const createChat = (otherUserId) => async (dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/chats/${otherUserId}`);
    const { data, message, success } = extractResponsePayload(response);
    const chatData = data || response?.data || null;
    dispatch({ type: CREATE_CHAT_SUCCESS, payload: chatData });
    if (!chatData?.id) {
      logger.warn("Chat created but no id returned", { chatData, message, success });
    }
    return chatData?.id || null;
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: CREATE_CHAT_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};
export const createMessage = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_MESSAGE_REQUEST });
  logger.info("Creating message", reqData.message);
  try {
    const response = await api.post(`${API_BASE_URL}/api/chats/create-message`, reqData.message);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Message created", data);
    reqData.sendMessageToServer(data);
    dispatch({ type: CREATE_MESSAGE_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: CREATE_MESSAGE_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};
