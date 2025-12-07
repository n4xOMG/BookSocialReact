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
  DELETE_CHAT_REQUEST,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAILED,
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

// Get the latest message timestamp from a chat's messages
const getLatestTimestamp = (chat, messagesMap) => {
  const chatMessages = messagesMap[chat?.id] || chat?.messages || [];
  if (!chatMessages.length) return new Date(0);
  
  const sorted = [...chatMessages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return new Date(sorted[0]?.timestamp || 0);
};

// Sort chats by most recent message (newest first)
const sortChatsByRecent = (chats, messagesMap) => {
  return [...chats].sort((a, b) => {
    const aTime = getLatestTimestamp(a, messagesMap);
    const bTime = getLatestTimestamp(b, messagesMap);
    return bTime - aTime;
  });
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
    case DELETE_CHAT_REQUEST:
      return { ...state, loading: true, error: null };

    case CREATE_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case FETCH_USER_CHATS_SUCCESS: {
      const chats = action.payload || [];
      return { 
        ...state, 
        loading: false, 
        chats: sortChatsByRecent(chats, state.messages),
      };
    }

    case FETCH_CHAT_MESSAGES_SUCCESS: {
      const newMessages = {
        ...state.messages,
        [action.payload.chatId]: sortMessages(action.payload.messages || []),
      };
      return {
        ...state,
        loading: false,
        messages: newMessages,
        chats: sortChatsByRecent(state.chats, newMessages),
      };
    }

    case SEND_MESSAGE_SUCCESS: {
      const newMessages = {
        ...state.messages,
        [action.payload.chatId]: mergeMessages(state.messages[action.payload.chatId], [action.payload]),
      };
      return {
        ...state,
        loading: false,
        messages: newMessages,
        chats: sortChatsByRecent(state.chats, newMessages),
      };
    }

    case RECEIVE_MESSAGE: {
      const newMessages = {
        ...state.messages,
        [action.payload.chatId]: mergeMessages(state.messages[action.payload.chatId], [action.payload]),
      };
      return {
        ...state,
        messages: newMessages,
        chats: sortChatsByRecent(state.chats, newMessages),
      };
    }

    case CREATE_CHAT_SUCCESS: {
      if (!action.payload) {
        return { ...state, loading: false };
      }

      const chatExists = state.chats.some((chat) => chat?.id === action.payload?.id);
      const updatedChats = chatExists
        ? state.chats.map((chat) => (chat?.id === action.payload.id ? { ...chat, ...action.payload } : chat))
        : [action.payload, ...state.chats];
      
      return {
        ...state,
        loading: false,
        chats: sortChatsByRecent(updatedChats, state.messages),
      };
    }

    case DELETE_CHAT_SUCCESS: {
      const deletedChatId = action.payload;
      const { [deletedChatId]: _, ...remainingMessages } = state.messages;
      return {
        ...state,
        loading: false,
        chats: state.chats.filter((chat) => chat?.id !== deletedChatId),
        messages: remainingMessages,
      };
    }

    case FETCH_USER_CHATS_FAILED:
    case FETCH_CHAT_MESSAGES_FAILED:
    case SEND_MESSAGE_FAILED:
    case CREATE_CHAT_FAILED:
    case DELETE_CHAT_FAILED:
      return { ...state, loading: false, error: action.payload };

    case "CHAT_SUBSCRIBED":
      return {
        ...state,
        subscriptions: {
          ...state.subscriptions,
          [action.payload.chatId]: action.payload.subscription,
        },
      };

    case "CHAT_UNSUBSCRIBED": {
      const { [action.payload]: __, ...remainingSubscriptions } = state.subscriptions;
      return {
        ...state,
        subscriptions: remainingSubscriptions,
      };
    }

    default:
      return state;
  }
};

