import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILED,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
  FETCH_MORE_NOTIFICATIONS_REQUEST,
  FETCH_MORE_NOTIFICATIONS_SUCCESS,
  FETCH_MORE_NOTIFICATIONS_FAILED,
} from "./notification.actionType";

const mergeNotificationLists = (existing = [], incoming = []) => {
  const safeExisting = Array.isArray(existing) ? existing : [];
  const safeIncoming = Array.isArray(incoming) ? incoming : [];

  if (safeIncoming.length === 0) {
    return safeExisting.slice();
  }

  const seen = new Map();
  const result = [];

  safeExisting.forEach((notification) => {
    if (!notification) {
      return;
    }
    const id = notification.id ?? notification.notificationId;
    if (id !== undefined && id !== null) {
      seen.set(id, result.length);
    }
    result.push(notification);
  });

  safeIncoming.forEach((notification) => {
    if (!notification) {
      return;
    }
    const id = notification.id ?? notification.notificationId;
    if (id !== undefined && id !== null && seen.has(id)) {
      const index = seen.get(id);
      if (typeof index === "number") {
        result[index] = { ...result[index], ...notification };
      }
      return;
    }
    if (id !== undefined && id !== null) {
      seen.set(id, result.length);
    }
    result.push(notification);
  });

  return result;
};

const initialState = {
  notifications: [],
  loading: false,
  loadingMore: false,
  error: null,
  page: 0,
  size: 10,
  hasMore: true,
  totalPages: 0,
  totalElements: 0,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_NOTIFICATIONS_SUCCESS: {
      const {
        content = [],
        page = 0,
        size = state.size,
        totalPages = 0,
        totalElements = content.length,
        last = true,
      } = action.payload || {};
      return {
        ...state,
        loading: false,
        error: null,
        notifications: Array.isArray(content) ? content : [],
        page,
        size,
        hasMore: !last,
        totalPages,
        totalElements,
      };
    }

    case FETCH_MORE_NOTIFICATIONS_REQUEST:
      return { ...state, loadingMore: true, error: null };

    case FETCH_MORE_NOTIFICATIONS_SUCCESS: {
      const morePayload = action.payload || {};
      const nextContent = Array.isArray(morePayload.content) ? morePayload.content : [];
      const nextPage = morePayload.page ?? state.page;
      const moreLast = morePayload.last ?? true;
      const moreTotalPages = morePayload.totalPages ?? state.totalPages;
      const moreTotalElements = morePayload.totalElements ?? state.totalElements;
      return {
        ...state,
        loadingMore: false,
        error: null,
        notifications: mergeNotificationLists(state.notifications, nextContent),
        page: nextPage,
        size: morePayload.size ?? state.size,
        hasMore: !moreLast,
        totalPages: moreTotalPages,
        totalElements: moreTotalElements,
      };
    }

    case FETCH_MORE_NOTIFICATIONS_FAILED:
      return { ...state, loadingMore: false, error: action.payload };

    case RECEIVE_NOTIFICATION:
      // Check if notification with this ID already exists
      const existingNotificationIndex = state.notifications.findIndex((n) => n.id === action.payload.id);

      if (existingNotificationIndex >= 0) {
        // Update existing notification
        const updatedNotifications = [...state.notifications];
        updatedNotifications[existingNotificationIndex] = {
          ...updatedNotifications[existingNotificationIndex],
          ...action.payload,
        };
        return { ...state, error: null, notifications: updatedNotifications };
      } else {
        // Add new notification at the beginning of the array
        // Only add to the current view if we're on the first page
        const shouldAddToCurrentView = state.page === 0;

        return {
          ...state,
          error: null,
          notifications: shouldAddToCurrentView ? [action.payload, ...state.notifications] : [...state.notifications],
          totalElements: state.totalElements + 1,
        };
      }

    case FETCH_NOTIFICATIONS_FAILED:
      return { ...state, loading: false, error: action.payload };

    case MARK_ALL_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        error: null,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };

    case MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        error: null,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    default:
      return state;
  }
};
