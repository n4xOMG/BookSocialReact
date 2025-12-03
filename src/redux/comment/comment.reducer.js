import {
  ADD_SENSITIVE_WORD_FAILED,
  ADD_SENSITIVE_WORD_REQUEST,
  ADD_SENSITIVE_WORD_SUCCESS,
  CREATE_BOOK_COMMENT_FAILED,
  CREATE_BOOK_COMMENT_REQUEST,
  CREATE_BOOK_COMMENT_SUCCESS,
  CREATE_CHAPTER_COMMENT_FAILED,
  CREATE_CHAPTER_COMMENT_REQUEST,
  CREATE_CHAPTER_COMMENT_SUCCESS,
  CREATE_POST_COMMENT_FAILED,
  CREATE_POST_COMMENT_REQUEST,
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_REPLY_BOOK_COMMENT_FAILED,
  CREATE_REPLY_BOOK_COMMENT_REQUEST,
  CREATE_REPLY_BOOK_COMMENT_SUCCESS,
  CREATE_REPLY_CHAPTER_COMMENT_FAILED,
  CREATE_REPLY_CHAPTER_COMMENT_REQUEST,
  CREATE_REPLY_CHAPTER_COMMENT_SUCCESS,
  CREATE_REPLY_POST_COMMENT_FAILED,
  CREATE_REPLY_POST_COMMENT_REQUEST,
  CREATE_REPLY_POST_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILED,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
  DELETE_SENSITIVE_WORD_FAILED,
  DELETE_SENSITIVE_WORD_REQUEST,
  DELETE_SENSITIVE_WORD_SUCCESS,
  EDIT_COMMENT_FAILED,
  EDIT_COMMENT_REQUEST,
  EDIT_COMMENT_SUCCESS,
  GET_ALL_BOOK_COMMENT_FAILED,
  GET_ALL_BOOK_COMMENT_REQUEST,
  GET_ALL_BOOK_COMMENT_SUCCESS,
  GET_ALL_CHAPTER_COMMENT_FAILED,
  GET_ALL_CHAPTER_COMMENT_REQUEST,
  GET_ALL_CHAPTER_COMMENT_SUCCESS,
  GET_ALL_POST_COMMENT_FAILED,
  GET_ALL_POST_COMMENT_REQUEST,
  GET_ALL_POST_COMMENT_SUCCESS,
  GET_ALL_SENSITIVE_WORDS_FAILED,
  GET_ALL_SENSITIVE_WORDS_REQUEST,
  GET_ALL_SENSITIVE_WORDS_SUCCESS,
  GET_BOOK_COMMENT_COUNT_FAILED,
  GET_BOOK_COMMENT_COUNT_REQUEST,
  GET_BOOK_COMMENT_COUNT_SUCCESS,
  LIKE_COMMENT_FAILED,
  LIKE_COMMENT_REQUEST,
  LIKE_COMMENT_SUCCESS,
} from "./comment.actionType";

const extractErrorMessage = (payload) => {
  if (typeof payload === "string") {
    return payload;
  }
  if (payload && typeof payload === "object" && typeof payload.message === "string") {
    return payload.message;
  }
  return "An unexpected error occurred.";
};

const insertCommentAtStart = (comments = [], comment) => {
  if (!comment) {
    return Array.isArray(comments) ? comments : [];
  }
  const safeComments = Array.isArray(comments) ? comments : [];
  const filtered = safeComments.filter((item) => item?.id !== comment.id);
  return [comment, ...filtered];
};

const mergeComments = (existing = [], incoming = [], { append = false } = {}) => {
  const safeExisting = Array.isArray(existing) ? existing : [];
  const safeIncoming = Array.isArray(incoming) ? incoming : [];
  if (!append) {
    return safeIncoming.slice();
  }
  if (safeIncoming.length === 0) {
    return safeExisting.slice();
  }
  const result = safeExisting.slice();
  const indexById = new Map();
  result.forEach((item, idx) => {
    if (item && item.id) {
      indexById.set(item.id, idx);
    }
  });
  safeIncoming.forEach((item) => {
    if (!item) {
      return;
    }
    if (item.id && indexById.has(item.id)) {
      const position = indexById.get(item.id);
      if (typeof position === "number") {
        result[position] = item;
      }
      return;
    }
    const nextIndex = result.length;
    result.push(item);
    if (item.id) {
      indexById.set(item.id, nextIndex);
    }
  });
  return result;
};

const appendReply = (comments = [], reply) => {
  if (!reply || !reply.parentCommentId) {
    return Array.isArray(comments) ? comments : [];
  }
  const safeComments = Array.isArray(comments) ? comments : [];
  let changed = false;
  const next = safeComments.map((comment) => {
    if (!comment) {
      return comment;
    }
    if (comment.id === reply.parentCommentId) {
      changed = true;
      const existingReplies = Array.isArray(comment.replyComment) ? comment.replyComment.filter((item) => item?.id !== reply.id) : [];
      return { ...comment, replyComment: [...existingReplies, reply] };
    }
    if (Array.isArray(comment.replyComment) && comment.replyComment.length > 0) {
      const updatedReplies = appendReply(comment.replyComment, reply);
      if (updatedReplies !== comment.replyComment) {
        changed = true;
        return { ...comment, replyComment: updatedReplies };
      }
    }
    return comment;
  });
  return changed ? next : safeComments;
};

