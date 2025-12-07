import { api, API_BASE_URL } from "../../api/api";
import { createLogger } from "../../utils/logger";
import { extractErrorMessage, extractPaginatedResponse, extractResponsePayload } from "../../utils/apiResponseHelpers";
import {
  BAN_USER_FAILED,
  BAN_USER_REQUEST,
  BAN_USER_SUCCESS,
  BLOCK_USER_FAILURE,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  DELETE_USER_FAILED,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  FOLLOW_AUTHOR_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_BLOCKED_USERS_FAILURE,
  GET_BLOCKED_USERS_REQUEST,
  GET_BLOCKED_USERS_SUCCESS,
  GET_NEW_USERS_BY_MONTH_FAILED,
  GET_NEW_USERS_BY_MONTH_REQUEST,
  GET_NEW_USERS_BY_MONTH_SUCCESS,
  GET_READING_PROGRESS_BY_USER_FAILED,
  GET_READING_PROGRESS_BY_USER_REQUEST,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_TOTAL_USERS_FAILED,
  GET_TOTAL_USERS_REQUEST,
  GET_TOTAL_USERS_SUCCESS,
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
  UNBLOCK_USER_FAILURE,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
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
} from "./user.actionType";

const logger = createLogger("UserActions");

export const getAllUsers = (page, size, searchTerm) => async (dispatch) => {
  dispatch({ type: GET_ALL_USERS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/users`, {
      params: { page, size, searchTerm },
    });
    const { message, success } = extractResponsePayload(response);
    const pagination = extractPaginatedResponse(response);
    const payload = {
      ...pagination,
      content: pagination.content,
      currentPage: pagination.page,
    };
    logger.info("users", payload);
    dispatch({ type: GET_ALL_USERS_SUCCESS, payload });
    return { payload, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: GET_ALL_USERS_FAILED, payload: message });
    return { error: message };
  }
};

export const getUserById = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_BY_ID_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/user/profile/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    const userData = data ?? null;
    logger.debug("Get user by ID response: ", { userData });
    dispatch({ type: GET_USER_BY_ID_SUCCESS, payload: userData });
    return { payload: userData, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: GET_USER_BY_ID_FAILED, payload: message });
    return { error: message };
  }
};

export const editUserAction = (userId, userData) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/admin/users/update/${userId}`, userData);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Edited user", data);
    dispatch({ type: UPDATE_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: UPDATE_USER_FAILED, payload: message });
    return { error: message };
  }
};

export const deleteUserAction = (userId) => async (dispatch) => {
  dispatch({ type: DELETE_USER_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/admin/users/delete/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Deleted user", data);
    dispatch({ type: DELETE_USER_SUCCESS, payload: data ?? userId });
    return { payload: data ?? userId, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: DELETE_USER_FAILED, payload: message });
    return { error: message };
  }
};

