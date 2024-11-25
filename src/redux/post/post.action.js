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
} from "./post.actionType";
import { api, API_BASE_URL } from "../../api/api";
import axios from "axios";

// Fetch all posts
export const fetchPosts = () => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/posts`);
    dispatch({ type: FETCH_POSTS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_POSTS_FAILURE, payload: error.message });
  }
};

export const fetchPostsByUserId = (userId) => async (dispatch) => {
  dispatch({ type: FETCH_POSTS_BY_USER_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/posts/${userId}`);
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
