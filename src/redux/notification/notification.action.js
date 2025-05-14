import { api, API_BASE_URL } from "../../api/api";
import {
  FETCH_NOTIFICATIONS_FAILED,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
} from "./notification.actionType";

// Fetch user notifications
export const getNotifications = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/notifications`);
    dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_NOTIFICATIONS_FAILED, payload: error.message });
  }
};

// Receive notification from WebSocket
export const receiveNotification = (notification) => ({
  type: RECEIVE_NOTIFICATION,
  payload: notification,
});

// Mark all notifications as read
export const markAllNotificationsAsRead = () => async (dispatch, getState) => {
  try {
    await api.put(`${API_BASE_URL}/api/notifications/mark-all-read`);
    dispatch({ type: MARK_ALL_NOTIFICATIONS_AS_READ });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
};
