import axios from "axios";
import { API_BASE_URL, api } from "../../api/api";
import {
  ADD_CATEGORY_FAILED,
  ADD_CATEGORY_REQUEST,
  ADD_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILED,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  EDIT_CATEGORY_FAILED,
  EDIT_CATEGORY_REQUEST,
  EDIT_CATEGORY_SUCCESS,
  GET_BOOKS_BY_CATEGORY_FAILED,
  GET_BOOKS_BY_CATEGORY_REQUEST,
  GET_BOOKS_BY_CATEGORY_SUCCESS,
  GET_CATEGORIES_FAILED,
  GET_CATEGORIES_REQUEST,
  GET_CATEGORIES_SUCCESS,
  GET_CATEGORY_BY_BOOK_FAILED,
  GET_CATEGORY_BY_BOOK_REQUEST,
  GET_CATEGORY_BY_BOOK_SUCCESS,
  GET_CATEGORY_FAILED,
  GET_CATEGORY_REQUEST,
  GET_CATEGORY_SUCCESS,
  GET_TOP_CATEGORIES_FAILED,
  GET_TOP_CATEGORIES_REQUEST,
  GET_TOP_CATEGORIES_SUCCESS,
} from "./category.actionType";

export const getCategories = () => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/categories`);
    dispatch({ type: GET_CATEGORIES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CATEGORIES_FAILED, payload: error.message });
  }
};

export const getCategoryById = (categoryId) => async (dispatch) => {
  dispatch({ type: GET_CATEGORY_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/categories/${categoryId}`);
    dispatch({ type: GET_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CATEGORY_FAILED, payload: error.message });
  }
};

export const getBooksByCategories = (categoryIds) => async (dispatch) => {
  dispatch({ type: GET_BOOKS_BY_CATEGORY_REQUEST });
  try {
    const promises = categoryIds.map((categoryId) => axios.get(`${API_BASE_URL}/categories/${categoryId}/books`));
    const results = await Promise.all(promises);
    const booksByCategory = results.reduce((acc, result, index) => {
      acc[categoryIds[index]] = result.data;
      return acc;
    }, {});
    dispatch({ type: GET_BOOKS_BY_CATEGORY_SUCCESS, payload: booksByCategory });
  } catch (error) {
    dispatch({ type: GET_BOOKS_BY_CATEGORY_FAILED, payload: error.message });
  }
};

export const getCategoriesByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CATEGORY_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/categories`);
    dispatch({ type: GET_CATEGORY_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_CATEGORY_BY_BOOK_FAILED, payload: error.message });
  }
};
export const getTopCategoriesWithBooks = () => async (dispatch) => {
  dispatch({ type: GET_TOP_CATEGORIES_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/books/top-categories`);
    dispatch({ type: GET_TOP_CATEGORIES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_TOP_CATEGORIES_FAILED, payload: error.message });
  }
};
export const addCategory = (category) => async (dispatch) => {
  dispatch({ type: ADD_CATEGORY_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/categories`, category);
    dispatch({ type: ADD_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ADD_CATEGORY_FAILED, payload: error.message });
  }
};

export const editCategory = (categoryId, category) => async (dispatch) => {
  dispatch({ type: EDIT_CATEGORY_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/categories/${categoryId}`, category);
    dispatch({ type: EDIT_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: EDIT_CATEGORY_FAILED, payload: error.message });
  }
};

export const deleteCategory = (categoryId) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/admin/categories/${categoryId}`);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: categoryId });
  } catch (error) {
    dispatch({ type: DELETE_CATEGORY_FAILED, payload: error.message });
  }
};
