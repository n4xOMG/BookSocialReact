import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import { GET_PROGRESS_FAILED, GET_PROGRESS_REQUEST, GET_PROGRESS_SUCCESS } from "../chapter/chapter.actionType";
import {
  ADD_NEW_CATEGORY_FAILED,
  ADD_NEW_CATEGORY_REQUEST,
  ADD_NEW_CATEGORY_SUCCESS,
  ADD_NEW_LANGUAGE_FAILED,
  ADD_NEW_LANGUAGE_REQUEST,
  ADD_NEW_LANGUAGE_SUCCESS,
  BOOK_DELETE_FAILED,
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCEED,
  BOOK_EDIT_FAILED,
  BOOK_EDIT_REQUEST,
  BOOK_EDIT_SUCCEED,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  DELETE_CATEGORY_FAILED,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_LANGUAGE_FAILED,
  DELETE_LANGUAGE_REQUEST,
  DELETE_LANGUAGE_SUCCESS,
  EDIT_CATEGORY_FAILED,
  EDIT_CATEGORY_REQUEST,
  EDIT_CATEGORY_SUCCESS,
  EDIT_LANGUAGE_FAILED,
  EDIT_LANGUAGE_REQUEST,
  EDIT_LANGUAGE_SUCCESS,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_ALL_CATEGORIES_FAILED,
  GET_ALL_CATEGORIES_REQUEST,
  GET_ALL_CATEGORIES_SUCCESS,
  GET_AVG_BOOK_RATING_FAILED,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_CATEGORIES_BY_BOOK_FAILED,
  GET_CATEGORIES_BY_BOOK_REQUEST,
  GET_CATEGORIES_BY_BOOK_SUCCESS,
  GET_LANGUAGES_BY_BOOK_FAILED,
  GET_LANGUAGES_BY_BOOK_REQUEST,
  GET_LANGUAGES_BY_BOOK_SUCCESS,
  GET_LANGUAGES_WITH_COUNTS_FAILED,
  GET_LANGUAGES_WITH_COUNTS_REQUEST,
  GET_LANGUAGES_WITH_COUNTS_SUCCESS,
  GET_LATEST_UPDATE_BOOK_FAILED,
  GET_LATEST_UPDATE_BOOK_REQUEST,
  GET_LATEST_UPDATE_BOOK_SUCCESS,
  GET_READING_PROGRESSES_BY_BOOK_FAILED,
  GET_READING_PROGRESSES_BY_BOOK_REQUEST,
  GET_READING_PROGRESSES_BY_BOOK_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
} from "./book.actionType";

export const getAllBookAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books`);
    dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all books", error.message);
    dispatch({ type: GET_ALL_BOOK_FAILED, payload: error });
  }
};
export const getLatestUpdateBook = () => async (dispatch) => {
  dispatch({ type: GET_LATEST_UPDATE_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/latest-update`);
    dispatch({ type: GET_LATEST_UPDATE_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get latest book", error.message);
    dispatch({ type: GET_LATEST_UPDATE_BOOK_FAILED, payload: error });
  }
};
export const getAllUserFollowingBookAction = (userId) => async (dispatch) => {
  dispatch({ type: GET_ALL_BOOK_REQUEST });
  try {
    const { data } = await api.get(`/api/books/favoured/${userId}`);
    dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all user favoured books", error.message);
    dispatch({ type: GET_ALL_BOOK_FAILED, payload: error });
  }
};

export const getBookByIdAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}`);
    dispatch({ type: GET_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to retreiving book: ", error.message);
    dispatch({ type: GET_BOOK_FAILED, payload: error.message });
  }
};

export const getReadingProgressByBookChaptersAndUser = (userId, chapters) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_REQUEST });
  try {
    const readingProgresses = await Promise.all(
      chapters.map(async (chapter) => {
        const progressResponse = await api.get(`${API_BASE_URL}/api/reading-progress/${userId}/${chapter.id}`);
        return progressResponse.data;
      })
    );
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: readingProgresses });
    return { payload: readingProgresses };
  } catch (error) {
    console.log("Api error when trying to add new book: ", error.message);
    dispatch({ type: GET_PROGRESS_FAILED, payload: error.message });
  }
};

export const addNewBookAction = (bookData) => async (dispatch) => {
  dispatch({ type: BOOK_UPLOAD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/translator/books`, bookData.data);
    dispatch({ type: BOOK_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new book: ", error.message);
    dispatch({ type: BOOK_UPLOAD_FAILED, payload: error.message });
  }
};
export const editBookAction = (bookData) => async (dispatch) => {
  dispatch({ type: BOOK_EDIT_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/translator/books/${bookData.data.id}`, bookData.data);
    dispatch({ type: BOOK_EDIT_SUCCEED, payload: response.data });
  } catch (error) {
    console.log("Api error when trying to edit book: ", error.message);
    dispatch({ type: BOOK_EDIT_FAILED, payload: error.message });
  }
};

export const deleteBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: BOOK_DELETE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/translator/books/${bookId}`);
    dispatch({ type: BOOK_DELETE_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete book: ", error.message);
    dispatch({ type: BOOK_DELETE_FAILED, payload: error.message });
  }
};
export const followBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: FOLLOW_BOOK_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/books/follow/${bookId}`);
    dispatch({ type: FOLLOW_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to follow book: ", error.message);
    dispatch({ type: FOLLOW_BOOK_FAILED, payload: error.message });
  }
};

export const searchBookAction = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/books/search`, { params: { query } });
    dispatch({ type: SEARCH_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error", error.message);
    dispatch({ type: SEARCH_BOOK_FAILED, payload: error });
  }
};

export const ratingBookAction = (bookId, rating) => async (dispatch) => {
  dispatch({ type: RATING_BOOK_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/api/books/rating/${bookId}`, { rating });
    dispatch({ type: RATING_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to rating book: ", error.message);
    dispatch({ type: RATING_BOOK_FAILED, payload: error.message });
  }
};

export const getBookRatingByUserAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_RATING_BY_USER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/rating/${bookId}`);
    dispatch({ type: GET_BOOK_RATING_BY_USER_SUCCESS, payload: data });
  } catch (error) {
    if (error.response && error.response.status === 204) {
      dispatch({ type: GET_BOOK_RATING_BY_USER_FAILED, payload: 0 });
      return { error: "NO_RATING" };
    }
    dispatch({ type: GET_BOOK_RATING_BY_USER_FAILED, payload: error.message });
  }
};

export const getAvgBookRating = (bookId) => async (dispatch) => {
  dispatch({ type: GET_AVG_BOOK_RATING_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/rating/average/${bookId}`);
    dispatch({ type: GET_AVG_BOOK_RATING_SUCCESS, payload: data });
  } catch (error) {
    if (error.response && error.response.status === 204) {
      dispatch({ type: GET_AVG_BOOK_RATING_FAILED, payload: 0 });
      return { error: "NO_RATING" };
    }
    dispatch({ type: GET_AVG_BOOK_RATING_FAILED, payload: error.message });
  }
};

export const getAllReadingProgressesByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reading-progress/books/${bookId}`);
    dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book progresses: ", error);
    dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_FAILED, payload: error.message });
  }
};

