import { api, API_BASE_URL } from "../../api/api";
import {
  FETCH_NOTIFICATIONS_FAILED,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
} from "./notification.actionType";

// Fetch user notifications
export const getNotifications = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/notifications`);
    // Ensure that createdDate is properly set for each notification
    const notifications = response.data.map((notification) => ({
      ...notification,
      createdDate: notification.createdDate || notification.time, // Handle both field names
    }));
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: notifications });
  } catch (error) {
    dispatch({ type: FETCH_NOTIFICATIONS_FAILED, payload: error.message });
  }
};

// Receive notification from WebSocket
export const receiveNotification = (notification) => {
  // Ensure the notification has createdDate field
  const formattedNotification = {
    ...notification,
    createdDate: notification.createdDate || notification.time, // Handle both field names
  };

  return {
    type: RECEIVE_NOTIFICATION,
    payload: formattedNotification,
  };
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => async (dispatch, getState) => {
  try {
    await api.put(`${API_BASE_URL}/api/notifications/mark-all-read`);
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
    const response = await api.get(`${API_BASE_URL}/api/notifications/unread`);
    return response.data.length;
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return 0;
  }
};
