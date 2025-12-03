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
  CREATE_CHAT_FAILED,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_MESSAGE_REQUEST,
  CREATE_MESSAGE_SUCCESS,
} from "./chat.actionType";

const sortMessages = (messages = []) => [...messages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

const mergeMessages = (existing = [], incoming = []) => {
  const next = [...existing];

  incoming.forEach((message) => {
    if (!message) {
      return;
    }

    const hasId = message.id !== undefined && message.id !== null;
    if (hasId) {
      const existingIndex = next.findIndex((item) => item?.id === message.id);
      if (existingIndex >= 0) {
        next[existingIndex] = message;
        return;
      }
    }

    next.push(message);
  });

  return sortMessages(next);
};

const initialState = {
  chats: [],
  messages: {},
  loading: false,
  error: null,
  subscriptions: {},
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_CHATS_REQUEST:
    case FETCH_CHAT_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
    case CREATE_CHAT_REQUEST:
    case CREATE_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case FETCH_USER_CHATS_SUCCESS:
      return { ...state, loading: false, chats: action.payload || [] };

    case FETCH_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chatId]: sortMessages(action.payload.messages || []),
        },
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chatId]: mergeMessages(state.messages[action.payload.chatId], [action.payload]),
        },
      };

    case RECEIVE_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.chatId]: mergeMessages(state.messages[action.payload.chatId], [action.payload]),
        },
      };

    case CREATE_CHAT_SUCCESS:
      if (!action.payload) {
        return { ...state, loading: false };
      }

      const chatExists = state.chats.some((chat) => chat?.id === action.payload?.id);
      return {
        ...state,
        loading: false,
        chats: chatExists
          ? state.chats.map((chat) => (chat?.id === action.payload.id ? { ...chat, ...action.payload } : chat))
          : [...state.chats, action.payload],
      };

    case FETCH_USER_CHATS_FAILED:
    case FETCH_CHAT_MESSAGES_FAILED:
    case SEND_MESSAGE_FAILED:
    case CREATE_CHAT_FAILED:
      return { ...state, loading: false, error: action.payload };

    case "CHAT_SUBSCRIBED":
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.chatId]: action.payload.subscription,
        },
      };

    case "CHAT_UNSUBSCRIBED":
      const { [action.payload]: _, ...remainingSubscriptions } = state.subscriptions;
      return {
        ...state,
        subscriptions: remainingSubscriptions,
      };

    default:
      return state;
  }
};
