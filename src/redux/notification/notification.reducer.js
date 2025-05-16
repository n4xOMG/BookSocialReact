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

    case FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload.content,
        page: action.payload.pageable?.pageNumber || 0,
        size: action.payload.pageable?.pageSize || 10,
        hasMore: !action.payload.last,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
      };

    case FETCH_MORE_NOTIFICATIONS_REQUEST:
      return { ...state, loadingMore: true, error: null };

    case FETCH_MORE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loadingMore: false,
        notifications: [...state.notifications, ...action.payload.content],
        page: action.payload.pageable?.pageNumber || 0,
        hasMore: !action.payload.last,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
      };

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
        return { ...state, notifications: updatedNotifications };
      } else {
        // Add new notification at the beginning of the array
        // Only add to the current view if we're on the first page
        const shouldAddToCurrentView = state.page === 0;

        return {
          ...state,
          notifications: shouldAddToCurrentView ? [action.payload, ...state.notifications] : [...state.notifications],
          totalElements: state.totalElements + 1,
        };
      }

    case FETCH_NOTIFICATIONS_FAILED:
      return { ...state, loading: false, error: action.payload };

    case MARK_ALL_NOTIFICATIONS_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({
          ...notification,
          read: true,
        })),
      };

    case MARK_NOTIFICATION_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification
        ),
      };

    default:
      return state;
  }
};
