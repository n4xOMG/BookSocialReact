// src/redux/posts/post.actions.js

import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  LIKE_POST_SUCCESS,
  FETCH_POSTS_BY_USER_REQUEST,
  FETCH_POSTS_BY_USER_SUCCESS,
  FETCH_POSTS_BY_USER_FAILURE,
  CREATE_POST_COMMENT_REQUEST,
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_POST_COMMENT_FAILED,
  CREATE_REPLY_POST_COMMENT_REQUEST,
  CREATE_REPLY_POST_COMMENT_SUCCESS,
  CREATE_REPLY_POST_COMMENT_FAILED,
  EDIT_POST_COMMENT_REQUEST,
  EDIT_POST_COMMENT_SUCCESS,
  EDIT_POST_COMMENT_FAILED,
  DELETE_POST_COMMENT_REQUEST,
  DELETE_POST_COMMENT_SUCCESS,
  DELETE_POST_COMMENT_FAILED,
  FETCH_POSTS_BY_ID_REQUEST,
  FETCH_POSTS_BY_ID_SUCCESS,
  FETCH_POSTS_BY_ID_FAILURE,
} from "./post.actionType";
import { api, API_BASE_URL } from "../../api/api";
import axios from "axios";

// Fetch all posts with pagination
export const fetchPosts =
  (page = 0, size = 10, sort = "timestamp,desc") =>
  async (dispatch) => {
    dispatch({ type: FETCH_POSTS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/posts`, {
        params: { page, size, sort },
      });
      dispatch({
        type: FETCH_POSTS_SUCCESS,
        payload: {
          content: response.data.content,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          currentPage: response.data.number,
          size: response.data.size,
        },
      });
      return response.data;
    } catch (error) {
      dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
      return null;
    }
  };

export const fetchPostById = (postId) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_BY_ID_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
    console.log("response", response.data);
    dispatch({ type: FETCH_POSTS_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_BY_ID_FAILURE, payload: error.message });
  }
};
export const fetchPostsByUserId = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_BY_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/user/${userId}`);
    dispatch({ type: FETCH_POSTS_BY_USER_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: FETCH_POSTS_BY_USER_FAILURE, payload: error.message });
  }
};

// Add a new post
export const addPost = (postData) => async (dispatch) => {
  dispatch({ type: ADD_POST_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts`, postData);
    dispatch({ type: ADD_POST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ADD_POST_FAILURE, payload: error.message });
  }
};

// Update an existing post
export const updatePost = (postId, postData) => async (dispatch) => {
  dispatch({ type: UPDATE_POST_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/posts/${postId}`, postData);
    dispatch({ type: UPDATE_POST_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
  }
};

// Delete a post
export const deletePost = (postId) => async (dispatch) => {
  dispatch({ type: DELETE_POST_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/api/posts/${postId}`);
    dispatch({ type: DELETE_POST_SUCCESS, payload: postId });
  } catch (error) {
    dispatch({ type: DELETE_POST_FAILURE, payload: error.message });
  }
};

// Like a post
export const likePost = (postId) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/posts/${postId}/like`);
    dispatch({ type: LIKE_POST_SUCCESS, payload: response.data });
  } catch (error) {
    // Handle error if needed
    console.error("Error liking post:", error.message);
  }
};
export const createPostCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_POST_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/posts/${reqData.postId}/comments`, reqData.data);
    dispatch({ type: CREATE_POST_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: CREATE_POST_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_POST_COMMENT_FAILED, payload: error.message });
        return { error: error.data };
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_POST_COMMENT_FAILED, payload: "No response from server" });
      return { error: "No response from server" };
    }
  }
};
export const createReplyPostCommentAction = (reqData) => async (dispatch) => {
  dispatch({ type: CREATE_REPLY_POST_COMMENT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/posts/${reqData.postId}/comments/${reqData.parentCommentId}/reply`, reqData.data);
    dispatch({ type: CREATE_REPLY_POST_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: CREATE_REPLY_POST_COMMENT_FAILED, payload: error.response.data });
        return { error: error.response.data };
      } else {
        dispatch({ type: CREATE_REPLY_POST_COMMENT_FAILED, payload: error.message });
        return { error: error.response.data };
      }
    } else {
      console.log("No response from server");
      dispatch({ type: CREATE_REPLY_POST_COMMENT_FAILED, payload: "No response from server" });
    }
  }
};
export const editPostCommentAction = (commentId, comment) => async (dispatch) => {
  console.log("Edit comment with id: ", commentId);
  dispatch({ type: EDIT_POST_COMMENT_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/comments/${commentId}`, comment);
    dispatch({ type: EDIT_POST_COMMENT_SUCCESS, payload: data });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: EDIT_POST_COMMENT_FAILED, payload: error });
  }
};
export const deletepostCommentAction = (commentId) => async (dispatch) => {
  console.log("Deleting comment with id: ", commentId);
  dispatch({ type: DELETE_POST_COMMENT_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/api/comments/${commentId}`);
    dispatch({ type: DELETE_POST_COMMENT_SUCCESS, payload: commentId });
  } catch (error) {
    console.log("error", error);
    dispatch({ type: DELETE_POST_COMMENT_FAILED, payload: error });
  }
};
