import { api, API_BASE_URL } from "../../api/api";
import {
  FETCH_NOTIFICATIONS_FAILED,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
  FETCH_MORE_NOTIFICATIONS_REQUEST,
  FETCH_MORE_NOTIFICATIONS_SUCCESS,
  FETCH_MORE_NOTIFICATIONS_FAILED,
} from "./notification.actionType";

// Fetch user notifications with pagination
export const getNotifications =
  (page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/notifications?page=${page}&size=${size}&sort=createdDate,desc`);
      dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: FETCH_NOTIFICATIONS_FAILED, payload: error.message });
      throw error;
    }
  };

// Load more notifications
export const loadMoreNotifications =
  (page, size = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_MORE_NOTIFICATIONS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/notifications?page=${page}&size=${size}&sort=createdDate,desc`);
      dispatch({ type: FETCH_MORE_NOTIFICATIONS_SUCCESS, payload: response.data });
      return response.data;
    } catch (error) {
      dispatch({ type: FETCH_MORE_NOTIFICATIONS_FAILED, payload: error.message });
      throw error;
    }
  };

// Receive notification from WebSocket
export const receiveNotification = (notification) => {
  // Ensure the notification has createdDate field and required pagination fields
  const formattedNotification = {
    ...notification,
    createdDate: notification.createdDate || notification.time || new Date().toISOString(),
    read: notification.read || false,
  };

  return {
    type: RECEIVE_NOTIFICATION,
    payload: formattedNotification,
  };
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => async (dispatch) => {
  try {
    await api.put(`${API_BASE_URL}/api/notifications/read-all`);
    dispatch({ type: MARK_ALL_NOTIFICATIONS_AS_READ });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};

// Mark a single notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    await api.put(`${API_BASE_URL}/api/notifications/${notificationId}/read`);
    dispatch({ type: MARK_NOTIFICATION_AS_READ, payload: notificationId });
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
  }
};

// Get unread notifications count
export const getUnreadNotifications = () => async (dispatch) => {
  try {
    const response = await api.get(`${API_BASE_URL}/api/notifications/unread?size=100`);
    return response.data.totalElements;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return 0;
  }
};
