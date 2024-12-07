import {
  ADD_SENSITIVE_WORD_FAILED,
  ADD_SENSITIVE_WORD_REQUEST,
  ADD_SENSITIVE_WORD_SUCCESS,
  CREATE_BOOK_COMMENT_FAILED,
  CREATE_BOOK_COMMENT_REQUEST,
  CREATE_BOOK_COMMENT_SUCCESS,
  CREATE_CHAPTER_COMMENT_SUCCESS,
  CREATE_REPLY_BOOK_COMMENT_FAILED,
  CREATE_REPLY_BOOK_COMMENT_SUCCESS,
  CREATE_REPLY_CHAPTER_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILED,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_SENSITIVE_WORD_FAILED,
  DELETE_SENSITIVE_WORD_REQUEST,
  DELETE_SENSITIVE_WORD_SUCCESS,
  EDIT_COMMENT_SUCCESS,
  GET_ALL_BOOK_COMMENT_FAILED,
  GET_ALL_BOOK_COMMENT_REQUEST,
  GET_ALL_BOOK_COMMENT_SUCCESS,
  GET_ALL_CHAPTER_COMMENT_REQUEST,
  GET_ALL_CHAPTER_COMMENT_SUCCESS,
  GET_ALL_SENSITIVE_WORDS_FAILED,
  GET_ALL_SENSITIVE_WORDS_REQUEST,
  GET_ALL_SENSITIVE_WORDS_SUCCESS,
  LIKE_COMMENT_FAILED,
  LIKE_COMMENT_SUCCESS,
} from "./comment.actionType";

const initialState = {
  error: null,
  bookComments: [],
  chapterComments: [],
  newComment: null,
  sensitiveWords: [],
  newSensitiveWord: null,
  likedComment: null,
};

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOOK_COMMENT_REQUEST:
    case GET_ALL_CHAPTER_COMMENT_REQUEST:
    case GET_ALL_SENSITIVE_WORDS_REQUEST:
    case CREATE_BOOK_COMMENT_REQUEST:
    case DELETE_COMMENT_REQUEST:
    case ADD_SENSITIVE_WORD_REQUEST:
    case DELETE_SENSITIVE_WORD_REQUEST:
      return { ...state, error: null };

    case GET_ALL_BOOK_COMMENT_SUCCESS:
      return {
        ...state,
        bookComments: action.payload,
        error: null,
      };
    case GET_ALL_CHAPTER_COMMENT_SUCCESS:
      return {
        ...state,
        chapterComments: action.payload,
        error: null,
      };
    case GET_ALL_SENSITIVE_WORDS_SUCCESS:
      return { ...state, error: null, sensitiveWords: action.payload };

    case CREATE_BOOK_COMMENT_SUCCESS:
      return {
        ...state,
        newComment: action.payload,
        bookComments: [...state.bookComments, action.payload],
        error: null,
      };
    case CREATE_CHAPTER_COMMENT_SUCCESS:
      return {
        ...state,
        newComment: action.payload,
        chapterComments: [...state.chapterComments, action.payload],
        error: null,
      };

    case CREATE_REPLY_BOOK_COMMENT_SUCCESS:
      return {
        ...state,
        bookComments: state.bookComments.map((comment) => {
          if (comment.id === action.payload.parentCommentId) {
            return {
              ...comment,
              replyComment: comment.replyComment ? [...comment.replyComment, action.payload.reply] : [action.payload.reply],
            };
          }
          return comment;
        }),
        error: null,
      };

    case CREATE_REPLY_CHAPTER_COMMENT_SUCCESS:
      return {
        ...state,
        chapterComments: state.chapterComments.map((comment) => {
          if (comment.id === action.payload.parentCommentId) {
            return {
              ...comment,
              replyComment: comment.replyComment ? [...comment.replyComment, action.payload.reply] : [action.payload.reply],
            };
          }
          return comment;
        }),
        error: null,
      };

    case LIKE_COMMENT_SUCCESS:
      return { ...state, error: null, likedComment: action.payload };
    case ADD_SENSITIVE_WORD_SUCCESS:
      return { ...state, error: null, newSensitiveWord: action.payload };
    case EDIT_COMMENT_SUCCESS:
      return {
        ...state,
        error: null,
        bookComments: state.bookComments.map((comment) => (comment.id === action.payload.id ? action.payload : comment)),
        chapterComments: state.chapterComments.map((comment) => (comment.id === action.payload.id ? action.payload : comment)),
      };
    case DELETE_SENSITIVE_WORD_SUCCESS:
    case DELETE_COMMENT_SUCCESS:
      return {
        ...state,
        error: null,
        bookComments: state.bookComments.filter((comment) => comment.id !== action.payload),
        chapterComments: state.chapterComments.filter((comment) => comment.id !== action.payload),
      };

    case GET_ALL_BOOK_COMMENT_FAILED:
    case GET_ALL_SENSITIVE_WORDS_FAILED:
    case CREATE_BOOK_COMMENT_FAILED:
    case CREATE_REPLY_BOOK_COMMENT_FAILED:
    case LIKE_COMMENT_FAILED:
    case DELETE_COMMENT_FAILED:
    case ADD_SENSITIVE_WORD_FAILED:
    case DELETE_SENSITIVE_WORD_FAILED:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