const updateCommentTree = (comments = [], updated) => {
  if (!updated || !updated.id) {
    return Array.isArray(comments) ? comments : [];
  }
  const safeComments = Array.isArray(comments) ? comments : [];
  let changed = false;
  const next = safeComments.map((comment) => {
    if (!comment) {
      return comment;
    }
    if (comment.id === updated.id) {
      changed = true;
      return updated;
    }
    if (Array.isArray(comment.replyComment) && comment.replyComment.length > 0) {
      const updatedReplies = updateCommentTree(comment.replyComment, updated);
      if (updatedReplies !== comment.replyComment) {
        changed = true;
        return { ...comment, replyComment: updatedReplies };
      }
    }
    return comment;
  });
  return changed ? next : safeComments;
};

const removeCommentById = (comments = [], id) => {
  if (!id) {
    return Array.isArray(comments) ? comments : [];
  }
  const safeComments = Array.isArray(comments) ? comments : [];
  let changed = false;
  const next = [];
  safeComments.forEach((comment) => {
    if (!comment) {
      return;
    }
    if (comment.id === id) {
      changed = true;
      return;
    }
    let updatedReplies = comment.replyComment;
    if (Array.isArray(comment.replyComment) && comment.replyComment.length > 0) {
      updatedReplies = removeCommentById(comment.replyComment, id);
      if (updatedReplies !== comment.replyComment) {
        changed = true;
      }
    }
    if (updatedReplies !== comment.replyComment) {
      next.push({ ...comment, replyComment: updatedReplies });
    } else {
      next.push(comment);
    }
  });
  return changed ? next : safeComments;
};

const initialState = {
  error: null,
  bookComments: [],
  postComments: [],
  chapterComments: [],
  newComment: null,
  sensitiveWords: [],
  newSensitiveWord: null,
  likedComment: null,
  pagination: {
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    hasMore: false,
  },
  bookCommentCounts: {},
};

