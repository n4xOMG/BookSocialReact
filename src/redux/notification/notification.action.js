import { api, API_BASE_URL } from "../../api/api";
import { createLogger } from "../../utils/logger";
import { extractErrorMessage, extractPaginatedResponse, extractResponsePayload } from "../../utils/apiResponseHelpers";
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

const logger = createLogger("NotificationActions");

const normalizeNotification = (notification) => {
  if (!notification) return notification;

  const normalized = {
    ...notification,
  };

  if (normalized.read === undefined) {
    normalized.read = normalized.isRead ?? false;
  }

  if (!normalized.createdDate) {
    normalized.createdDate = normalized.time || normalized.timestamp || new Date().toISOString();
  }

  if (!normalized.notificationEntityType && normalized.entityType) {
    normalized.notificationEntityType = normalized.entityType;
  }

  if (!normalized.entityId) {
    normalized.entityId = normalized.targetId || normalized.referenceId || normalized.id;
  }

  return normalized;
};

// Fetch user notifications with pagination
export const getNotifications =
  (page = 0, size = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/notifications?page=${page}&size=${size}&sort=createdDate,desc`);
      const { message, success } = extractResponsePayload(response);
      const pagination = extractPaginatedResponse(response);
      const content = Array.isArray(pagination.content) ? pagination.content.map(normalizeNotification) : [];
      const payload = {
        ...pagination,
        content,
      };
      dispatch({ type: FETCH_NOTIFICATIONS_SUCCESS, payload });
      return { payload, message, success };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: FETCH_NOTIFICATIONS_FAILED, payload: errorMessage });
      logger.error("Failed to fetch notifications", error);
      return { error: errorMessage };
    }
  };

// Load more notifications
export const loadMoreNotifications =
  (page, size = 10) =>
  async (dispatch) => {
    dispatch({ type: FETCH_MORE_NOTIFICATIONS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/notifications?page=${page}&size=${size}&sort=createdDate,desc`);
      const { message, success } = extractResponsePayload(response);
      const pagination = extractPaginatedResponse(response);
      const content = Array.isArray(pagination.content) ? pagination.content.map(normalizeNotification) : [];
      const payload = {
        ...pagination,
        content,
      };
      dispatch({ type: FETCH_MORE_NOTIFICATIONS_SUCCESS, payload });
      return { payload, message, success };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch({ type: FETCH_MORE_NOTIFICATIONS_FAILED, payload: errorMessage });
      logger.error("Failed to load more notifications", error);
      return { error: errorMessage };
    }
  };

// Receive notification from WebSocket
export const receiveNotification = (notification) => {
  // Ensure the notification has createdDate field and required pagination fields
  const formattedNotification = normalizeNotification({
    ...notification,
    createdDate: notification.createdDate || notification.time || new Date().toISOString(),
    read: notification.read ?? notification.isRead ?? false,
  });

  return {
    type: RECEIVE_NOTIFICATION,
    payload: formattedNotification,
  };
};

// Mark all notifications as read
export const markAllNotificationsAsRead = () => async (dispatch) => {
  try {
    const response = await api.put(`${API_BASE_URL}/api/notifications/read-all`);
    const { success, message } = extractResponsePayload(response);
    if (success === false) {
      throw new Error(message || "Failed to mark notifications as read.");
    }
    dispatch({ type: MARK_ALL_NOTIFICATIONS_AS_READ });
    return { success: success ?? true, message };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error("Error marking notifications as read:", error);
    return { error: errorMessage };
  }
};

// Mark a single notification as read
export const markNotificationAsRead = (notificationId) => async (dispatch) => {
  try {
    const response = await api.put(`${API_BASE_URL}/api/notifications/${notificationId}/read`);
    const { success, message } = extractResponsePayload(response);
    if (success === false) {
      throw new Error(message || "Failed to mark notification as read.");
    }
    dispatch({ type: MARK_NOTIFICATION_AS_READ, payload: notificationId });
    return { success: success ?? true, message };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    logger.error(`Error marking notification ${notificationId} as read:`, error);
    return { error: errorMessage };
  }
};

// Get unread notifications count
export const getUnreadNotifications = () => async (dispatch) => {
  try {
    const response = await api.get(`${API_BASE_URL}/api/notifications/unread?size=100`);
    const pagination = extractPaginatedResponse(response);
    return pagination.totalElements;
  } catch (error) {
    logger.error("Error fetching unread notifications:", error);
    return 0;
  }
};
