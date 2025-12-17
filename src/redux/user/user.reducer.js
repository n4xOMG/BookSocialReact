import { DELETE_CHAPTER_FAILED, DELETE_CHAPTER_REQUEST } from "../chapter/chapter.actionType";
import {
  BAN_USER_FAILED,
  BAN_USER_REQUEST,
  BAN_USER_SUCCESS,
  DELETE_USER_REQUEST,
  DELETE_USER_SUCCESS,
  DELETE_USER_FAILED,
  FOLLOW_AUTHOR_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_USERS_REQUEST,
  GET_ALL_USERS_SUCCESS,
  GET_READING_PROGRESS_BY_USER_REQUEST,
  GET_READING_PROGRESS_BY_USER_SUCCESS,
  GET_READING_PROGRESS_BY_USER_FAILED,
  GET_USER_BY_ID_FAILED,
  GET_USER_BY_ID_REQUEST,
  GET_USER_BY_ID_SUCCESS,
  GET_USER_FOLLOWERS_FAILURE,
  GET_USER_FOLLOWERS_REQUEST,
  GET_USER_FOLLOWERS_SUCCESS,
  GET_USER_FOLLOWING_FAILURE,
  GET_USER_FOLLOWING_REQUEST,
  GET_USER_FOLLOWING_SUCCESS,
  GET_USER_PREFERENCES_FAILURE,
  GET_USER_PREFERENCES_REQUEST,
  GET_USER_PREFERENCES_SUCCESS,
  GET_BLOCKED_USERS_REQUEST,
  GET_BLOCKED_USERS_SUCCESS,
  GET_BLOCKED_USERS_FAILURE,
  BLOCK_USER_REQUEST,
  BLOCK_USER_SUCCESS,
  BLOCK_USER_FAILURE,
  UNBLOCK_USER_REQUEST,
  UNBLOCK_USER_SUCCESS,
  UNBLOCK_USER_FAILURE,
  SEARCH_USER_REQUEST,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILED,
  SUSPEND_USER_FAILED,
  SUSPEND_USER_REQUEST,
  SUSPEND_USER_SUCCESS,
  UNBAN_USER_FAILED,
  UNBAN_USER_REQUEST,
  UNBAN_USER_SUCCESS,
  UNFOLLOW_AUTHOR_SUCCESS,
  UNSUSPEND_USER_FAILED,
  UNSUSPEND_USER_REQUEST,
  UNSUSPEND_USER_SUCCESS,
  UPDATE_USER_FAILED,
  UPDATE_USER_REQUEST,
  UPDATE_USER_ROLE_FAILED,
  UPDATE_USER_ROLE_REQUEST,
  UPDATE_USER_ROLE_SUCCESS,
  UPDATE_USER_SUCCESS,
  GET_TOTAL_USERS_REQUEST,
  GET_TOTAL_USERS_SUCCESS,
  GET_TOTAL_USERS_FAILED,
  GET_NEW_USERS_BY_MONTH_REQUEST,
  GET_NEW_USERS_BY_MONTH_SUCCESS,
  GET_NEW_USERS_BY_MONTH_FAILED,
  GET_PROFILE_USER_REQUEST,
  GET_PROFILE_USER_SUCCESS,
  GET_PROFILE_USER_FAILED,
  CLEAR_PROFILE_USER,
} from "./user.actionType";

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const upsertUser = (users = [], nextUser) => {
  if (!nextUser || !nextUser.id) {
    return ensureArray(users);
  }
  const list = ensureArray(users);
  const index = list.findIndex((item) => item?.id === nextUser.id);
  if (index === -1) {
    return [...list, nextUser];
  }
  return list.map((item, idx) => (idx === index ? { ...item, ...nextUser } : item));
};

const replaceUser = (users = [], nextUser) => {
  if (!nextUser || !nextUser.id) {
    return ensureArray(users);
  }
  return ensureArray(users).map((item) => (item?.id === nextUser.id ? { ...item, ...nextUser } : item));
};

const removeUserById = (users = [], userId) => {
  if (!userId) {
    return ensureArray(users);
  }
  return ensureArray(users).filter((user) => user?.id !== userId);
};

