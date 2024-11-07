import {
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORIES_FAILED,
  GET_CATEGORY_REQUEST,
  GET_CATEGORY_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_CATEGORIES_BY_BOOK_REQUEST,
  GET_CATEGORIES_BY_BOOK_SUCCESS,
  GET_CATEGORIES_BY_BOOK_FAILED,
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
} from "./category.actionType";

const initialState = {
  categories: [],
  category: null,
  booksByCategory: {},
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CATEGORIES_REQUEST:
    case GET_CATEGORY_REQUEST:
    case GET_CATEGORIES_BY_BOOK_REQUEST:
    case GET_BOOKS_BY_CATEGORY_REQUEST:
    case ADD_CATEGORY_REQUEST:
    case EDIT_CATEGORY_REQUEST:
    case DELETE_CATEGORY_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_BOOKS_BY_CATEGORY_SUCCESS:
      return { ...state, loading: false, booksByCategory: action.payload };

    case GET_CATEGORIES_SUCCESS:
    case GET_CATEGORIES_BY_BOOK_SUCCESS:
      return { ...state, loading: false, categories: action.payload };
    case GET_CATEGORY_SUCCESS:
      return { ...state, loading: false, category: action.payload };
    case ADD_CATEGORY_SUCCESS:
      return { ...state, loading: false, categories: [...state.categories, action.payload] };
    case EDIT_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.map((category) => (category.id === action.payload.id ? action.payload : category)),
      };
    case DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: state.categories.filter((category) => category.id !== action.payload),
      };

    case GET_CATEGORIES_FAILED:
    case GET_CATEGORY_FAILED:
    case GET_CATEGORIES_BY_BOOK_FAILED:
    case GET_BOOKS_BY_CATEGORY_FAILED:
    case ADD_CATEGORY_FAILED:
    case EDIT_CATEGORY_FAILED:
    case DELETE_CATEGORY_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
