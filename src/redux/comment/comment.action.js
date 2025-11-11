import httpClient from "../../api/api";
import { createLogger } from "../../utils/logger";
import { api, API_BASE_URL } from "../../api/api";
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
  CREATE_REPLY_BOOK_COMMENT_FAILED,
  CREATE_REPLY_BOOK_COMMENT_REQUEST,
  CREATE_REPLY_BOOK_COMMENT_SUCCESS,
  CREATE_REPLY_CHAPTER_COMMENT_FAILED,
  CREATE_REPLY_CHAPTER_COMMENT_REQUEST,
  CREATE_REPLY_CHAPTER_COMMENT_SUCCESS,
  CREATE_POST_COMMENT_FAILED,
  CREATE_POST_COMMENT_REQUEST,
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_REPLY_POST_COMMENT_FAILED,
  CREATE_REPLY_POST_COMMENT_REQUEST,
  CREATE_REPLY_POST_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILED,
  DELETE_COMMENT_REQUEST,
  DELETE_COMMENT_SUCCESS,
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
  LIKE_COMMENT_FAILED,
  LIKE_COMMENT_REQUEST,
  LIKE_COMMENT_SUCCESS,
  GET_BOOK_COMMENT_COUNT_REQUEST,
  GET_BOOK_COMMENT_COUNT_SUCCESS,
  GET_BOOK_COMMENT_COUNT_FAILED,
} from "./comment.actionType";

const logger = createLogger("CommentActions");

const parseApiResponse = (response) => {
  const payload = response?.data;
  if (
    payload &&
    typeof payload === "object" &&
    Object.prototype.hasOwnProperty.call(payload, "data") &&
    Object.prototype.hasOwnProperty.call(payload, "success")
  ) {
    return {
      data: payload.data,
      message: payload.message,
      success: payload.success,
    };
  }
  return {
    data: payload,
    message: null,
    success: true,
  };
};

const getErrorMessage = (error) => {
  if (typeof error?.response?.data?.message === "string") {
    return error.response.data.message;
  }
  if (typeof error?.response?.data === "string") {
    return error.response.data;
  }
  return error?.message || "An unexpected error occurred.";
};

