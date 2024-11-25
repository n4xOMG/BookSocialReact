import { DELETE_CHAPTER_FAILED, DELETE_CHAPTER_REQUEST } from "../chapter/chapter.actionType";
import {
  BAN_USER_FAILED,
  BAN_USER_REQUEST,
  BAN_USER_SUCCESS,
  DELETE_USER_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_USER_BY_ID_FAILED,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  SUSPEND_USER_SUCCESS,
  UNBAN_USER_FAILED,
  UNBAN_USER_REQUEST,
  UNBAN_USER_SUCCESS,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UNSUSPEND_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ROLE_FAILED,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_SUCCESS,
} from "./user.actionType";

const initialState = {
  jwt: null,
  error: null,
  user: null,
  users: [],
  loading: false,
  readingProgresses: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST:
    case GET_USER_BY_ID_REQUEST:
    case UPDATE_USER_ROLE_REQUEST:
    case SUSPEND_USER_REQUEST:
    case UNSUSPEND_USER_REQUEST:
    case BAN_USER_REQUEST:
    case UNBAN_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_CHAPTER_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_USERS_SUCCESS:
      return { ...state, loading: false, error: null, users: action.payload };
    case GET_USER_BY_ID_SUCCESS:
      return { ...state, loading: false, error: null, user: action.payload };
    case GET_READING_PROGRESS_BY_USER_SUCCESS:
      return { ...state, loading: false, error: null, readingProgresses: action.payload };
    case UPDATE_USER_SUCCESS:
    case SUSPEND_USER_SUCCESS:
    case UNSUSPEND_USER_SUCCESS:
    case BAN_USER_SUCCESS:
    case UNBAN_USER_SUCCESS:
    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
      };
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false, error: null };

    case GET_ALL_USERS_FAILED:
    case GET_USER_BY_ID_FAILED:
    case SUSPEND_USER_FAILED:
    case UNSUSPEND_USER_FAILED:
    case BAN_USER_FAILED:
    case UNBAN_USER_FAILED:
    case UPDATE_USER_FAILED:
    case DELETE_CHAPTER_FAILED:
    case UPDATE_USER_ROLE_FAILED:
      return { ...state, loading: true, error: action.payload };
    default:
      return state;
  }
};
