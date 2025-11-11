import httpClient, { api, API_BASE_URL } from "../../api/api";
import { extractErrorMessage, extractResponsePayload } from "../../utils/apiResponseHelpers";
import { createLogger } from "../../utils/logger";
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
  GET_BOOK_COUNT_FAILED,
  GET_BOOK_COUNT_REQUEST,
  GET_BOOK_COUNT_SUCCESS,
  GET_BOOK_FAILED,
  GET_BOOK_RATING_BY_USER_FAILED,
  GET_BOOK_RATING_BY_USER_REQUEST,
  GET_BOOK_RATING_BY_USER_SUCCESS,
  GET_BOOK_REQUEST,
  GET_BOOK_SUCCESS,
  GET_BOOKS_BY_AUTHOR_FAILED,
  GET_BOOKS_BY_AUTHOR_REQUEST,
  GET_BOOKS_BY_AUTHOR_SUCCESS,
  GET_BOOKS_BY_MONTH_FAILED,
  GET_BOOKS_BY_MONTH_REQUEST,
  GET_BOOKS_BY_MONTH_SUCCESS,
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
  GET_RELATED_BOOKS_FAILED,
  GET_RELATED_BOOKS_REQUEST,
  GET_RELATED_BOOKS_SUCCESS,
  GET_TRENDING_BOOKS_FAILED,
  GET_TRENDING_BOOKS_REQUEST,
  GET_TRENDING_BOOKS_SUCCESS,
  RATING_BOOK_FAILED,
  RATING_BOOK_REQUEST,
  RATING_BOOK_SUCCESS,
  RECORD_BOOK_VIEW_FAILED,
  RECORD_BOOK_VIEW_REQUEST,
  RECORD_BOOK_VIEW_SUCCESS,
  RESET_BOOK_DETAIL,
  SEARCH_BOOK_FAILED,
  SEARCH_BOOK_REQUEST,
  SEARCH_BOOK_SUCCESS,
  SET_EDIT_CHOICE_FAILED,
  SET_EDIT_CHOICE_REQUEST,
  SET_EDIT_CHOICE_SUCCESS,
} from "./book.actionType";

const logger = createLogger("BookActions");

