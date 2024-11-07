import {
  GET_TAGS_REQUEST,
  GET_TAGS_SUCCESS,
  GET_TAGS_FAILED,
  GET_TAG_REQUEST,
  GET_TAG_SUCCESS,
  GET_TAG_FAILED,
  ADD_TAG_REQUEST,
  ADD_TAG_SUCCESS,
  ADD_TAG_FAILED,
  EDIT_TAG_REQUEST,
  EDIT_TAG_SUCCESS,
  EDIT_TAG_FAILED,
  DELETE_TAG_REQUEST,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_FAILED,
  GET_TAGS_BY_BOOK_REQUEST,
  GET_TAGS_BY_BOOK_SUCCESS,
  GET_TAGS_BY_BOOK_FAILED,
} from "./tag.actionType";

const initialState = {
  tags: [],
  tag: null,
  loading: false,
  error: null,
};

export const tagReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_TAGS_REQUEST:
    case GET_TAG_REQUEST:
    case ADD_TAG_REQUEST:
    case EDIT_TAG_REQUEST:
    case DELETE_TAG_REQUEST:
    case GET_TAGS_BY_BOOK_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_TAGS_SUCCESS:
    case GET_TAGS_BY_BOOK_SUCCESS:
      return { ...state, loading: false, tags: action.payload };
    case GET_TAG_SUCCESS:
      return { ...state, loading: false, tag: action.payload };
    case ADD_TAG_SUCCESS:
      return { ...state, loading: false, tags: [...state.tags, action.payload] };
    case EDIT_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        tags: state.tags.map((tag) => (tag.id === action.payload.id ? action.payload : tag)),
      };
    case DELETE_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        tags: state.tags.filter((tag) => tag.id !== action.payload),
      };

    case GET_TAGS_FAILED:
    case GET_TAG_FAILED:
    case ADD_TAG_FAILED:
    case EDIT_TAG_FAILED:
    case DELETE_TAG_FAILED:
    case GET_TAGS_BY_BOOK_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
