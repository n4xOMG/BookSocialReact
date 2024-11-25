import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
  CREATE_PAYMENT_INTENT_FAILED,
  CREATE_PAYMENT_INTENT_REQUEST,
  CREATE_PAYMENT_INTENT_SUCCESS,
  DELETE_CHAPTER_FAILED,
  DELETE_CHAPTER_REQUEST,
  DELETE_CHAPTER_SUCCEED,
  EDIT_CHAPTER_FAILED,
  EDIT_CHAPTER_REQUEST,
  EDIT_CHAPTER_SUCCEED,
  GET_ALL_CHAPTER_FAILED,
  GET_ALL_CHAPTER_REQUEST,
  GET_ALL_CHAPTER_SUCCESS,
  GET_CHAPTER_FAILED,
  GET_CHAPTER_REQUEST,
  GET_CHAPTER_SUCCESS,
  GET_CHAPTERS_BY_BOOK_FAILED,
  GET_CHAPTERS_BY_BOOK_REQUEST,
  GET_CHAPTERS_BY_BOOK_SUCCESS,
  GET_PROGRESS_FAILED,
  GET_PROGRESS_REQUEST,
  GET_PROGRESS_SUCCESS,
  SAVE_PROGRESS_FAILED,
  SAVE_PROGRESS_REQUEST,
  SAVE_PROGRESS_SUCCESS,
  UNLOCK_CHAPTER_FAILED,
  UNLOCK_CHAPTER_REQUEST,
  UNLOCK_CHAPTER_SUCCESS,
} from "./chapter.actionType";

const initialState = {
  error: null,
  chapter: null,
  chapters: [],
  readingProgress: null,
  loading: false,
  unlockSuccess: false,
  unlockError: null,
  creditPackages: [],
  paymentIntent: null,
  loadingPaymentIntent: false,
};

export const chapterReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHAPTER_UPLOAD_REQUEST:
    case EDIT_CHAPTER_REQUEST:
    case DELETE_CHAPTER_REQUEST:
    case GET_CHAPTER_REQUEST:
    case GET_ALL_CHAPTER_REQUEST:
    case SAVE_PROGRESS_REQUEST:
    case GET_PROGRESS_REQUEST:
    case GET_CHAPTERS_BY_BOOK_REQUEST:
      return { ...state, loading: true, error: null };
    case UNLOCK_CHAPTER_REQUEST:
      return { ...state, loading: true, unlockError: null, unlockSuccess: false };

    case CREATE_PAYMENT_INTENT_REQUEST:
      return {
        ...state,
        loadingPaymentIntent: true,
        errorPaymentIntent: null,
      };
    case CREATE_PAYMENT_INTENT_SUCCESS:
      return {
        ...state,
        loadingPaymentIntent: false,
        paymentIntent: action.payload.clientSecret,
      };
    case UNLOCK_CHAPTER_SUCCESS:
      return {
        ...state,
        loading: false,
        unlockSuccess: true,
        chapters: state.chapters.map((chapter) => (chapter.id === action.payload.id ? { ...chapter, unlockedByUser: true } : chapter)),
        chapter: state.chapter && state.chapter.id === action.payload.id ? { ...state.chapter, unlockedByUser: true } : state.chapter,
      };

    case GET_CHAPTER_SUCCESS:
      return { ...state, loading: false, error: null, chapter: action.payload };
    case CHAPTER_UPLOAD_SUCCEED:
      return { ...state, loading: false, error: null, chapters: [...state.chapters, action.payload] };
    case EDIT_CHAPTER_SUCCEED:
      return {
        ...state,
        loading: false,
        error: null,
        chapters: state.chapters.map((chapter) => (chapter.id === action.payload.id ? action.payload : chapter)),
      };
    case SAVE_PROGRESS_SUCCESS:
    case GET_PROGRESS_SUCCESS:
      return { ...state, loading: false, error: null, readingProgress: action.payload };
    case DELETE_CHAPTER_SUCCEED:
      return { ...state, loading: false, error: null, chapters: state.chapters.filter((chapter) => chapter.id !== action.payload) };
    case GET_ALL_CHAPTER_SUCCESS:
    case GET_CHAPTERS_BY_BOOK_SUCCESS:
      return { ...state, loading: false, error: null, chapters: action.payload };
    case UNLOCK_CHAPTER_FAILED:
      return { ...state, loading: false, unlockError: action.payload };
    case CHAPTER_UPLOAD_FAILED:
    case EDIT_CHAPTER_FAILED:
    case DELETE_CHAPTER_FAILED:
    case GET_CHAPTER_FAILED:
    case GET_ALL_CHAPTER_FAILED:
    case SAVE_PROGRESS_FAILED:
    case GET_PROGRESS_FAILED:
    case GET_CHAPTERS_BY_BOOK_FAILED:
    case CREATE_PAYMENT_INTENT_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
