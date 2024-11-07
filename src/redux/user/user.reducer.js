import { DELETE_CHAPTER_FAILED, DELETE_CHAPTER_REQUEST } from "../chapter/chapter.actionType";
import {
  DELETE_USER_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_USER_FAV_BOOKS_FAILED,
  GET_USER_FAV_BOOKS_SUCCESS,
  GET_USER_FAV_IMAGES_FAILED,
  GET_USER_FAV_IMAGES_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./user.actionType";

const initialState = {
  jwt: null,
  error: null,
  user: null,
  users: [],
  loading: false,
  readingProgresses: [],
  favouriteBooks: [],
  favouriteImages: [],
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST:
    case SUSPEND_USER_REQUEST:
    case UNSUSPEND_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_CHAPTER_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_ALL_USERS_SUCCESS:
      return { ...state, loading: false, error: null, users: action.payload };
    case GET_READING_PROGRESS_BY_USER_SUCCESS:
      return { ...state, loading: false, error: null, readingProgresses: action.payload };
    case GET_USER_FAV_BOOKS_SUCCESS:
      return { ...state, loading: false, error: null, favouriteBooks: action.payload };
    case GET_USER_FAV_IMAGES_SUCCESS:
      return { ...state, loading: false, error: null, favouriteImages: action.payload };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
        users: state.users.map((item) => (item.id === action.payload.id ? action.payload : item)),
      };
    case DELETE_USER_SUCCESS:
      return { ...state, loading: false, error: null };

    case GET_ALL_USERS_FAILED:
    case GET_USER_FAV_BOOKS_FAILED:
    case GET_USER_FAV_IMAGES_FAILED:
    case SUSPEND_USER_FAILED:
    case UNSUSPEND_USER_FAILED:
    case UPDATE_USER_FAILED:
    case DELETE_CHAPTER_FAILED:
      return { ...state, loading: true, error: action.payload };
    default:
      return state;
  }
};
