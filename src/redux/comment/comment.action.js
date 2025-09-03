import axios from "axios";
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

export const createBookCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_BOOK_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${reqData.bookId}/comments`, reqData.data);
    dispatch({ type: CREATE_BOOK_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: CREATE_BOOK_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_BOOK_COMMENT_FAILED, payload: error.message });
        return { error: error.data };
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_BOOK_COMMENT_FAILED, payload: "No response from server" });
      return { error: "No response from server" };
    }
  }
};

export const createChapterCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_CHAPTER_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/chapters/${reqData.chapterId}/comments`, reqData.data);
    dispatch({ type: CREATE_CHAPTER_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: CREATE_CHAPTER_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_CHAPTER_COMMENT_FAILED, payload: error.message });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_CHAPTER_COMMENT_FAILED, payload: "No response from server" });
    }
  }
};

export const createReplyBookCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_BOOK_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${reqData.bookId}/comments/${reqData.parentCommentId}/reply`, reqData.data);
    dispatch({ type: CREATE_REPLY_BOOK_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: CREATE_REPLY_BOOK_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_REPLY_BOOK_COMMENT_FAILED, payload: error.message });
        return { error: error.response.data };
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_REPLY_BOOK_COMMENT_FAILED, payload: "No response from server" });
    }
  }
};

export const createReplyChapterCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_REQUEST });
  try {
    const { data } = await api.post(
      `${API_BASE_URL}/api/chapters/${reqData.chapterId}/comments/${reqData.parentCommentId}/reply`,
      reqData.data
    );
    dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 400) {
        dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_FAILED, payload: error.message });
        return { error: error.response.data };
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_REPLY_CHAPTER_COMMENT_FAILED, payload: "No response from server" });
    }
  }
};

export const likeCommentAction = (commentId) => async (dispatch) => {
  dispatch({ type: LIKE_COMMENT_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/comments/${commentId}/like`);
    console.log("Like comment response:", data); // Debug log
    console.log("likedByCurrentUser:", data.likedByCurrentUser); // Check this specific property
    dispatch({ type: LIKE_COMMENT_SUCCESS, payload: data });
    return { payload: data }; // Return the response data for component use
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 400) {
        dispatch({ type: LIKE_COMMENT_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: LIKE_COMMENT_FAILED, payload: error.message });
      }
      return { error: error.response?.data || error.message };
    } else {
      console.log("No response from server");
      dispatch({ type: LIKE_COMMENT_FAILED, payload: "No response from server" });
      return { error: "No response from server" };
    }
  }
};

export const deleteCommentAction = (commentId) => async (dispatch) => {
  console.log("Deleting comment with id: ", commentId);
  dispatch({ type: DELETE_COMMENT_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/comments/${commentId}`);
    dispatch({ type: DELETE_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: DELETE_COMMENT_FAILED, payload: error });
  }
};

export const editCommentAction = (commentId, comment) => async (dispatch) => {
  console.log("Edit comment with id: ", commentId);
  dispatch({ type: EDIT_COMMENT_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/comments/${commentId}`, comment);
    dispatch({ type: EDIT_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: EDIT_COMMENT_FAILED, payload: error });
  }
};

export const getAllCommentByBookAction =
  (isAuth, bookId, page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: GET_ALL_BOOK_COMMENT_REQUEST });
    try {
      const apiClient = isAuth ? api : axios;
      const { data } = await apiClient.get(`${API_BASE_URL}/books/${bookId}/comments?page=${page}&size=${size}`);
      dispatch({ type: GET_ALL_BOOK_COMMENT_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      console.log("error trying to get all book comment", error);
      dispatch({ type: GET_ALL_BOOK_COMMENT_FAILED, payload: error });
    }
  };

export const getAllCommentByChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: GET_ALL_CHAPTER_COMMENT_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/chapters/${chapterId}/comments`);
    // Handle paginated response format
    const comments = data.comments || data.content || (Array.isArray(data) ? data : []);
    dispatch({ type: GET_ALL_CHAPTER_COMMENT_SUCCESS, payload: comments });
    console.log("Got chapter comments: ", comments);
    return { payload: comments };
  } catch (error) {
    console.log("error trying to get all chapter comments", error);
    dispatch({ type: GET_ALL_CHAPTER_COMMENT_FAILED, payload: error });
    // Return empty array on error
    return { payload: [] };
  }
};
export const getAllCommentByPostAction = (postId) => async (dispatch) => {
  dispatch({ type: GET_ALL_POST_COMMENT_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/posts/${postId}/comments`);
    dispatch({ type: GET_ALL_POST_COMMENT_SUCCESS, payload: data });
    console.log("Got post comments: ", data);
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all chapter comments", error);
    dispatch({ type: GET_ALL_POST_COMMENT_FAILED, payload: error });
  }
};
export const getAllSensitiveWord = () => async (dispatch) => {
  dispatch({ type: GET_ALL_SENSITIVE_WORDS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/translator/sensitive-words`);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: GET_ALL_SENSITIVE_WORDS_FAILED, payload: error });
  }
};

export const addNewSensitiveWord = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/translator/sensitive-words`, reqData.data);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: error });
  }
};

export const deleteSensitiveWord = (wordId) => async (dispatch) => {
  dispatch({ type: ADD_SENSITIVE_WORD_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/translator/sensitive-words/${wordId}`);
    dispatch({ type: ADD_SENSITIVE_WORD_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: ADD_SENSITIVE_WORD_FAILED, payload: error });
  }
};

export const getBookCommentCountAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_COMMENT_COUNT_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/comments-count`);
    dispatch({ type: GET_BOOK_COMMENT_COUNT_SUCCESS, payload: { bookId, count: data } });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get book comment count", error);
    dispatch({ type: GET_BOOK_COMMENT_COUNT_FAILED, payload: error });
    return { error };
  }
};
