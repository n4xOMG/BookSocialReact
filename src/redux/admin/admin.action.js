import { api } from "../../api/api";
import * as types from "./admin.actionType";

// Analytics Actions
export const fetchUserAnalytics = () => async (dispatch) => {
  dispatch({ type: types.FETCH_USER_ANALYTICS_REQUEST });
  try {
    const response = await api.get("/admin/dashboard/users");
    dispatch({
      type: types.FETCH_USER_ANALYTICS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_USER_ANALYTICS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const fetchRevenueAnalytics = () => async (dispatch) => {
  dispatch({ type: types.FETCH_REVENUE_ANALYTICS_REQUEST });
  try {
    const response = await api.get("/admin/dashboard/revenue");
    dispatch({
      type: types.FETCH_REVENUE_ANALYTICS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_REVENUE_ANALYTICS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const fetchContentAnalytics = () => async (dispatch) => {
  dispatch({ type: types.FETCH_CONTENT_ANALYTICS_REQUEST });
  try {
    const response = await api.get("/admin/dashboard/content");
    dispatch({
      type: types.FETCH_CONTENT_ANALYTICS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_CONTENT_ANALYTICS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const fetchPlatformAnalytics = () => async (dispatch) => {
  dispatch({ type: types.FETCH_PLATFORM_ANALYTICS_REQUEST });
  try {
    const response = await api.get("/admin/dashboard/platform");
    dispatch({
      type: types.FETCH_PLATFORM_ANALYTICS_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.FETCH_PLATFORM_ANALYTICS_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

// User Management Actions
export const fetchAllUsers =
  (page = 0, size = 10, searchTerm = "") =>
  async (dispatch) => {
    dispatch({ type: types.FETCH_ALL_USERS_REQUEST });
    try {
      const response = await api.get("/admin/users", {
        params: { page, size, searchTerm },
      });
      dispatch({
        type: types.FETCH_ALL_USERS_SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: types.FETCH_ALL_USERS_FAILURE,
        payload: error.response?.data || error.message,
      });
    }
  };

export const updateUser = (userId, userData) => async (dispatch) => {
  dispatch({ type: types.UPDATE_USER_REQUEST });
  try {
    const response = await api.put(`/admin/users/update/${userId}`, userData);
    dispatch({
      type: types.UPDATE_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.UPDATE_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const suspendUser = (userId) => async (dispatch) => {
  dispatch({ type: types.SUSPEND_USER_REQUEST });
  try {
    const response = await api.patch(`/admin/users/suspend/${userId}`);
    dispatch({
      type: types.SUSPEND_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.SUSPEND_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const unsuspendUser = (userId) => async (dispatch) => {
  dispatch({ type: types.UNSUSPEND_USER_REQUEST });
  try {
    const response = await api.patch(`/admin/users/unsuspend/${userId}`);
    dispatch({
      type: types.UNSUSPEND_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.UNSUSPEND_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const banUser = (userId, banReason) => async (dispatch) => {
  dispatch({ type: types.BAN_USER_REQUEST });
  try {
    const response = await api.patch(`/admin/users/ban/${userId}`, {
      userId,
      banReason,
    });
    dispatch({
      type: types.BAN_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.BAN_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const unbanUser = (userId) => async (dispatch) => {
  dispatch({ type: types.UNBAN_USER_REQUEST });
  try {
    const response = await api.patch(`/admin/users/unban/${userId}`);
    dispatch({
      type: types.UNBAN_USER_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.UNBAN_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const deleteUser = (userId) => async (dispatch) => {
  dispatch({ type: types.DELETE_USER_REQUEST });
  try {
    const response = await api.delete(`/admin/users/delete/${userId}`);
    dispatch({
      type: types.DELETE_USER_SUCCESS,
      payload: { userId, message: response.data },
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_USER_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};

export const updateUserRole = (userId, roleName) => async (dispatch) => {
  dispatch({ type: types.UPDATE_USER_ROLE_REQUEST });
  try {
    const response = await api.put(`/admin/users/${userId}/role`, null, {
      params: { roleName },
    });
    dispatch({
      type: types.UPDATE_USER_ROLE_SUCCESS,
      payload: response.data,
    });
  } catch (error) {
    dispatch({
      type: types.UPDATE_USER_ROLE_FAILURE,
      payload: error.response?.data || error.message,
    });
  }
};
