import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILED,
  RECEIVE_NOTIFICATION,
  MARK_ALL_NOTIFICATIONS_AS_READ,
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
      return { ...state, notifications: [action.payload, ...state.notifications] };

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

    default:
      return state;
  }
};
