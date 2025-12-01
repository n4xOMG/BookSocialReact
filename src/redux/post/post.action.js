import httpClient from "../../api/api";
import { createLogger } from "../../utils/logger";
import { api, API_BASE_URL } from "../../api/api";
import { extractErrorMessage, extractPaginatedResponse, extractResponsePayload } from "../../utils/apiResponseHelpers";
import {
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  FETCH_POSTS_BY_ID_FAILURE,
  FETCH_POSTS_BY_ID_REQUEST,
  FETCH_POSTS_BY_ID_SUCCESS,
  FETCH_POSTS_BY_USER_FAILURE,
  FETCH_POSTS_BY_USER_REQUEST,
  FETCH_POSTS_BY_USER_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  LIKE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
} from "./post.actionType";

const logger = createLogger("PostActions");

export const fetchPosts =
  (page = 0, size = 10, sort = "timestamp,desc") =>
  async (dispatch) => {
    dispatch({ type: FETCH_POSTS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/posts`, {
        params: { page, size, sort },
      });
      const { message, success } = extractResponsePayload(response);
      const pagination = extractPaginatedResponse(response);
      const content = Array.isArray(pagination.content) ? pagination.content : [];
      const payload = {
        ...pagination,
        content,
        currentPage: pagination.page,
        hasMore: !pagination.last,
      };
      dispatch({ type: FETCH_POSTS_SUCCESS, payload });
      return { payload, message, success };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      logger.error("Failed to fetch posts", error);
      dispatch({ type: FETCH_POSTS_FAILURE, payload: errorMessage });
      return { error: errorMessage };
    }
  };

export const fetchPostById = (isAuthOrPostId, maybePostId) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_BY_ID_REQUEST });
  const postId = typeof maybePostId !== "undefined" ? maybePostId : isAuthOrPostId;
  if (!postId) {
    const errorMessage = "Post id is required.";
    dispatch({ type: FETCH_POSTS_BY_ID_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
  try {
    const isAuth = typeof maybePostId !== "undefined" ? isAuthOrPostId : true;
    const client = isAuth ? api : httpClient;
    const response = await client.get(`${API_BASE_URL}/posts/${postId}`);
    const { data, message, success } = extractResponsePayload(response);
    const post = data || null;
    dispatch({ type: FETCH_POSTS_BY_ID_SUCCESS, payload: post });
    return { payload: post, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Failed to fetch post by id", error);
    dispatch({ type: FETCH_POSTS_BY_ID_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const fetchPostsByUserId = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_BY_USER_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/posts/user/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    const posts = Array.isArray(data) ? data : Array.isArray(data?.content) ? data.content : [];
    dispatch({ type: FETCH_POSTS_BY_USER_SUCCESS, payload: posts });
    return { payload: posts, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Failed to fetch posts by user", error);
    dispatch({ type: FETCH_POSTS_BY_USER_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
};

// Add a new post
export const addPost = (postData) => async (dispatch) => {
  dispatch({ type: ADD_POST_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts`, postData);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: ADD_POST_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Failed to add post", error);
    dispatch({ type: ADD_POST_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
};

// Update an existing post
export const updatePost = (postId, postData) => async (dispatch) => {
  dispatch({ type: UPDATE_POST_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/posts/${postId}`, postData);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: UPDATE_POST_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Failed to update post", error);
    dispatch({ type: UPDATE_POST_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
};

// Delete a post
export const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/api/posts/${postId}`);
    const { data, message, success } = extractResponsePayload(response);
    const deletedId = (data && typeof data === "object" && (data.id || data.postId)) ? (data.id || data.postId) : postId;
    dispatch({ type: DELETE_POST_SUCCESS, payload: deletedId });
    return { payload: deletedId, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Failed to delete post", error);
    dispatch({ type: DELETE_POST_FAILURE, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const likePost = (postId) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts/${postId}/like`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: LIKE_POST_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Error liking post:", errorMessage);
    return { error: errorMessage };
  }
};
