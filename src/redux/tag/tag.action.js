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
import { API_BASE_URL, api } from "../../api/api";
import axios from "axios";

export const getTags = () => async (dispatch) => {
  dispatch({ type: GET_TAGS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/tags`);
    dispatch({ type: GET_TAGS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TAGS_FAILED, payload: error.message });
  }
};

export const getTagById = (tagId) => async (dispatch) => {
  dispatch({ type: GET_TAG_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/tags/${tagId}`);
    dispatch({ type: GET_TAG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TAG_FAILED, payload: error.message });
  }
};

export const addTag = (tag) => async (dispatch) => {
  dispatch({ type: ADD_TAG_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/books/tags`, tag);
    dispatch({ type: ADD_TAG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ADD_TAG_FAILED, payload: error.message });
  }
};

export const editTag = (tagId, tag) => async (dispatch) => {
  dispatch({ type: EDIT_TAG_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/books/tags/${tagId}`, tag);
    dispatch({ type: EDIT_TAG_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EDIT_TAG_FAILED, payload: error.message });
  }
};

export const deleteTag = (tagId) => async (dispatch) => {
  dispatch({ type: DELETE_TAG_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/admin/books/tags/${tagId}`);
    dispatch({ type: DELETE_TAG_SUCCESS, payload: tagId });
  } catch (error) {
    dispatch({ type: DELETE_TAG_FAILED, payload: error.message });
  }
};

export const getTagsByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_TAGS_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/tags`);
    dispatch({ type: GET_TAGS_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_TAGS_BY_BOOK_FAILED, payload: error.message });
  }
};