export const getAllLanguages = () => async (dispatch) => {
  dispatch({ type: GET_LANGUAGES_BY_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/languages`);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book languages: ", error.message);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_FAILED, payload: error.message });
  }
};
export const getLanguagesByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_LANGUAGES_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/languages`);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book languages: ", error.message);
    dispatch({ type: GET_LANGUAGES_BY_BOOK_FAILED, payload: error.message });
  }
};
export const addNewLanguage = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_NEW_LANGUAGE_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/languages`, reqData.data);
    dispatch({ type: ADD_NEW_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to add language: ", error.message);
    dispatch({ type: ADD_NEW_LANGUAGE_FAILED, payload: error.message });
  }
};

export const editLanguageAction = (reqData) => async (dispatch) => {
  dispatch({ type: EDIT_LANGUAGE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/languages/${reqData.data.id}`, reqData.data);
    dispatch({ type: EDIT_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to edit language: ", error.message);
    dispatch({ type: EDIT_LANGUAGE_FAILED, payload: error.message });
  }
};

export const deleteLanguageAction = (langId) => async (dispatch) => {
  dispatch({ type: DELETE_LANGUAGE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/languages/${langId}`);
    dispatch({ type: DELETE_LANGUAGE_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete language: ", error);
    dispatch({ type: DELETE_LANGUAGE_FAILED, payload: error.message });
  }
};

export const getAllCategories = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CATEGORIES_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/categories`);
    dispatch({ type: GET_ALL_CATEGORIES_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get categories: ", error);
    dispatch({ type: GET_ALL_CATEGORIES_FAILED, payload: error.message });
  }
};
export const getCategoriesByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CATEGORIES_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/categories`);
    dispatch({ type: GET_CATEGORIES_BY_BOOK_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to get book categories: ", error);
    dispatch({ type: GET_CATEGORIES_BY_BOOK_FAILED, payload: error.message });
  }
};
export const getLanguagesWithChapterCounts = (bookId) => async (dispatch) => {
  dispatch({ type: GET_LANGUAGES_WITH_COUNTS_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/languages`);
    const { languages, chapterCounts } = data;
    dispatch({ type: GET_LANGUAGES_WITH_COUNTS_SUCCESS, payload: { languages, chapterCounts } });
  } catch (error) {
    console.log("Api error when trying to retrieve languages and chapter counts: ", error);
    dispatch({ type: GET_LANGUAGES_WITH_COUNTS_FAILED, payload: error.message });
  }
};
export const addNewCategory = (reqData) => async (dispatch) => {
  dispatch({ type: ADD_NEW_CATEGORY_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/books/categories`, reqData.data);
    dispatch({ type: ADD_NEW_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to add category: ", error);
    dispatch({ type: ADD_NEW_CATEGORY_FAILED, payload: error.message });
  }
};

export const editCategoryAction = (reqData) => async (dispatch) => {
  dispatch({ type: EDIT_CATEGORY_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/books/categories/${reqData.data.id}`, reqData.data);
    dispatch({ type: EDIT_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to edit category: ", error);
    dispatch({ type: EDIT_CATEGORY_FAILED, payload: error.message });
  }
};

export const deleteCategoryAction = (categoryId) => async (dispatch) => {
  dispatch({ type: DELETE_CATEGORY_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/books/categories/${categoryId}`);
    dispatch({ type: DELETE_CATEGORY_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete category: ", error);
    dispatch({ type: DELETE_CATEGORY_FAILED, payload: error.message });
  }
};
