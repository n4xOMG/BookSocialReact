import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import { GET_PROGRESS_FAILED, GET_PROGRESS_REQUEST, GET_PROGRESS_SUCCESS } from "../chapter/chapter.actionType";
import {
  BOOK_DELETE_FAILED,
  BOOK_DELETE_REQUEST,
  BOOK_DELETE_SUCCEED,
  BOOK_EDIT_FAILED,
  BOOK_EDIT_REQUEST,
  BOOK_EDIT_SUCCEED,
  BOOK_UPLOAD_FAILED,
  BOOK_UPLOAD_REQUEST,
  BOOK_UPLOAD_SUCCEED,
  FOLLOW_BOOK_FAILED,
  FOLLOW_BOOK_REQUEST,
  FOLLOW_BOOK_SUCCESS,
  GET_ALL_BOOK_FAILED,
  GET_ALL_BOOK_REQUEST,
  GET_ALL_BOOK_SUCCESS,
  GET_AVG_BOOK_RATING_FAILED,
  GET_AVG_BOOK_RATING_REQUEST,
  GET_AVG_BOOK_RATING_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_BOOKS_BY_AUTHOR_FAILED,
  GET_BOOKS_BY_AUTHOR_REQUEST,
  GET_BOOKS_BY_AUTHOR_SUCCESS,
  GET_FAVOURED_BOOK_FAILED,
  GET_FAVOURED_BOOK_REQUEST,
  GET_FAVOURED_BOOK_SUCCESS,
  GET_FEATURED_BOOKS_FAILED,
  GET_FEATURED_BOOKS_REQUEST,
  GET_FEATURED_BOOKS_SUCCESS,
  GET_LATEST_UPDATE_BOOK_FAILED,
  GET_LATEST_UPDATE_BOOK_REQUEST,
  GET_LATEST_UPDATE_BOOK_SUCCESS,
  GET_READING_PROGRESSES_BY_BOOK_FAILED,
  GET_READING_PROGRESSES_BY_BOOK_REQUEST,
  GET_READING_PROGRESSES_BY_BOOK_SUCCESS,
  GET_TRENDING_BOOKS_FAILED,
  GET_TRENDING_BOOKS_REQUEST,
  GET_TRENDING_BOOKS_SUCCESS,
  GET_USER_BOOKS_FAILED,
  GET_USER_BOOKS_REQUEST,
  GET_USER_BOOKS_SUCCESS,
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

export const getUserFavouredBooksAction = () => async (dispatch) => {
  dispatch({ type: GET_FAVOURED_BOOK_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/favoured`);
    dispatch({ type: GET_FAVOURED_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all user favoured books", error.message);
    dispatch({ type: GET_FAVOURED_BOOK_FAILED, payload: error });
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

export const getBooksByAuthorAction = (authorId) => async (dispatch) => {
  dispatch({ type: GET_BOOKS_BY_AUTHOR_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/author/${authorId}`);
    dispatch({ type: GET_BOOKS_BY_AUTHOR_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Error fetching books by author:", error.message);
    dispatch({ type: GET_BOOKS_BY_AUTHOR_FAILED, payload: error });
  }
};

export const getFeaturedBooks = () => async (dispatch) => {
  dispatch({ type: GET_FEATURED_BOOKS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/books/featured`);
    dispatch({ type: GET_FEATURED_BOOKS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_FEATURED_BOOKS_FAILED, payload: error.message });
  }
};
export const getTrendingBooks = () => async (dispatch) => {
  dispatch({ type: GET_TRENDING_BOOKS_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/books/top-views`);
    dispatch({ type: GET_TRENDING_BOOKS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_TRENDING_BOOKS_FAILED, payload: error.message });
  }
};
export const getRecentUpdatedBooksAction =
  (limit = 5) =>
  async (dispatch) => {
    dispatch({ type: GET_LATEST_UPDATE_BOOK_REQUEST });
    try {
      const { data } = await axios.get(`${API_BASE_URL}/books/latest-update`, {
        params: { limit },
      });
      dispatch({ type: GET_LATEST_UPDATE_BOOK_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      console.log("Error fetching recently updated books:", error.message);
      dispatch({ type: GET_LATEST_UPDATE_BOOK_FAILED, payload: error });
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
    const { data } = await api.post(`${API_BASE_URL}/api/books`, bookData);
    dispatch({ type: BOOK_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new book: ", error.message);
    dispatch({ type: BOOK_UPLOAD_FAILED, payload: error.message });
  }
};
export const editBookAction = (bookId, bookData) => async (dispatch) => {
  dispatch({ type: BOOK_EDIT_REQUEST });
  console.log("bookData", bookData);
  try {
    const response = await api.put(`${API_BASE_URL}/api/books/${bookId}`, bookData);
    dispatch({ type: BOOK_EDIT_SUCCEED, payload: response.data });
  } catch (error) {
    console.log("Api error when trying to edit book: ", error.message);
    dispatch({ type: BOOK_EDIT_FAILED, payload: error.message });
  }
};

export const deleteBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: BOOK_DELETE_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/books/${bookId}`);
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

export const searchBookAction = (title, categoryId, tagIds) => async (dispatch) => {
  dispatch({ type: SEARCH_BOOK_REQUEST });
  try {
    const params = {};

    if (title) params.title = title;
    if (categoryId) params.categoryId = categoryId;
    if (tagIds && tagIds.length > 0) params.tagIds = tagIds;

    const { data } = await api.get(`${API_BASE_URL}/books/search`, { params });
    dispatch({ type: SEARCH_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Error searching books:", error.message);
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