const initialState = {
  jwt: null,
  error: null,
  user: null,
  profileUser: null,
  users: [],
  searchUsers: [],
  userFollowers: [],
  userFollowings: [],
  blockedUsers: [],
  loading: false,
  loadingMore: false,
  readingProgresses: [],
  preferredCategories: [],
  preferredTags: [],
  totalUsersCount: 0,
  newUsersByMonth: [],
  pagination: {
    currentPage: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
    hasMore: false,
  },
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_USERS_REQUEST:
    case GET_USER_BY_ID_REQUEST:
    case UPDATE_USER_ROLE_REQUEST:
    case SUSPEND_USER_REQUEST:
    case UNSUSPEND_USER_REQUEST:
    case BAN_USER_REQUEST:
    case UNBAN_USER_REQUEST:
    case UPDATE_USER_REQUEST:
    case DELETE_USER_REQUEST:
    case DELETE_CHAPTER_REQUEST:
    case SEARCH_USER_REQUEST:
    case GET_READING_PROGRESS_BY_USER_REQUEST:
    case GET_USER_PREFERENCES_REQUEST:
    case GET_USER_FOLLOWERS_REQUEST:
    case GET_USER_FOLLOWING_REQUEST:
    case GET_TOTAL_USERS_REQUEST:
    case GET_NEW_USERS_BY_MONTH_REQUEST:
    case GET_BLOCKED_USERS_REQUEST:
      return { ...state, loading: true, loadingMore: false, error: null };
    case BLOCK_USER_REQUEST:
    case UNBLOCK_USER_REQUEST:
      return { ...state, error: null };
    case GET_ALL_USERS_SUCCESS: {
      const payload = action.payload || {};
      const content = ensureArray(payload.content);
      const currentPage = payload.currentPage ?? payload.page ?? 0;
      const size = payload.size ?? state.pagination.size;
      const totalPages = payload.totalPages ?? 0;
      const totalElements = payload.totalElements ?? content.length;
      const hasMore = payload.hasMore !== undefined ? payload.hasMore : totalPages > 0 ? currentPage < totalPages - 1 : false;
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        users: content,
        pagination: {
          currentPage,
          size,
          totalPages,
          totalElements,
          hasMore,
        },
      };
    }
    case GET_USER_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        user: action.payload ?? null,
      };
    case GET_READING_PROGRESS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        readingProgresses: ensureArray(action.payload),
      };
    case GET_USER_FOLLOWERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        userFollowers: ensureArray(action.payload),
      };
    case GET_USER_FOLLOWING_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        userFollowings: ensureArray(action.payload),
      };
    case GET_BLOCKED_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        blockedUsers: ensureArray(action.payload),
      };
    case UPDATE_USER_SUCCESS:
    case SUSPEND_USER_SUCCESS:
    case UNSUSPEND_USER_SUCCESS:
    case BAN_USER_SUCCESS:
    case UNBAN_USER_SUCCESS:
    case UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        users: replaceUser(state.users, action.payload),
        user: state.user && action.payload && state.user.id === action.payload.id ? { ...state.user, ...action.payload } : state.user,
      };
    case BLOCK_USER_SUCCESS: {
      const blockedUser = action.payload;
      const blockedId = blockedUser?.id;
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        blockedUsers: blockedUser ? upsertUser(state.blockedUsers, blockedUser) : ensureArray(state.blockedUsers),
        userFollowers: ensureArray(state.userFollowers).filter((follower) => follower?.id !== blockedId),
        userFollowings: ensureArray(state.userFollowings).filter((following) => following?.id !== blockedId),
        user: state.user && blockedId && state.user.id === blockedId ? { ...state.user, isBlocked: true } : state.user,
      };
    }
    case UNBLOCK_USER_SUCCESS: {
      const unblockedId = action.payload;
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        blockedUsers: ensureArray(state.blockedUsers).filter((user) => user?.id !== unblockedId),
        user: state.user && unblockedId && state.user.id === unblockedId ? { ...state.user, isBlocked: false } : state.user,
      };
    }
    case GET_USER_PREFERENCES_SUCCESS: {
      const preferences = action.payload || {};
      const categories = preferences.preferredCategories;
      const tags = preferences.preferredTags;
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        preferredCategories: categories === undefined ? state.preferredCategories : ensureArray(categories),
        preferredTags: tags === undefined ? state.preferredTags : ensureArray(tags),
      };
    }
    case SEARCH_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        searchUsers: ensureArray(action.payload),
      };
    case DELETE_USER_SUCCESS: {
      const payload = action.payload;
      const deletedId = typeof payload === "object" && payload !== null ? payload.id ?? payload.userId ?? payload : payload;
      const sanitizedId = typeof deletedId === "object" ? deletedId?.id : deletedId;
      const idToRemove = typeof sanitizedId === "number" || typeof sanitizedId === "string" ? sanitizedId : null;
      const updatedUsers = idToRemove ? removeUserById(state.users, idToRemove) : ensureArray(state.users);
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        users: updatedUsers,
        searchUsers: idToRemove ? removeUserById(state.searchUsers, idToRemove) : state.searchUsers,
        userFollowers: idToRemove ? removeUserById(state.userFollowers, idToRemove) : state.userFollowers,
        userFollowings: idToRemove ? removeUserById(state.userFollowings, idToRemove) : state.userFollowings,
        blockedUsers: idToRemove ? removeUserById(state.blockedUsers, idToRemove) : state.blockedUsers,
        user: state.user && idToRemove && state.user.id === idToRemove ? null : state.user,
        pagination: {
          ...state.pagination,
          totalElements:
            idToRemove && updatedUsers.length !== state.users.length
              ? Math.max(0, (state.pagination.totalElements || 0) - 1)
              : state.pagination.totalElements,
        },
        totalUsersCount:
          idToRemove && updatedUsers.length !== state.users.length ? Math.max(0, (state.totalUsersCount || 0) - 1) : state.totalUsersCount,
      };
    }
    case FOLLOW_AUTHOR_SUCCESS:
    case UNFOLLOW_AUTHOR_SUCCESS: {
      const payload = action.payload || {};
      const followState = payload.followedByCurrentUser !== undefined ? { followedByCurrentUser: payload.followedByCurrentUser } : {};
      return {
        ...state,
        error: null,
        user: state.user
          ? state.user.id && payload.id && state.user.id === payload.id
            ? { ...state.user, ...payload }
            : { ...state.user, ...followState }
          : state.user,
        users: payload.id ? replaceUser(state.users, payload) : state.users,
      };
    }
    case GET_TOTAL_USERS_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        totalUsersCount: typeof action.payload === "number" ? action.payload : state.totalUsersCount,
      };
    case GET_NEW_USERS_BY_MONTH_SUCCESS:
      return {
        ...state,
        loading: false,
        loadingMore: false,
        error: null,
        newUsersByMonth: ensureArray(action.payload),
      };
    case GET_ALL_USERS_FAILED:
    case GET_USER_BY_ID_FAILED:
    case SUSPEND_USER_FAILED:
    case UNSUSPEND_USER_FAILED:
    case BAN_USER_FAILED:
    case UNBAN_USER_FAILED:
    case UPDATE_USER_FAILED:
    case DELETE_USER_FAILED:
    case DELETE_CHAPTER_FAILED:
    case UPDATE_USER_ROLE_FAILED:
    case GET_READING_PROGRESS_BY_USER_FAILED:
    case GET_USER_PREFERENCES_FAILURE:
    case GET_USER_FOLLOWERS_FAILURE:
    case GET_USER_FOLLOWING_FAILURE:
    case GET_TOTAL_USERS_FAILED:
    case GET_NEW_USERS_BY_MONTH_FAILED:
    case GET_BLOCKED_USERS_FAILURE:
    case BLOCK_USER_FAILURE:
    case UNBLOCK_USER_FAILURE:
    case SEARCH_USER_FAILED:
      return { ...state, loading: false, loadingMore: false, error: action.payload };
    default:
      return state;
    case GET_PROFILE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case GET_PROFILE_USER_SUCCESS:
      return {
        ...state,
        profileUser: action.payload,
        loading: false,
      };

    case GET_PROFILE_USER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case CLEAR_PROFILE_USER:
      return {
        ...state,
        profileUser: null,
      };
  }
};