export const suspendUserAction = (userId) => async (dispatch) => {
  dispatch({ type: SUSPEND_USER_REQUEST });
  try {
    const response = await api.patch(`${API_BASE_URL}/admin/users/suspend/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Suspended user", data);
    dispatch({ type: SUSPEND_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: SUSPEND_USER_FAILED, payload: message });
    return { error: message };
  }
};

export const unsuspendUserAction = (userId) => async (dispatch) => {
  dispatch({ type: UNSUSPEND_USER_REQUEST });
  try {
    const response = await api.patch(`${API_BASE_URL}/admin/users/unsuspend/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Unsuspended user", data);
    dispatch({ type: UNSUSPEND_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: UNSUSPEND_USER_FAILED, payload: message });
    return { error: message };
  }
};
export const banUserAction = (userId) => async (dispatch) => {
  dispatch({ type: BAN_USER_REQUEST });
  try {
    const response = await api.patch(`${API_BASE_URL}/admin/users/ban/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Banned user", data);
    dispatch({ type: BAN_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: BAN_USER_FAILED, payload: message });
    return { error: message };
  }
};

export const unbanUserAction = (userId) => async (dispatch) => {
  dispatch({ type: UNBAN_USER_REQUEST });
  try {
    const response = await api.patch(`${API_BASE_URL}/admin/users/unban/${userId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Unbanned user", data);
    dispatch({ type: UNBAN_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: UNBAN_USER_FAILED, payload: message });
    return { error: message };
  }
};
export const getReadingProgressByUser = () => async (dispatch) => {
  dispatch({ type: GET_READING_PROGRESS_BY_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/reading-progress`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: GET_READING_PROGRESS_BY_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    dispatch({ type: GET_READING_PROGRESS_BY_USER_FAILED, payload: message });
    return { error: message };
  }
};
export const updateUserRoleAction = (userId, roleName) => async (dispatch) => {
  dispatch({ type: UPDATE_USER_ROLE_REQUEST });
  try {
    const response = await api.put(
      `${API_BASE_URL}/admin/users/${userId}/role`,
      null, // No request body
      { params: { roleName } } // Query parameter
    );
    const { data, message, success } = extractResponsePayload(response);
    logger.info("Updated user role", data);
    dispatch({ type: UPDATE_USER_ROLE_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: UPDATE_USER_ROLE_FAILED, payload: message });
    return { error: message };
  }
};
export const searchUser = (query) => async (dispatch) => {
  dispatch({ type: SEARCH_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/user/search?query=${query}`);
    const { data, message, success } = extractResponsePayload(response);
    const userData = Array.isArray(data) ? data : data?.content || [];
    logger.debug("Search user response: ", { userData });
    dispatch({ type: SEARCH_USER_SUCCESS, payload: userData });
    return { payload: userData, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: SEARCH_USER_FAILED, payload: message });
    return { error: message };
  }
};
export const followAuthorAction = (authorId) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/user/follow/${authorId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.debug("Follow author response: ", { data });
    dispatch({ type: FOLLOW_AUTHOR_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Error following author:", message);
    return { error: message };
  }
};

export const unfollowAuthorAction = (authorId) => async (dispatch) => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/user/unfollow/${authorId}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.debug("Unfollow author response: ", { data });
    dispatch({ type: UNFOLLOW_AUTHOR_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Error unfollowing author:", message);
    return { error: message };
  }
};
export const getUserPreferences = () => async (dispatch) => {
  dispatch({ type: GET_USER_PREFERENCES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/user/preferences`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: GET_USER_PREFERENCES_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    dispatch({ type: GET_USER_PREFERENCES_FAILURE, payload: message });
    return { error: message };
  }
};
export const getUserFollowers = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_FOLLOWERS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/user/${userId}/followers`);
    const { data, message, success } = extractResponsePayload(response);
    const followersData = Array.isArray(data) ? data : data?.content || [];
    logger.debug("Get user followers response: ", { followersData });
    dispatch({ type: GET_USER_FOLLOWERS_SUCCESS, payload: followersData });
    return { payload: followersData, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: GET_USER_FOLLOWERS_FAILURE, payload: message });
    throw new Error(message);
  }
};
export const getUserFollowings = (userId) => async (dispatch) => {
  dispatch({ type: GET_USER_FOLLOWING_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/user/${userId}/following`);
    const { data, message, success } = extractResponsePayload(response);
    const followingData = Array.isArray(data) ? data : data?.content || [];
    logger.debug("Get user following response: ", { followingData });
    dispatch({ type: GET_USER_FOLLOWING_SUCCESS, payload: followingData });
    return { payload: followingData, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error: ", error);
    dispatch({ type: GET_USER_FOLLOWING_FAILURE, payload: message });
    throw new Error(message);
  }
};

export const getTotalUsers = () => async (dispatch) => {
  dispatch({ type: GET_TOTAL_USERS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/users/count`);
    const { data, message, success } = extractResponsePayload(response);
    const count = typeof data === "number" ? data : data?.count ?? data;
    logger.debug("Get total users response: ", { count });
    dispatch({ type: GET_TOTAL_USERS_SUCCESS, payload: count });
    return { payload: count, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error getting total users: ", error);
    dispatch({ type: GET_TOTAL_USERS_FAILED, payload: message });
    return { error: message };
  }
};

export const getNewUsersByMonth = () => async (dispatch) => {
  dispatch({ type: GET_NEW_USERS_BY_MONTH_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/users/new-by-month`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: GET_NEW_USERS_BY_MONTH_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error getting new users by month: ", error);
    dispatch({ type: GET_NEW_USERS_BY_MONTH_FAILED, payload: message });
    return { error: message };
  }
};

export const getBlockedUsers = () => async (dispatch) => {
  dispatch({ type: GET_BLOCKED_USERS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/user/blocked`);
    const { data, message, success } = extractResponsePayload(response);
    const blockedUsers = Array.isArray(data) ? data : data?.content || [];
    dispatch({ type: GET_BLOCKED_USERS_SUCCESS, payload: blockedUsers });
    return { payload: blockedUsers, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error getting blocked users: ", error);
    dispatch({ type: GET_BLOCKED_USERS_FAILURE, payload: message });
    throw new Error(message);
  }
};

export const blockUser = (userIdToBlock) => async (dispatch) => {
  dispatch({ type: BLOCK_USER_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/user/block/${userIdToBlock}`);
    const { data, message, success } = extractResponsePayload(response);
    logger.debug("Block user response: ", { data });
    dispatch({ type: BLOCK_USER_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error blocking user: ", error);
    dispatch({ type: BLOCK_USER_FAILURE, payload: message });
    throw error;
  }
};

export const unblockUser = (userIdToUnblock) => async (dispatch) => {
  dispatch({ type: UNBLOCK_USER_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/user/unblock/${userIdToUnblock}`);
    const { message, success } = extractResponsePayload(response);
    dispatch({ type: UNBLOCK_USER_SUCCESS, payload: userIdToUnblock });
    return { payload: userIdToUnblock, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Api error unblocking user: ", error);
    dispatch({ type: UNBLOCK_USER_FAILURE, payload: message });
    throw error;
  }
};