export const getAllBookAction =
  (page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: GET_ALL_BOOK_REQUEST });
    try {
      const { data } = await httpClient.get(`${API_BASE_URL}/books`, {
        params: { page, size },
      });
      dispatch({ type: GET_ALL_BOOK_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.info("error trying to get all books", message);
      dispatch({ type: GET_ALL_BOOK_FAILED, payload: message });
    }
  };

export const getUserFavouredBooksAction =
  ({ page = 0, size = 10 } = {}) =>
  async (dispatch) => {
    dispatch({ type: GET_FAVOURED_BOOK_REQUEST });
    try {
      const { data } = await httpClient.get(`${API_BASE_URL}/api/books/favoured`, {
        params: { page, size },
      });
      dispatch({ type: GET_FAVOURED_BOOK_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.info("error trying to get all user favoured books", message);
      dispatch({ type: GET_FAVOURED_BOOK_FAILED, payload: message });
    }
  };

export const getBookByIdAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_REQUEST });

  if (!bookId) {
    dispatch({ type: GET_BOOK_FAILED, payload: "Invalid book ID" });
    return { error: "Invalid book ID" };
  }

  try {
    // Reset book detail before fetching new one
    dispatch({ type: RESET_BOOK_DETAIL });

    const { data } = await httpClient.get(`${API_BASE_URL}/books/${bookId}`);
    dispatch({ type: GET_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to retrieve book: ", message);
    dispatch({ type: GET_BOOK_FAILED, payload: message });
    return { error: message };
  }
};

export const getBooksByAuthorAction =
  ({ query = "", page = 0, size = 10, categories = [], tags = [], sortBy = "title", sortDir = "asc" } = {}) =>
  async (dispatch) => {
    dispatch({ type: GET_BOOKS_BY_AUTHOR_REQUEST });
    try {
      const params = new URLSearchParams();

      params.append("page", page);
      params.append("size", size);
      if (query) params.append("query", query);
      if (sortBy) params.append("sortBy", sortBy);
      if (sortDir) params.append("sortDir", sortDir);
      if (categories && categories.length) {
        categories.forEach((catId) => params.append("categoryIds", catId));
      }
      if (tags && tags.length) {
        tags.forEach((tagId) => params.append("tagIds", tagId));
      }

      const response = await httpClient.get(`${API_BASE_URL}/api/author/books/search`, { params });
      logger.info("Response: ", response);
      const payload = response?.data?.data ?? response?.data ?? [];

      dispatch({ type: GET_BOOKS_BY_AUTHOR_SUCCESS, payload });
      return { payload };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.info("Error fetching books by author:", message);
      dispatch({ type: GET_BOOKS_BY_AUTHOR_FAILED, payload: message });
      return { error: message };
    }
  };

export const getFeaturedBooks = () => async (dispatch) => {
  dispatch({ type: GET_FEATURED_BOOKS_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/featured`);
    dispatch({ type: GET_FEATURED_BOOKS_SUCCESS, payload: response.data });
  } catch (error) {
    const message = extractErrorMessage(error);
    dispatch({ type: GET_FEATURED_BOOKS_FAILED, payload: message });
  }
};
export const getTrendingBooks = () => async (dispatch) => {
  dispatch({ type: GET_TRENDING_BOOKS_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/top-likes`);
    dispatch({ type: GET_TRENDING_BOOKS_SUCCESS, payload: response.data });
  } catch (error) {
    const message = extractErrorMessage(error);
    dispatch({ type: GET_TRENDING_BOOKS_FAILED, payload: message });
  }
};
export const getRecentUpdatedBooks =
  (limit = 5) =>
  async (dispatch) => {
    dispatch({ type: GET_LATEST_UPDATE_BOOK_REQUEST });
    try {
      const { data } = await httpClient.get(`${API_BASE_URL}/books/latest-update`, {
        params: { limit },
      });
      dispatch({ type: GET_LATEST_UPDATE_BOOK_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.info("Error fetching recently updated books:", message);
      dispatch({ type: GET_LATEST_UPDATE_BOOK_FAILED, payload: message });
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
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to add new book: ", message);
    dispatch({ type: GET_PROGRESS_FAILED, payload: message });
  }
};

export const addNewBookAction = (bookData) => async (dispatch) => {
  dispatch({ type: BOOK_UPLOAD_REQUEST });
  try {
    const response = await httpClient.post(`${API_BASE_URL}/api/books`, bookData);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to create book.");
    }

    dispatch({ type: BOOK_UPLOAD_SUCCEED, payload: data });
    return { payload: data, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to add new book: ", message);
    dispatch({ type: BOOK_UPLOAD_FAILED, payload: message });
    return { error: message };
  }
};
export const editBookAction = (bookId, bookData) => async (dispatch) => {
  dispatch({ type: BOOK_EDIT_REQUEST });
  try {
    const response = await httpClient.put(`${API_BASE_URL}/api/books/${bookId}`, bookData);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to edit book.");
    }

    dispatch({ type: BOOK_EDIT_SUCCEED, payload: data });
    return { payload: data, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to edit book: ", message);
    dispatch({ type: BOOK_EDIT_FAILED, payload: message });
    return { error: message };
  }
};

export const deleteBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: BOOK_DELETE_REQUEST });
  try {
    const response = await httpClient.delete(`${API_BASE_URL}/api/books/${bookId}`);
    const { success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to delete book.");
    }

    dispatch({ type: BOOK_DELETE_SUCCEED, payload: bookId });
    return { success: true, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to delete book: ", message);
    dispatch({ type: BOOK_DELETE_FAILED, payload: message });
    return { error: message };
  }
};
export const followBookAction = (bookId) => async (dispatch) => {
  dispatch({ type: FOLLOW_BOOK_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/books/follow/${bookId}`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to update favourites.");
    }

    dispatch({ type: FOLLOW_BOOK_SUCCESS, payload: data });
    return { payload: data, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to follow book: ", message);
    dispatch({ type: FOLLOW_BOOK_FAILED, payload: message });
    return { error: message };
  }
};

export const searchBookAction =
  (params, forDropdown = false) =>
  async (dispatch) => {
    dispatch({ type: SEARCH_BOOK_REQUEST });
    try {
      logger.info("Params", params);
      const { data } = await httpClient.get(`${API_BASE_URL}/books/search`, { params });

      // If this is for dropdown, we use a different action type to not affect the search results page
      if (forDropdown) {
        return { payload: data };
      } else {
        dispatch({ type: SEARCH_BOOK_SUCCESS, payload: data });
        return { payload: data };
      }
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.info("Error searching books:", message);
      dispatch({ type: SEARCH_BOOK_FAILED, payload: message });
    }
  };

export const ratingBookAction = (bookId, rating) => async (dispatch) => {
  dispatch({ type: RATING_BOOK_REQUEST });
  try {
    const response = await api.patch(`${API_BASE_URL}/api/books/rating/${bookId}`, { rating });
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to rate book.");
    }

    dispatch({ type: RATING_BOOK_SUCCESS, payload: data });
    return { payload: data, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to rating book: ", message);
    dispatch({ type: RATING_BOOK_FAILED, payload: message });
    return { error: message };
  }
};

export const getBookRatingByUserAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_BOOK_RATING_BY_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/books/rating/${bookId}`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to get user rating.");
    }

    dispatch({ type: GET_BOOK_RATING_BY_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    if (error.response && error.response.status === 204) {
      dispatch({ type: GET_BOOK_RATING_BY_USER_FAILED, payload: 0 });
      return { error: "NO_RATING" };
    }
    const message = extractErrorMessage(error);
    dispatch({ type: GET_BOOK_RATING_BY_USER_FAILED, payload: message });
    return { error: message };
  }
};

export const getAvgBookRating = (bookId) => async (dispatch) => {
  dispatch({ type: GET_AVG_BOOK_RATING_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/rating/average/${bookId}`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to get average rating.");
    }

    dispatch({ type: GET_AVG_BOOK_RATING_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    if (error.response && error.response.status === 204) {
      dispatch({ type: GET_AVG_BOOK_RATING_FAILED, payload: 0 });
      return { error: "NO_RATING" };
    }
    const message = extractErrorMessage(error);
    dispatch({ type: GET_AVG_BOOK_RATING_FAILED, payload: message });
    return { error: message };
  }
};

export const getAllReadingProgressesByBook = (bookId) => async (dispatch) => {
  dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/api/reading-progress/books/${bookId}`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to get reading progresses.");
    }

    dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to get book progresses: ", message);
    dispatch({ type: GET_READING_PROGRESSES_BY_BOOK_FAILED, payload: message });
    return { error: message };
  }
};
export const setEditorChoice = (bookId, bookData) => async (dispatch) => {
  dispatch({ type: SET_EDIT_CHOICE_REQUEST });
  try {
    const response = await httpClient.put(`${API_BASE_URL}/admin/books/${bookId}/editor-choice`, bookData);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to update editor choice.");
    }

    dispatch({ type: SET_EDIT_CHOICE_SUCCESS, payload: data });
    return { payload: data, message };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Api error when trying to edit book: ", message);
    dispatch({ type: SET_EDIT_CHOICE_FAILED, payload: message });
    return { error: message };
  }
};
export const getRelatedBooksAction = (bookId, categoryId, tagIds) => async (dispatch) => {
  dispatch({ type: GET_RELATED_BOOKS_REQUEST });
  try {
    const params = new URLSearchParams();
    if (categoryId) params.append("categoryId", categoryId);
    if (tagIds && tagIds.length > 0) tagIds.forEach((id) => params.append("tagIds", id));
    const { data } = await httpClient.get(`${API_BASE_URL}/books/${bookId}/related`, { params });
    dispatch({ type: GET_RELATED_BOOKS_SUCCESS, payload: data });
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Error fetching related books:", message);
    dispatch({ type: GET_RELATED_BOOKS_FAILED, payload: message });
  }
};

export const getBookCountAction = () => async (dispatch) => {
  dispatch({ type: GET_BOOK_COUNT_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/count`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to get book count.");
    }

    dispatch({ type: GET_BOOK_COUNT_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("error trying to get book count", message);
    dispatch({ type: GET_BOOK_COUNT_FAILED, payload: message });
  }
};

export const getBooksUploadedPerMonth = () => async (dispatch) => {
  dispatch({ type: GET_BOOKS_BY_MONTH_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/books-upload-per-month`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to get books uploaded per month.");
    }

    dispatch({ type: GET_BOOKS_BY_MONTH_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Error fetching books uploaded per month:", message);
    dispatch({ type: GET_BOOKS_BY_MONTH_FAILED, payload: message });
  }
};

export const recordBookViewAction = (bookId) => async (dispatch) => {
  if (!bookId) {
    return { error: "Invalid book ID" };
  }

  dispatch({ type: RECORD_BOOK_VIEW_REQUEST });
  try {
    const response = await httpClient.post(`${API_BASE_URL}/books/${bookId}/views`);
    const { data, success, message } = extractResponsePayload(response);

    if (!success) {
      throw new Error(message || "Failed to record book view.");
    }

    dispatch({ type: RECORD_BOOK_VIEW_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.info("Error recording book view:", message);
    dispatch({ type: RECORD_BOOK_VIEW_FAILED, payload: message });
    return { error: message };
  }
};
