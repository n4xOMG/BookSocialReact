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

const initialState = {
  chats: [],
  messages: {}, // Correctly initialized as an object
  message: null,
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
      return { ...state, message: action.payload };
    case FETCH_USER_CHATS_SUCCESS:
      return { ...state, loading: false, chats: action.payload };

    case FETCH_CHAT_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chatId]: action.payload.messages,
        },
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [action.payload.chatId]: [
            ...(state.messages[action.payload.chatId] || []),
            {
              id: action.payload.id, // Ensure ID is present
              chatId: action.payload.chatId,
              content: action.payload.content,
              imageUrl: action.payload.imageUrl,
              sender: action.payload.sender,
              receiver: action.payload.receiver,
              timestamp: new Date(action.payload.timestamp), // Parse timestamp
              read: action.payload.read,
            },
          ],
        },
      };

    case RECEIVE_MESSAGE:
      const { chatId } = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), action.payload],
        },
      };

    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        chats: [...state.chats, action.payload],
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
