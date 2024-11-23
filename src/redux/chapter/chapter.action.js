import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  CHAPTER_UPLOAD_FAILED,
  CHAPTER_UPLOAD_REQUEST,
  CHAPTER_UPLOAD_SUCCEED,
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
  SAVE_PROGRESS_FAILED,
  SAVE_PROGRESS_REQUEST,
  SAVE_PROGRESS_SUCCESS,
} from "./chapter.actionType";

export const getAllChaptersByBookIdAction = (bookId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTERS_BY_BOOK_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/chapters`);
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
export const getChapterById = (bookId, chapterId) => async (dispatch) => {
  dispatch({ type: GET_CHAPTER_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/books/${bookId}/chapters/${chapterId}`);
    dispatch({ type: GET_CHAPTER_SUCCESS, payload: data });
  } catch (error) {
    console.log("Api error when trying to retreiving chapter: ", error);
    dispatch({ type: GET_CHAPTER_FAILED, payload: error.message });
  }
};

export const addChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: CHAPTER_UPLOAD_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters`, chapterData);
    dispatch({ type: CHAPTER_UPLOAD_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error);
    dispatch({ type: CHAPTER_UPLOAD_FAILED, payload: error.message });
  }
};
export const editChapterAction = (bookId, chapterData) => async (dispatch) => {
  dispatch({ type: EDIT_CHAPTER_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterData.id}`, chapterData);
    dispatch({ type: EDIT_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to add new chapter: ", error.message);
    dispatch({ type: EDIT_CHAPTER_FAILED, payload: error.message });
  }
};
export const deleteChapterAction = (bookId, chapterId) => async (dispatch) => {
  dispatch({ type: DELETE_CHAPTER_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}`);
    dispatch({ type: DELETE_CHAPTER_SUCCEED, payload: data });
  } catch (error) {
    console.log("Api error when trying to delete chapter: ", error.message);
    dispatch({ type: DELETE_CHAPTER_FAILED, payload: error.message });
  }
};
export const saveChapterProgressAction = (bookId, chapterId, userId, progress) => async (dispatch) => {
  dispatch({ type: SAVE_PROGRESS_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/books/${bookId}/chapters/${chapterId}/progress`, { userId, progress });
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
