import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILED,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
  MARK_NOTIFICATION_AS_READ,
} from "./notification.actionType";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, loading: false, notifications: action.payload };

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
        return {
          ...state,
          notifications: [action.payload, ...state.notifications],
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
