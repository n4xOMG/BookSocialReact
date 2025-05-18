import { api, API_BASE_URL } from "../../api/api";
import {
  BAN_USER_FAILED,
  BAN_USER_REQUEST,
  BAN_USER_SUCCESS,
  DELETE_USER_FAILED,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  FOLLOW_AUTHOR_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_FAILED,
  GET_READING_PROGRESS_BY_USER_REQUEST,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_USER_BY_ID_FAILED,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_FOLLOWERS_FAILURE,
  GET_USER_FOLLOWERS_REQUEST,
  GET_USER_FOLLOWERS_SUCCESS,
  GET_USER_FOLLOWING_FAILURE,
  GET_USER_FOLLOWING_REQUEST,
  GET_USER_FOLLOWING_SUCCESS,
  GET_USER_PREFERENCES_FAILURE,
  GET_USER_PREFERENCES_REQUEST,
  GET_USER_PREFERENCES_SUCCESS,
  SEARCH_USER_FAILED,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  SUSPEND_USER_SUCCESS,
  UNBAN_USER_FAILED,
  UNBAN_USER_REQUEST,
  UNBAN_USER_SUCCESS,
  UNFOLLOW_AUTHOR_SUCCESS,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UNSUSPEND_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ROLE_FAILED,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_SUCCESS,
  GET_TOTAL_USERS_REQUEST,
  GET_TOTAL_USERS_SUCCESS,
  GET_TOTAL_USERS_FAILED,
  GET_NEW_USERS_BY_MONTH_REQUEST,
  GET_NEW_USERS_BY_MONTH_SUCCESS,
  GET_NEW_USERS_BY_MONTH_FAILED,
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
    const { data } = await api.get(`${API_BASE_URL}/user/profile/${userId}`);
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
export const searchUser = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/user/search?query=${query}`);

    console.log("User", data);
    dispatch({ type: SEARCH_USER_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: SEARCH_USER_FAILED, payload: error.message });
  }
};
export const followAuthorAction = (authorId) => async (dispatch) => {
  try {
    const { data } = await api.post(`${API_BASE_URL}/follow/${authorId}`);
    dispatch({ type: FOLLOW_AUTHOR_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error following author:", error);
    // Handle error
  }
};

export const unfollowAuthorAction = (authorId) => async (dispatch) => {
  try {
    const { data } = await api.post(`${API_BASE_URL}/unfollow/${authorId}`);
    dispatch({ type: UNFOLLOW_AUTHOR_SUCCESS, payload: data });
  } catch (error) {
    console.error("Error unfollowing author:", error);
    // Handle error
  }
};
export const getUserPreferences = () => async (dispatch) => {
  dispatch({ type: GET_USER_PREFERENCES_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/user/preferences`);
    dispatch({ type: GET_USER_PREFERENCES_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_USER_PREFERENCES_FAILURE, payload: error.message });
  }
};
export const getUserFollowers = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_FOLLOWERS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/user/${userId}/followers`);
    dispatch({ type: GET_USER_FOLLOWERS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: GET_USER_FOLLOWERS_FAILURE, payload: error.message });
  }
};
export const getUserFollowings = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_FOLLOWING_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/user/${userId}/following`);
    dispatch({ type: GET_USER_FOLLOWING_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error);
    dispatch({ type: GET_USER_FOLLOWING_FAILURE, payload: error.message });
  }
};

export const getTotalUsers = () => async (dispatch) => {
  dispatch({ type: GET_TOTAL_USERS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/users/total`);
    dispatch({ type: GET_TOTAL_USERS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error getting total users: ", error);
    dispatch({ type: GET_TOTAL_USERS_FAILED, payload: error.message });
  }
};

export const getNewUsersByMonth = () => async (dispatch) => {
  dispatch({ type: GET_NEW_USERS_BY_MONTH_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/admin/users/new-by-month`);
    dispatch({ type: GET_NEW_USERS_BY_MONTH_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error getting new users by month: ", error);
    dispatch({ type: GET_NEW_USERS_BY_MONTH_FAILED, payload: error.message });
  }
};
