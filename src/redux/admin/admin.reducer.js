import * as types from "./admin.actionType";

const initialState = {
  // Analytics data
  userAnalytics: null,
  revenueAnalytics: null,
  contentAnalytics: null,
  platformAnalytics: null,

  // User management
  users: [],
  totalUsers: 0,
  bannedUsers: 0,
  suspendedUsers: 0,

  // Loading states
  loading: false,
  userAnalyticsLoading: false,
  revenueAnalyticsLoading: false,
  contentAnalyticsLoading: false,
  platformAnalyticsLoading: false,
  usersLoading: false,

  // Error states
  error: null,
  userAnalyticsError: null,
  revenueAnalyticsError: null,
  contentAnalyticsError: null,
  platformAnalyticsError: null,
  usersError: null,
};

export const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    // User Analytics
    case types.FETCH_USER_ANALYTICS_REQUEST:
      return { ...state, userAnalyticsLoading: true, userAnalyticsError: null };
    case types.FETCH_USER_ANALYTICS_SUCCESS:
      return {
        ...state,
        userAnalyticsLoading: false,
        userAnalytics: action.payload,
        userAnalyticsError: null,
      };
    case types.FETCH_USER_ANALYTICS_FAILURE:
      return {
        ...state,
        userAnalyticsLoading: false,
        userAnalyticsError: action.payload,
      };

    // Revenue Analytics
    case types.FETCH_REVENUE_ANALYTICS_REQUEST:
      return { ...state, revenueAnalyticsLoading: true, revenueAnalyticsError: null };
    case types.FETCH_REVENUE_ANALYTICS_SUCCESS:
      return {
        ...state,
        revenueAnalyticsLoading: false,
        revenueAnalytics: action.payload,
        revenueAnalyticsError: null,
      };
    case types.FETCH_REVENUE_ANALYTICS_FAILURE:
      return {
        ...state,
        revenueAnalyticsLoading: false,
        revenueAnalyticsError: action.payload,
      };

    // Content Analytics
    case types.FETCH_CONTENT_ANALYTICS_REQUEST:
      return { ...state, contentAnalyticsLoading: true, contentAnalyticsError: null };
    case types.FETCH_CONTENT_ANALYTICS_SUCCESS:
      return {
        ...state,
        contentAnalyticsLoading: false,
        contentAnalytics: action.payload,
        contentAnalyticsError: null,
      };
    case types.FETCH_CONTENT_ANALYTICS_FAILURE:
      return {
        ...state,
        contentAnalyticsLoading: false,
        contentAnalyticsError: action.payload,
      };

    // Platform Analytics
    case types.FETCH_PLATFORM_ANALYTICS_REQUEST:
      return { ...state, platformAnalyticsLoading: true, platformAnalyticsError: null };
    case types.FETCH_PLATFORM_ANALYTICS_SUCCESS:
      return {
        ...state,
        platformAnalyticsLoading: false,
        platformAnalytics: action.payload,
        platformAnalyticsError: null,
      };
    case types.FETCH_PLATFORM_ANALYTICS_FAILURE:
      return {
        ...state,
        platformAnalyticsLoading: false,
        platformAnalyticsError: action.payload,
      };

    // Users Management
    case types.FETCH_ALL_USERS_REQUEST:
      return { ...state, usersLoading: true, usersError: null };
    case types.FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: action.payload,
        usersError: null,
      };
    case types.FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        usersLoading: false,
        usersError: action.payload,
      };

    // User Actions
    case types.UPDATE_USER_REQUEST:
    case types.SUSPEND_USER_REQUEST:
    case types.UNSUSPEND_USER_REQUEST:
    case types.BAN_USER_REQUEST:
    case types.UNBAN_USER_REQUEST:
    case types.DELETE_USER_REQUEST:
    case types.UPDATE_USER_ROLE_REQUEST:
      return { ...state, loading: true, error: null };

    case types.UPDATE_USER_SUCCESS:
    case types.SUSPEND_USER_SUCCESS:
    case types.UNSUSPEND_USER_SUCCESS:
    case types.BAN_USER_SUCCESS:
    case types.UNBAN_USER_SUCCESS:
    case types.UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // Update the user in the users array
        users: state.users.map((user) => (user.id === action.payload.id ? action.payload : user)),
      };

    case types.DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        // Remove the user from the users array
        users: state.users.filter((user) => user.id !== action.payload.userId),
      };

    case types.UPDATE_USER_FAILURE:
    case types.SUSPEND_USER_FAILURE:
    case types.UNSUSPEND_USER_FAILURE:
    case types.BAN_USER_FAILURE:
    case types.UNBAN_USER_FAILURE:
    case types.DELETE_USER_FAILURE:
    case types.UPDATE_USER_ROLE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
