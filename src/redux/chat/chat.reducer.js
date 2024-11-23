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

const initialState = {
  chats: [],
  messages: [],
  loading: false,
  error: null,
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_CHATS_REQUEST:
    case FETCH_CHAT_MESSAGES_REQUEST:
    case SEND_MESSAGE_REQUEST:
      return { ...state, loading: true, error: null };

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
      const { receiverId } = action.payload;
      return {
        ...state,
        loading: false,
        messages: {
          ...state.messages,
          [receiverId]: [...(state.messages[receiverId] || []), action.payload],
        },
      };

    case RECEIVE_MESSAGE:
      const receivedMessage = action.payload;
      return {
        ...state,
        messages: {
          ...state.messages,
          [receivedMessage.senderId]: [...(state.messages[receivedMessage.senderId] || []), receivedMessage],
        },
      };

    case FETCH_USER_CHATS_FAILED:
    case FETCH_CHAT_MESSAGES_FAILED:
    case SEND_MESSAGE_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
