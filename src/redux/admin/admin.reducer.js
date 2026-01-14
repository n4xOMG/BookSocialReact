import * as types from "./admin.actionType";

const initialState = {
  // Analytics data
  userAnalytics: null,
  revenueAnalytics: null,
  contentAnalytics: null,
  platformAnalytics: null,
  
  bestBooks: [],
  activeUsers: [],
  topSpenders: [],

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
  bestBooksLoading: false,
  activeUsersLoading: false,
  topSpendersLoading: false,
  usersLoading: false,
  userStatusCountsLoading: false,

  // Error states
  error: null,
  userAnalyticsError: null,
  revenueAnalyticsError: null,
  contentAnalyticsError: null,
  platformAnalyticsError: null,
  bestBooksError: null,
  activeUsersError: null,
  topSpendersError: null,
  usersError: null,
  userStatusCountsError: null,
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
        totalUsers: typeof action.payload?.totalUsers === "number" ? action.payload.totalUsers : state.totalUsers,
        bannedUsers: typeof action.payload?.bannedUsers === "number" ? action.payload.bannedUsers : state.bannedUsers,
        suspendedUsers: typeof action.payload?.suspendedUsers === "number" ? action.payload.suspendedUsers : state.suspendedUsers,
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

    // Best Books
    case types.FETCH_BEST_BOOKS_REQUEST:
      return { ...state, bestBooksLoading: true, bestBooksError: null };
    case types.FETCH_BEST_BOOKS_SUCCESS:
      return { ...state, bestBooksLoading: false, bestBooks: action.payload, bestBooksError: null };
    case types.FETCH_BEST_BOOKS_FAILURE:
      return { ...state, bestBooksLoading: false, bestBooksError: action.payload };

    // Active Users
    case types.FETCH_MOST_ACTIVE_USERS_REQUEST:
      return { ...state, activeUsersLoading: true, activeUsersError: null };
    case types.FETCH_MOST_ACTIVE_USERS_SUCCESS:
      return { ...state, activeUsersLoading: false, activeUsers: action.payload, activeUsersError: null };
    case types.FETCH_MOST_ACTIVE_USERS_FAILURE:
      return { ...state, activeUsersLoading: false, activeUsersError: action.payload };

    // Top Spenders
    case types.FETCH_TOP_SPENDERS_REQUEST:
      return { ...state, topSpendersLoading: true, topSpendersError: null };
    case types.FETCH_TOP_SPENDERS_SUCCESS:
      return { ...state, topSpendersLoading: false, topSpenders: action.payload, topSpendersError: null };
    case types.FETCH_TOP_SPENDERS_FAILURE:
      return { ...state, topSpendersLoading: false, topSpendersError: action.payload };

    // Users Management
    case types.FETCH_ALL_USERS_REQUEST:
      return { ...state, usersLoading: true, usersError: null };
    case types.FETCH_ALL_USERS_SUCCESS:
      return {
        ...state,
        usersLoading: false,
        users: Array.isArray(action.payload) ? action.payload : [],
        usersError: null,
      };
    case types.FETCH_ALL_USERS_FAILURE:
      return {
        ...state,
        usersLoading: false,
        usersError: action.payload,
      };

    case types.FETCH_USER_STATUS_COUNTS_REQUEST:
      return { ...state, userStatusCountsLoading: true, userStatusCountsError: null };
    case types.FETCH_USER_STATUS_COUNTS_SUCCESS:
      return {
        ...state,
        userStatusCountsLoading: false,
        totalUsers: typeof action.payload?.totalUsers === "number" ? action.payload.totalUsers : state.totalUsers,
        bannedUsers: typeof action.payload?.bannedUsers === "number" ? action.payload.bannedUsers : state.bannedUsers,
        suspendedUsers: typeof action.payload?.suspendedUsers === "number" ? action.payload.suspendedUsers : state.suspendedUsers,
        userStatusCountsError: null,
      };
    case types.FETCH_USER_STATUS_COUNTS_FAILURE:
      return {
        ...state,
        userStatusCountsLoading: false,
        userStatusCountsError: action.payload,
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
        users: action.payload ? state.users.map((user) => (user.id === action.payload.id ? action.payload : user)) : state.users,
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
