import httpClient from "../../api/api";
import { createLogger } from "../../utils/logger";
import { api, API_BASE_URL } from "../../api/api";
import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
  CREATE_PAYMENT_INTENT_FAILED,
  CREATE_PAYMENT_INTENT_REQUEST,
  CREATE_PAYMENT_INTENT_SUCCESS,
  CREATE_PAYMENT_REQUEST,
  CREATE_PAYMENT_SUCCESS,
  CREATE_PAYMENT_FAILED,
  CONFIRM_PAYMENT_REQUEST,
  CONFIRM_PAYMENT_SUCCESS,
  CONFIRM_PAYMENT_FAILED,
  GET_PAYMENT_PROVIDERS_REQUEST,
  GET_PAYMENT_PROVIDERS_SUCCESS,
  GET_PAYMENT_PROVIDERS_FAILED,
  DELETE_CHAPTER_FAILED,
  DELETE_CHAPTER_REQUEST,
  DELETE_CHAPTER_SUCCEED,
  EDIT_CHAPTER_FAILED,
  EDIT_CHAPTER_REQUEST,
  EDIT_CHAPTER_SUCCEED,
  GET_CHAPTER_FAILED,
  GET_CHAPTER_REQUEST,
  GET_CHAPTER_SUCCESS,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_FAILED,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_REQUEST,
  GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_SUCCESS,
  GET_CHAPTERS_BY_BOOK_FAILED,
  GET_CHAPTERS_BY_BOOK_REQUEST,
  GET_CHAPTERS_BY_BOOK_SUCCESS,
  GET_PROGRESS_FAILED,
  GET_PROGRESS_REQUEST,
  GET_PROGRESS_SUCCESS,
  LIKE_CHAPTER_FAILED,
  LIKE_CHAPTER_REQUEST,
  LIKE_CHAPTER_SUCCESS,
  SAVE_PROGRESS_FAILED,
  SAVE_PROGRESS_REQUEST,
  SAVE_PROGRESS_SUCCESS,
  UNLOCK_CHAPTER_FAILED,
  UNLOCK_CHAPTER_REQUEST,
  UNLOCK_CHAPTER_SUCCESS,
} from "./chapter.actionType";

const logger = createLogger("ChapterActions");

const parseApiResponse = (response) => ({
  data: response?.data?.data,
  message: response?.data?.message,
  success: response?.data?.success,
});

const getErrorMessage = (error) => error?.response?.data?.message || error.message || "An unexpected error occurred.";

export const getAllChaptersByBookIdAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_REQUEST });

  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/${bookId}/chapters`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_SUCCESS, payload: data || [] });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const manageChapterByBookId = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_REQUEST });

  try {
    const response = await api.get(`${API_BASE_URL}/api/books/${bookId}/chapters`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_SUCCESS, payload: data || [] });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};

export const getChaptersByBookAndLanguageAction = (bookId, languageId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/books/${bookId}/chapters/languages/${languageId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_SUCCESS, payload: data || [] });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const getChapterById = (chapterId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  try {
    const response = await httpClient.get(`${API_BASE_URL}/chapters/${chapterId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });

    logger.info("Chapter: ", data);
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to retreiving chapter: ", error.response?.status);
    if (error.response?.status === 403) {
      dispatch({ type: GET_CHAPTER_FAILED, payload: "You need to unlock this chapter to read it" });
      return { payload: { error: "You need to unlock this chapter to read it" } };
    }
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_CHAPTER_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const getChapterByRoomId = (roomId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  logger.info("Inside getChapterByRoomId Room ID: ", roomId);
  try {
    logger.info("API_BASE_URL: ", API_BASE_URL);
    const response = await api.get(`${API_BASE_URL}/api/chapters/room/${roomId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });

    logger.info("Chapter: ", data);
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to retreiving chapter: ", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_CHAPTER_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const addDraftChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  logger.info("Chapter Data: ", chapterData);
  try {
    const response = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters/draft`, chapterData);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to add new chapter: ", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const publishChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  logger.info("Chapter Data: ", chapterData);
  try {
    const response = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters`, chapterData);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to add new chapter: ", error);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const editChapterAction = (chapterData) => async (dispatch) => {
  dispatch({ type: EDIT_CHAPTER_REQUEST });
  logger.info("Edit Chapter Data: ", chapterData.id);
  try {
    const response = await api.put(`${API_BASE_URL}/api/chapters/${chapterData.id}`, chapterData);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: EDIT_CHAPTER_SUCCEED, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to add new chapter: ", error.message);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: EDIT_CHAPTER_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const deleteChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: DELETE_CHAPTER_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/api/chapters/${chapterId}`);
    const { message, success } = parseApiResponse(response);
    dispatch({ type: DELETE_CHAPTER_SUCCEED, payload: chapterId });
    return { payload: chapterId, message, success };
  } catch (error) {
    logger.info("Api error when trying to delete chapter: ", error.message);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: DELETE_CHAPTER_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const saveChapterProgressAction = (chapterId, userId, progress) => async (dispatch) => {
  dispatch({ type: SAVE_PROGRESS_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/chapters/${chapterId}/progress`, { userId, progress });
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: SAVE_PROGRESS_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: SAVE_PROGRESS_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const getReadingProgressByUserAndChapter = (chapterId) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/reading-progress/chapters/${chapterId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_PROGRESS_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const unlockChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: UNLOCK_CHAPTER_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/unlock/${chapterId}`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: UNLOCK_CHAPTER_SUCCESS, payload: data, meta: { chapterId } });
    logger.info("Chapter unlocked: ", data);
    return { payload: data, message, success };
  } catch (error) {
    logger.info("Api error when trying to unlock chapter: ", error.message);
    const errorMessage = getErrorMessage(error);
    dispatch({ type: UNLOCK_CHAPTER_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
export const createPaymentIntent = (purchaseRequest) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_INTENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/create-payment-intent`, purchaseRequest);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_PAYMENT_INTENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_PAYMENT_INTENT_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};

// Confirm Payment
export const confirmPayment = (confirmPaymentRequest) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/confirm-payment`, confirmPaymentRequest);
    const { data, message, success } = parseApiResponse(response);
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    error.message = errorMessage;
    throw error;
  }
};
export const clearChapters = () => ({
  type: "CLEAR_CHAPTERS",
});
export const likeChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: LIKE_CHAPTER_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/chapters/${chapterId}/like`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: LIKE_CHAPTER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: LIKE_CHAPTER_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};

// Get available payment providers
export const getPaymentProviders = () => async (dispatch) => {
  dispatch({ type: GET_PAYMENT_PROVIDERS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/payments/providers`);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: GET_PAYMENT_PROVIDERS_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: GET_PAYMENT_PROVIDERS_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};

// Create unified payment (supports both Stripe and PayPal)
export const createPayment = (purchaseRequest) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/create-payment`, purchaseRequest);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CREATE_PAYMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CREATE_PAYMENT_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};

// Confirm unified payment
export const confirmUnifiedPayment = (confirmPaymentRequest) => async (dispatch) => {
  dispatch({ type: CONFIRM_PAYMENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/confirm-payment`, confirmPaymentRequest);
    const { data, message, success } = parseApiResponse(response);
    dispatch({ type: CONFIRM_PAYMENT_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    dispatch({ type: CONFIRM_PAYMENT_FAILED, payload: errorMessage });
    error.message = errorMessage;
    throw error;
  }
};

// Capture PayPal order
export const capturePaypalOrder = (orderID) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/orders/${orderID}/capture`);
    const { data, message, success } = parseApiResponse(response);
    return { payload: data, message, success };
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    error.message = errorMessage;
    throw error;
  }
};
