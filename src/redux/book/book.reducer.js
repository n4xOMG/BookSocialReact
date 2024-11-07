import {
  ADD_NEW_CATEGORY_SUCCESS,
  ADD_NEW_LANGUAGE_REQUEST,
  ADD_NEW_LANGUAGE_SUCCESS,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  DELETE_CATEGORY_SUCCESS,
  DELETE_LANGUAGE_REQUEST,
  DELETE_LANGUAGE_SUCCESS,
  EDIT_CATEGORY_SUCCESS,
  EDIT_LANGUAGE_REQUEST,
  EDIT_LANGUAGE_SUCCESS,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_ALL_LANGUAGES_FAILED,
  GET_ALL_LANGUAGES_REQUEST,
  GET_ALL_LANGUAGES_SUCCESS,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_CATEGORIES_BY_BOOK_SUCCESS,
  GET_LANGUAGES_BY_BOOK_FAILED,
  GET_LANGUAGES_BY_BOOK_REQUEST,
  GET_LANGUAGES_BY_BOOK_SUCCESS,
  GET_LANGUAGES_WITH_COUNTS_SUCCESS,
  GET_LATEST_UPDATE_BOOK_FAILED,
  GET_LATEST_UPDATE_BOOK_SUCCESS,
  GET_READING_PROGRESSES_BY_BOOK_FAILED,
  GET_READING_PROGRESSES_BY_BOOK_REQUEST,
  GET_READING_PROGRESSES_BY_BOOK_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
} from "./book.actionType";

const initialState = {
  error: null,
  favoured: null,
  book: null,
  books: [],
  latestUpdateBook: null,
  avgRating: null,
  languages: [],
  language: null,
  categories: [],
  category: null,
  progresses: [],
  rating: null,
  chapterCounts: null,
};

export const bookReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_UPLOAD_REQUEST:
    case GET_BOOK_REQUEST:
    case GET_ALL_BOOK_REQUEST:
    case FOLLOW_BOOK_REQUEST:
    case RATING_BOOK_REQUEST:
    case SEARCH_BOOK_REQUEST:
    case GET_BOOK_RATING_BY_USER_REQUEST:
    case GET_AVG_BOOK_RATING_REQUEST:
    case GET_LANGUAGES_BY_BOOK_REQUEST:
    case GET_ALL_LANGUAGES_REQUEST:
    case GET_READING_PROGRESSES_BY_BOOK_REQUEST:
    case ADD_NEW_LANGUAGE_REQUEST:
    case EDIT_LANGUAGE_REQUEST:
    case DELETE_LANGUAGE_REQUEST:
      return { ...state, error: null };

    case GET_BOOK_SUCCESS:
    case BOOK_UPLOAD_SUCCEED:
      return { ...state, error: null, book: action.payload };
    case GET_LATEST_UPDATE_BOOK_SUCCESS:
      return { ...state, error: null, latestUpdateBook: action.payload };
    case FOLLOW_BOOK_SUCCESS:
      return { ...state, error: null, favoured: action.payload };
    case GET_ALL_BOOK_SUCCESS:
    case SEARCH_BOOK_SUCCESS:
      return { ...state, error: null, books: action.payload };

    case GET_BOOK_RATING_BY_USER_SUCCESS:
    case RATING_BOOK_SUCCESS:
      return { ...state, error: null, rating: action.payload };

    case GET_AVG_BOOK_RATING_SUCCESS:
      return { ...state, error: null, avgRating: action.payload };

    case GET_LANGUAGES_BY_BOOK_SUCCESS:
    case GET_ALL_LANGUAGES_SUCCESS:
      return { ...state, error: null, languages: action.payload };
    case GET_LANGUAGES_WITH_COUNTS_SUCCESS:
      return { ...state, error: null, languages: action.payload.languages, chapterCounts: action.payload.chapterCounts };
    case GET_READING_PROGRESSES_BY_BOOK_SUCCESS:
      return { ...state, error: null, progresses: action.payload };

    case GET_CATEGORIES_BY_BOOK_SUCCESS:
    case GET_ALL_CATEGORIES_SUCCESS:
      return { ...state, error: null, categories: action.payload };

    case ADD_NEW_LANGUAGE_SUCCESS:
    case EDIT_LANGUAGE_SUCCESS:
      return { ...state, error: null, language: action.payload };
    case DELETE_LANGUAGE_SUCCESS:
    case DELETE_CATEGORY_SUCCESS:
      return { ...state, error: null };

    case ADD_NEW_CATEGORY_SUCCESS:
    case EDIT_CATEGORY_SUCCESS:
      return { ...state, error: null, category: action.payload };

    case BOOK_UPLOAD_FAILED:
    case GET_BOOK_FAILED:
    case GET_ALL_BOOK_FAILED:
    case FOLLOW_BOOK_FAILED:
    case RATING_BOOK_FAILED:
    case SEARCH_BOOK_FAILED:
    case GET_LANGUAGES_BY_BOOK_FAILED:
    case GET_ALL_LANGUAGES_FAILED:
    case GET_READING_PROGRESSES_BY_BOOK_FAILED:
    case GET_LATEST_UPDATE_BOOK_FAILED:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
