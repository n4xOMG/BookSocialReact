import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
  DELETE_CHAPTER_FAILED,
  DELETE_CHAPTER_REQUEST,
  DELETE_CHAPTER_SUCCEED,
  EDIT_CHAPTER_FAILED,
  EDIT_CHAPTER_REQUEST,
  EDIT_CHAPTER_SUCCEED,
  GET_ADAPTED_CHAPTERS_FAILED,
  GET_ADAPTED_CHAPTERS_REQUEST,
  GET_ADAPTED_CHAPTERS_SUCCESS,
  GET_ALL_CHAPTER_FAILED,
  GET_ALL_CHAPTER_REQUEST,
  GET_ALL_CHAPTER_SUCCESS,
  GET_CHAPTER_FAILED,
  GET_CHAPTER_REQUEST,
  GET_CHAPTER_SUCCESS,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_FAILED,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_REQUEST,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_SUCCESS,
  GET_CHAPTERS_BY_BOOK_FAILED,
  GET_CHAPTERS_BY_BOOK_REQUEST,
  GET_CHAPTERS_BY_BOOK_SUCCESS,
  GET_PROGRESS_FAILED,
  GET_PROGRESS_REQUEST,
  GET_PROGRESS_SUCCESS,
  SAVE_PROGRESS_FAILED,
  SAVE_PROGRESS_REQUEST,
  SAVE_PROGRESS_SUCCESS,
} from "./chapter.actionType";

const initialState = {
  error: null,
  chapter: null,
  chapters: [],
  adaptedChapters: [],
  readingProgress: null,
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
    case GET_ADAPTED_CHAPTERS_REQUEST:
    case GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_REQUEST:
      return { ...state, error: null };

    case GET_CHAPTER_SUCCESS:
    case CHAPTER_UPLOAD_SUCCEED:
    case EDIT_CHAPTER_SUCCEED:
      return { ...state, error: null, chapter: action.payload };

    case SAVE_PROGRESS_SUCCESS:
    case GET_PROGRESS_SUCCESS:
      return { ...state, error: null, readingProgress: action.payload };
    case DELETE_CHAPTER_SUCCEED:
      return { ...state, error: null };
    case GET_ALL_CHAPTER_SUCCESS:
    case GET_CHAPTERS_BY_BOOK_SUCCESS:
    case GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_SUCCESS:
      return { ...state, error: null, chapters: action.payload };
    case GET_ADAPTED_CHAPTERS_SUCCESS:
      return { ...state, error: null, adaptedChapters: action.payload };
    case CHAPTER_UPLOAD_FAILED:
    case EDIT_CHAPTER_FAILED:
    case DELETE_CHAPTER_FAILED:
    case GET_CHAPTER_FAILED:
    case GET_ALL_CHAPTER_FAILED:
    case SAVE_PROGRESS_FAILED:
    case GET_PROGRESS_FAILED:
    case GET_CHAPTERS_BY_BOOK_FAILED:
    case GET_ADAPTED_CHAPTERS_FAILED:
    case GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_FAILED:
      return { ...state, error: action.payload };

    default:
      return state;
  }
};