export const createBookCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_BOOK_COMMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/books/${reqData.bookId}/comments`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_BOOK_COMMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    if (!error?.response) {
      logger.info("No response from server");
      const fallback = "No response from server";
      dispatch({ type: CREATE_BOOK_COMMENT_FAILED, payload: fallback });
      return { error: fallback };
    }
    logger.info("Error response data: ", error.response.data);
    logger.info("Error response status: ", error.response.status);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_BOOK_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const createChapterCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_CHAPTER_COMMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/chapters/${reqData.chapterId}/comments`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_CHAPTER_COMMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    if (!error?.response) {
      logger.info("No response from server");
      const fallback = "No response from server";
      dispatch({ type: CREATE_CHAPTER_COMMENT_FAILED, payload: fallback });
      return { error: fallback };
    }
    logger.info("Error response data: ", error.response.data);
    logger.info("Error response status: ", error.response.status);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_CHAPTER_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const createReplyBookCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_BOOK_COMMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/books/${reqData.bookId}/comments/${reqData.parentCommentId}/reply`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_REPLY_BOOK_COMMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    if (!error?.response) {
      logger.info("No response from server");
      const fallback = "No response from server";
      dispatch({ type: CREATE_REPLY_BOOK_COMMENT_FAILED, payload: fallback });
      return { error: fallback };
    }
    logger.info("Error response data: ", error.response.data);
    logger.info("Error response status: ", error.response.status);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_REPLY_BOOK_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const createReplyChapterCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_REQUEST });
  try {
    const response = await api.post(
      `${API_BASE_URL}/api/chapters/${reqData.chapterId}/comments/${reqData.parentCommentId}/reply`,
      reqData.data
    );
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    if (!error?.response) {
      logger.info("No response from server");
      const fallback = "No response from server";
      dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_FAILED, payload: fallback });
      return { error: fallback };
    }
    logger.info("Error response data: ", error.response.data);
    logger.info("Error response status: ", error.response.status);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const createPostCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_COMMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts/${reqData.postId}/comments`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_POST_COMMENT_SUCCESS, payload: data });
    return { success: success ?? true, payload: data, message };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_POST_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const createReplyPostCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_POST_COMMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts/${reqData.postId}/comments/${reqData.parentCommentId}/reply`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_REPLY_POST_COMMENT_SUCCESS, payload: data });
    return { success: success ?? true, payload: data, message };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_REPLY_POST_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const likeCommentAction = (commentId) => async (dispatch) => {
  dispatch({ type: LIKE_COMMENT_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/comments/${commentId}/like`);
    const { data, message, success } = parseApiResponse(response);
    logger.info("Like comment response:", data);
    logger.info("likedByCurrentUser:", data?.likedByCurrentUser);
    dispatch({ type: LIKE_COMMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    if (!error?.response) {
      logger.info("No response from server");
      const fallback = "No response from server";
      dispatch({ type: LIKE_COMMENT_FAILED, payload: fallback });
      return { error: fallback };
    }
    logger.info("Error response data: ", error.response.data);
    logger.info("Error response status: ", error.response.status);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: LIKE_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const deleteCommentAction = (commentId) => async (dispatch) => {
  logger.info("Deleting comment with id: ", commentId);
  dispatch({ type: DELETE_COMMENT_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/api/comments/${commentId}`);
    const { data, message, success } = parseApiResponse(response);
    const deletedId = data ?? commentId;
    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: deletedId });
    return { payload: deletedId, message, success };
  } catch (error) {
    logger.info("error", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: DELETE_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const deletePostCommentAction = (commentId) => async (dispatch) => {
  logger.info("Deleting post comment with id: ", commentId);
  dispatch({ type: DELETE_COMMENT_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/api/comments/${commentId}`);
    const { data, message, success } = parseApiResponse(response);
    const deletedId = data ?? commentId;
    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: deletedId });
    return { success: success ?? true, payload: deletedId, message };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: DELETE_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const editCommentAction = (commentId, comment) => async (dispatch) => {
  logger.info("Edit comment with id: ", commentId);
  dispatch({ type: EDIT_COMMENT_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/comments/${commentId}`, comment);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: EDIT_COMMENT_SUCCESS, payload: data });
    return { success: success ?? true, payload: data, message };
  } catch (error) {
    logger.info("error", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: EDIT_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const getAllCommentByBookAction =
  (isAuth, bookId, page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: GET_ALL_BOOK_COMMENT_REQUEST });
    try {
      const client = isAuth ? api : httpClient;
      const response = await client.get(`${API_BASE_URL}/books/${bookId}/comments?page=${page}&size=${size}`);
      const { data, message, success } = parseApiResponse(response);
      const normalized = {
        comments: data?.comments || data?.content || [],
        page: data?.page ?? page,
        size: data?.size ?? size,
        totalPages: data?.totalPages ?? 0,
        totalElements:
          data?.totalElements ??
          (Array.isArray(data?.comments) ? data.comments.length : Array.isArray(data?.content) ? data.content.length : 0),
      };
      dispatch({ type: GET_ALL_BOOK_COMMENT_SUCCESS, payload: normalized });
      return { payload: data, message, success };
    } catch (error) {
      logger.info("error trying to get all book comment", error);
      const errorMessage = getErrorMessage(error);
      dispatch({ type: GET_ALL_BOOK_COMMENT_FAILED, payload: errorMessage });
      return { error: errorMessage };
    }
  };

export const getAllCommentByChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: GET_ALL_CHAPTER_COMMENT_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/chapters/${chapterId}/comments`);
    const { data, message, success } = parseApiResponse(response);
    const comments = data?.comments || data?.content || (Array.isArray(data) ? data : []);
    dispatch({ type: GET_ALL_CHAPTER_COMMENT_SUCCESS, payload: comments });
    logger.info("Got chapter comments: ", comments);
    return { payload: comments, message, success };
  } catch (error) {
    logger.info("error trying to get all chapter comments", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_ALL_CHAPTER_COMMENT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const getAllCommentByPostAction =
  (isAuth, postId, page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: GET_ALL_POST_COMMENT_REQUEST });
    try {
      const client = isAuth ? api : httpClient;
      const response = await client.get(`${API_BASE_URL}/posts/${postId}/comments?page=${page}&size=${size}`);
      const { data, message, success } = parseApiResponse(response);
      const normalized = {
        comments: data?.comments || data?.content || [],
        page: data?.page ?? page,
        size: data?.size ?? size,
        totalPages: data?.totalPages ?? 0,
        totalElements:
          data?.totalElements ??
          (Array.isArray(data?.comments) ? data.comments.length : Array.isArray(data?.content) ? data.content.length : 0),
      };
      dispatch({ type: GET_ALL_POST_COMMENT_SUCCESS, payload: normalized });
      logger.info("Got post comments: ", data);
      return { payload: data, message, success };
    } catch (error) {
      logger.info("error trying to get all chapter comments", error);
      const errorMessage = getErrorMessage(error);
      dispatch({ type: GET_ALL_POST_COMMENT_FAILED, payload: errorMessage });
      return { error: errorMessage };
    }
  };
export const getAllSensitiveWord = () => async (dispatch) => {
  dispatch({ type: GET_ALL_SENSITIVE_WORDS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/translator/sensitive-words`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_SUCCESS, payload: data || [] });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("error", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const addNewSensitiveWord = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/translator/sensitive-words`, reqData.data);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("error", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const deleteSensitiveWord = (wordId) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/translator/sensitive-words/${wordId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("error", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const getBookCommentCountAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_COMMENT_COUNT_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/${bookId}/comments-count`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_BOOK_COMMENT_COUNT_SUCCESS, payload: { bookId, count: data } });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("error trying to get book comment count", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_BOOK_COMMENT_COUNT_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
