import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
import {
  BAN_USER_FAILED,
  BAN_USER_REQUEST,
  BAN_USER_SUCCESS,
  DELETE_USER_FAILED,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_FAILED,
  GET_READING_PROGRESS_BY_USER_REQUEST,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_USER_BY_ID_FAILED,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  SUSPEND_USER_SUCCESS,
  UNBAN_USER_FAILED,
  UNBAN_USER_REQUEST,
  UNBAN_USER_SUCCESS,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UNSUSPEND_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ROLE_FAILED,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
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

export const getUserById = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_ID_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/user/profile/${userId}`);

    console.log("User", data);
    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: GET_USER_BY_ID_FAILED, payload: error.message });
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
export const banUserAction = (userId) => async (dispatch) => {
  dispatch({ type: BAN_USER_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/admin/users/ban/${userId}`);

    console.log("Banned user", data);
    dispatch({ type: BAN_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: BAN_USER_FAILED, payload: error.message });
  }
};

export const unbanUserAction = (userId) => async (dispatch) => {
  dispatch({ type: UNBAN_USER_REQUEST });
  try {
    const { data } = await api.patch(`${API_BASE_URL}/admin/users/unban/${userId}`);

    console.log("Unbanned user", data);
    dispatch({ type: UNBAN_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: UNBAN_USER_FAILED, payload: error.message });
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
export const updateUserRoleAction = (userId, roleName) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_ROLE_REQUEST });
  try {
    const { data } = await api.put(
      `${API_BASE_URL}/admin/users/${userId}/role`,
      null, // No request body
      { params: { roleName } } // Query parameter
    );

    console.log("Updated user role", data);
    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: UPDATE_USER_ROLE_FAILED, payload: error.response?.data || error.message });
  }
};
