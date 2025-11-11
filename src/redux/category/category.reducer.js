import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILED,
  GET_CATEGORY_REQUEST,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_CATEGORY_BY_BOOK_REQUEST,
  GET_CATEGORY_BY_BOOK_SUCCESS,
  GET_CATEGORY_BY_BOOK_FAILED,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILED,
  EDIT_CATEGORY_REQUEST,
  EDIT_CATEGORY_SUCCESS,
  EDIT_CATEGORY_FAILED,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILED,
  GET_BOOKS_BY_CATEGORY_REQUEST,
  GET_BOOKS_BY_CATEGORY_SUCCESS,
  GET_BOOKS_BY_CATEGORY_FAILED,
  GET_TOP_CATEGORIES_REQUEST,
  GET_TOP_CATEGORIES_SUCCESS,
  GET_TOP_CATEGORIES_FAILED,
} from "./category.actionType";

const initialState = {
  categories: [],
  topCategories: [],
  category: null,
  categoryByBook: null,
  booksByCategory: {},
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
    case GET_CATEGORY_REQUEST:
    case GET_CATEGORY_BY_BOOK_REQUEST:
    case GET_BOOKS_BY_CATEGORY_REQUEST:
    case ADD_CATEGORY_REQUEST:
    case EDIT_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
    case GET_TOP_CATEGORIES_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_TOP_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        topCategories: Array.isArray(action.payload) ? action.payload : [],
      };

    case GET_CATEGORY_BY_BOOK_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categoryByBook: Array.isArray(action.payload) ? action.payload : [],
      };
    case GET_BOOKS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        booksByCategory: action.payload && typeof action.payload === "object" ? action.payload : {},
      };

    case GET_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categories: Array.isArray(action.payload) ? action.payload : [],
      };
    case GET_CATEGORY_SUCCESS:
      return { ...state, loading: false, error: null, category: action.payload || null };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categories: action.payload ? [...state.categories, action.payload] : state.categories,
      };
    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categories: action.payload
          ? state.categories.map((category) => (category.id === action.payload.id ? action.payload : category))
          : state.categories,
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };

    case GET_CATEGORIES_FAILED:
    case GET_CATEGORY_FAILED:
    case GET_CATEGORY_BY_BOOK_FAILED:
    case GET_BOOKS_BY_CATEGORY_FAILED:
    case GET_TOP_CATEGORIES_FAILED:
    case ADD_CATEGORY_FAILED:
    case EDIT_CATEGORY_FAILED:
    case DELETE_CATEGORY_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
