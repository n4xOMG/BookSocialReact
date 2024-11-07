import { api, API_BASE_URL } from "../../api/api";
import {
  DELETE_USER_FAILED,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_FAILED,
  GET_READING_PROGRESS_BY_USER_REQUEST,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_USER_FAV_BOOKS_FAILED,
  GET_USER_FAV_BOOKS_REQUEST,
  GET_USER_FAV_BOOKS_SUCCESS,
  GET_USER_FAV_IMAGES_FAILED,
  GET_USER_FAV_IMAGES_REQUEST,
  GET_USER_FAV_IMAGES_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  SUSPEND_USER_SUCCESS,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UNSUSPEND_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
} from "./user.actionType";

export const getAllUsers = (page, size, searchTerm) => async (dispatch) => {
  dispatch({ type: GET_ALL_USERS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/users`, {
      params: { page, size, searchTerm },
    });

    console.log("users", data);
    dispatch({ type: GET_ALL_USERS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: GET_ALL_USERS_FAILED, payload: error.message });
  }
};

export const editUserAction = (userId, userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/admin/users/update/${userId}`, userData);

    console.log("Edited user", data);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: UPDATE_USER_FAILED, payload: error.message });
  }
};

export const deleteUserAction = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const { data } = await api.delete(`${API_BASE_URL}/admin/users/delete/${userId}`);

    console.log("Deleted user", data);
    dispatch({ type: DELETE_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: DELETE_USER_FAILED, payload: error.message });
  }
};

export const suspendUserAction = (userId) => async (dispatch) => {
  dispatch({ type: SUSPEND_USER_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/admin/users/suspend/${userId}`);

    console.log("Suspended user", data);
    dispatch({ type: SUSPEND_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: SUSPEND_USER_FAILED, payload: error.message });
  }
};

export const unsuspendUserAction = (userId) => async (dispatch) => {
  dispatch({ type: UNSUSPEND_USER_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/admin/users/unsuspend/${userId}`);

    console.log("Unsuspended user", data);
    dispatch({ type: UNSUSPEND_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: UNSUSPEND_USER_FAILED, payload: error.message });
  }
};
export const getReadingProgressByUser = () => async (dispatch) => {
  dispatch({ type: GET_READING_PROGRESS_BY_USER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reading-progress`);
    dispatch({ type: GET_READING_PROGRESS_BY_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_READING_PROGRESS_BY_USER_FAILED, payload: error.message });
  }
};
export const getAllUserFollowingBookAction = () => async (dispatch) => {
  dispatch({ type: GET_USER_FAV_BOOKS_REQUEST });
  try {
    const { data } = await api.get(`/api/books/favoured`);
    dispatch({ type: GET_USER_FAV_BOOKS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all user favoured books", error.message);
    dispatch({ type: GET_USER_FAV_BOOKS_FAILED, payload: error });
  }
};
export const getUserFavImages = () => async (dispatch) => {
  dispatch({ type: GET_USER_FAV_IMAGES_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/gallery/favoured`);
    dispatch({ type: GET_USER_FAV_IMAGES_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("error trying to get all images", error.message);
    dispatch({ type: GET_USER_FAV_IMAGES_FAILED, payload: error });
  }
};
