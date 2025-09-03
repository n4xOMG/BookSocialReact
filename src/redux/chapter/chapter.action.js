import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
  CREATE_PAYMENT_INTENT_FAILED,
  CREATE_PAYMENT_INTENT_REQUEST,
  CREATE_PAYMENT_INTENT_SUCCESS,
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

export const getAllChaptersByBookIdAction = (jwt, bookId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_REQUEST });

  try {
    const apiClient = jwt ? api : axios; // Choose the API client based on `jwt`
    const { data } = await apiClient.get(`${API_BASE_URL}/books/${bookId}/chapters`);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_CHAPTERS_BY_BOOK_FAILED, payload: error.message });
  }
};

export const manageChapterByBookId = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_REQUEST });

  try {
    const { data } = await api.get(`${API_BASE_URL}/api/books/${bookId}/chapters`);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_CHAPTERS_BY_BOOK_FAILED, payload: error.message });
  }
};

export const getChaptersByBookAndLanguageAction = (bookId, languageId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/chapters/languages/${languageId}`);
    dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_CHAPTERS_BY_BOOK_AND_LANGUAGE_FAILED, payload: error.message });
  }
};
export const getChapterById = (jwt, chapterId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  try {
    const apiClient = jwt ? api : axios; // Choose the API client based on `jwt`
    const { data } = await apiClient.get(`${API_BASE_URL}/chapters/${chapterId}`);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });

    console.log("Chapter: ", data);
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to retreiving chapter: ", error.response?.status);
    if (error.response?.status === 403) {
      dispatch({ type: GET_CHAPTER_FAILED, payload: "You need to unlock this chapter to read it" });
      return { payload: { error: "You need to unlock this chapter to read it" } };
    }
    dispatch({ type: GET_CHAPTER_FAILED, payload: error.message });
  }
};
export const getChapterByRoomId = (roomId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  console.log("Inside getChapterByRoomId Room ID: ", roomId);
  try {
    console.log("API_BASE_URL: ", API_BASE_URL);
    const { data } = await api.get(`${API_BASE_URL}/api/chapters/room/${roomId}`);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });

    console.log("Chapter: ", data);
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to retreiving chapter: ", error);

    dispatch({ type: GET_CHAPTER_FAILED, payload: error.message });
  }
};
export const addDraftChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  console.log("Chapter Data: ", chapterData);
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters/draft`, chapterData);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: error.message });
  }
};
export const publishChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  console.log("Chapter Data: ", chapterData);
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters`, chapterData);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: error.message });
  }
};
export const editChapterAction = (chapterData) => async (dispatch) => {
  dispatch({ type: EDIT_CHAPTER_REQUEST });
  console.log("Edit Chapter Data: ", chapterData.id);
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/chapters/${chapterData.id}`, chapterData);
    dispatch({ type: EDIT_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error.message);
    dispatch({ type: EDIT_CHAPTER_FAILED, payload: error.message });
  }
};
export const deleteChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: DELETE_CHAPTER_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/chapters/${chapterId}`);
    dispatch({ type: DELETE_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete chapter: ", error.message);
    dispatch({ type: DELETE_CHAPTER_FAILED, payload: error.message });
  }
};
export const saveChapterProgressAction = (chapterId, userId, progress) => async (dispatch) => {
  dispatch({ type: SAVE_PROGRESS_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/chapters/${chapterId}/progress`, { userId, progress });
    dispatch({ type: SAVE_PROGRESS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: SAVE_PROGRESS_FAILED, payload: error.message });
  }
};
export const getReadingProgressByUserAndChapter = (chapterId) => async (dispatch) => {
  dispatch({ type: GET_PROGRESS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reading-progress/chapters/${chapterId}`);
    dispatch({ type: GET_PROGRESS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_PROGRESS_FAILED, payload: error.message });
  }
};
export const unlockChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: UNLOCK_CHAPTER_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/unlock/${chapterId}`);
    dispatch({ type: UNLOCK_CHAPTER_SUCCESS, payload: data });
    console.log("Chapter unlocked: ", data);
  } catch (error) {
    console.log("Api error when trying to unlock chapter: ", error.message);
    dispatch({ type: UNLOCK_CHAPTER_FAILED, payload: error.message });
  }
};
export const createPaymentIntent = (purchaseRequest) => async (dispatch) => {
  dispatch({ type: CREATE_PAYMENT_INTENT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/create-payment-intent`, purchaseRequest);
    dispatch({ type: CREATE_PAYMENT_INTENT_SUCCESS, payload: response.data });
    return response.data;
  } catch (error) {
    dispatch({ type: CREATE_PAYMENT_INTENT_FAILED, payload: error.message });
    throw error;
  }
};

// Confirm Payment
export const confirmPayment = (confirmPaymentRequest) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/payments/confirm-payment`, confirmPaymentRequest);

    return response.data;
  } catch (error) {
    throw error;
  }
};
export const clearChapters = () => ({
  type: "CLEAR_CHAPTERS",
});
export const likeChapterAction = (chapterId) => async (dispatch) => {
  dispatch({ type: LIKE_CHAPTER_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/chapters/${chapterId}/like`);
    dispatch({ type: LIKE_CHAPTER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: LIKE_CHAPTER_FAILED, payload: error.message });
    throw error;
  }
};