export const commentReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_BOOK_COMMENT_REQUEST:
    case GET_ALL_POST_COMMENT_REQUEST:
    case GET_ALL_CHAPTER_COMMENT_REQUEST:
    case CREATE_BOOK_COMMENT_REQUEST:
    case CREATE_CHAPTER_COMMENT_REQUEST:
    case CREATE_POST_COMMENT_REQUEST:
    case CREATE_REPLY_BOOK_COMMENT_REQUEST:
    case CREATE_REPLY_CHAPTER_COMMENT_REQUEST:
    case CREATE_REPLY_POST_COMMENT_REQUEST:
    case DELETE_COMMENT_REQUEST:
    case EDIT_COMMENT_REQUEST:
    case LIKE_COMMENT_REQUEST:
    case GET_ALL_SENSITIVE_WORDS_REQUEST:
    case ADD_SENSITIVE_WORD_REQUEST:
    case DELETE_SENSITIVE_WORD_REQUEST:
    case GET_BOOK_COMMENT_COUNT_REQUEST:
      return { ...state, error: null };

    case GET_ALL_BOOK_COMMENT_SUCCESS: {
      const {
        comments = [],
        page = 0,
        size = state.pagination.size,
        totalPages = 0,
        totalElements = comments.length,
      } = action.payload || {};
      const shouldAppend = page > 0;
      const mergedComments = mergeComments(state.bookComments, comments, { append: shouldAppend });
      const hasMore = totalPages > 0 ? page < totalPages - 1 : comments.length === size;
      return {
        ...state,
        error: null,
        bookComments: mergedComments,
        pagination: {
          page,
          size,
          totalPages,
          totalElements,
          hasMore,
        },
      };
    }

    case GET_ALL_POST_COMMENT_SUCCESS: {
      const { comments = [], page = 0 } = action.payload || {};
      const shouldAppend = page > 0;
      const mergedComments = mergeComments(state.postComments, comments, { append: shouldAppend });
      return {
        ...state,
        error: null,
        postComments: mergedComments,
      };
    }

    case GET_ALL_CHAPTER_COMMENT_SUCCESS: {
      const comments = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        error: null,
        chapterComments: comments,
      };
    }

    case CREATE_BOOK_COMMENT_SUCCESS: {
      const comment = action.payload;
      const updatedBookComments = insertCommentAtStart(state.bookComments, comment);
      const updatedPagination = {
        ...state.pagination,
        totalElements: typeof state.pagination.totalElements === "number" ? state.pagination.totalElements + 1 : 1,
      };
      return {
        ...state,
        error: null,
        newComment: comment,
        bookComments: updatedBookComments,
        pagination: updatedPagination,
      };
    }

    case CREATE_POST_COMMENT_SUCCESS: {
      const comment = action.payload;
      return {
        ...state,
        error: null,
        newComment: comment,
        postComments: insertCommentAtStart(state.postComments, comment),
      };
    }

    case CREATE_CHAPTER_COMMENT_SUCCESS: {
      const comment = action.payload;
      return {
        ...state,
        error: null,
        newComment: comment,
        chapterComments: insertCommentAtStart(state.chapterComments, comment),
      };
    }

    case CREATE_REPLY_BOOK_COMMENT_SUCCESS: {
      return {
        ...state,
        error: null,
        newComment: action.payload,
        bookComments: appendReply(state.bookComments, action.payload),
      };
    }

    case CREATE_REPLY_POST_COMMENT_SUCCESS: {
      return {
        ...state,
        error: null,
        newComment: action.payload,
        postComments: appendReply(state.postComments, action.payload),
      };
    }

    case CREATE_REPLY_CHAPTER_COMMENT_SUCCESS: {
      return {
        ...state,
        error: null,
        newComment: action.payload,
        chapterComments: appendReply(state.chapterComments, action.payload),
      };
    }

    case LIKE_COMMENT_SUCCESS: {
      const comment = action.payload;
      const updatedBook = updateCommentTree(state.bookComments, comment);
      const updatedChapter = updateCommentTree(state.chapterComments, comment);
      const updatedPost = updateCommentTree(state.postComments, comment);
      return {
        ...state,
        error: null,
        likedComment: comment,
        bookComments: updatedBook,
        chapterComments: updatedChapter,
        postComments: updatedPost,
      };
    }

    case EDIT_COMMENT_SUCCESS: {
      const updatedComment = action.payload;
      return {
        ...state,
        error: null,
        bookComments: updateCommentTree(state.bookComments, updatedComment),
        chapterComments: updateCommentTree(state.chapterComments, updatedComment),
        postComments: updateCommentTree(state.postComments, updatedComment),
      };
    }

    case DELETE_COMMENT_SUCCESS: {
      const commentId = action.payload;
      const updatedBook = removeCommentById(state.bookComments, commentId);
      const updatedChapter = removeCommentById(state.chapterComments, commentId);
      const updatedPost = removeCommentById(state.postComments, commentId);
      const removedFromBook = updatedBook !== state.bookComments;
      const nextPagination = removedFromBook
        ? {
            ...state.pagination,
            totalElements: Math.max(0, (state.pagination.totalElements || 0) - 1),
          }
        : state.pagination;
      return {
        ...state,
        error: null,
        bookComments: updatedBook,
        chapterComments: updatedChapter,
        postComments: updatedPost,
        pagination: nextPagination,
      };
    }

    case GET_ALL_SENSITIVE_WORDS_SUCCESS: {
      const words = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        error: null,
        sensitiveWords: words,
      };
    }

    case ADD_SENSITIVE_WORD_SUCCESS: {
      const word = action.payload;
      const existing = Array.isArray(state.sensitiveWords) ? state.sensitiveWords : [];
      const filtered = word && word.id ? existing.filter((item) => item?.id !== word.id) : existing;
      const updatedWords = word ? [...filtered, word] : existing;
      return {
        ...state,
        error: null,
        newSensitiveWord: word,
        sensitiveWords: updatedWords,
      };
    }

    case DELETE_SENSITIVE_WORD_SUCCESS: {
      const word = action.payload;
      const existing = Array.isArray(state.sensitiveWords) ? state.sensitiveWords : [];
      const updatedWords = existing.filter((item) => {
        if (!word) {
          return true;
        }
        if (word && typeof word === "object" && word.id) {
          return item?.id !== word.id;
        }
        return item !== word && item?.word !== word;
      });
      return {
        ...state,
        error: null,
        sensitiveWords: updatedWords,
      };
    }

    case GET_BOOK_COMMENT_COUNT_SUCCESS: {
      const { bookId, count } = action.payload || {};
      if (!bookId) {
        return {
          ...state,
          error: null,
        };
      }
      return {
        ...state,
        error: null,
        bookCommentCounts: {
          ...state.bookCommentCounts,
          [bookId]: typeof count === "number" ? count : 0,
        },
      };
    }

    case GET_ALL_BOOK_COMMENT_FAILED:
    case GET_ALL_POST_COMMENT_FAILED:
    case GET_ALL_CHAPTER_COMMENT_FAILED:
    case CREATE_BOOK_COMMENT_FAILED:
    case CREATE_CHAPTER_COMMENT_FAILED:
    case CREATE_POST_COMMENT_FAILED:
    case CREATE_REPLY_BOOK_COMMENT_FAILED:
    case CREATE_REPLY_CHAPTER_COMMENT_FAILED:
    case CREATE_REPLY_POST_COMMENT_FAILED:
    case LIKE_COMMENT_FAILED:
    case DELETE_COMMENT_FAILED:
    case EDIT_COMMENT_FAILED:
    case GET_ALL_SENSITIVE_WORDS_FAILED:
    case ADD_SENSITIVE_WORD_FAILED:
    case DELETE_SENSITIVE_WORD_FAILED:
    case GET_BOOK_COMMENT_COUNT_FAILED:
      return {
        ...state,
        error: extractErrorMessage(action.payload),
      };

    default:
      return state;
  }
};
