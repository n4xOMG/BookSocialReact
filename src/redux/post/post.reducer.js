// src/redux/posts/post.reducer.js

import {
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  ADD_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  DELETE_POST_REQUEST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  LIKE_POST_SUCCESS,
  FETCH_POSTS_BY_USER_REQUEST,
  FETCH_POSTS_BY_USER_SUCCESS,
  FETCH_POSTS_BY_USER_FAILURE,
  FETCH_POSTS_BY_ID_SUCCESS,
  FETCH_POSTS_BY_ID_REQUEST,
  FETCH_POSTS_BY_ID_FAILURE,
} from "./post.actionType";

const ensureArray = (value) => (Array.isArray(value) ? value : []);

const upsertPost = (posts = [], post) => {
  if (!post || !post.id) {
    return ensureArray(posts);
  }
  const safePosts = ensureArray(posts);
  const index = safePosts.findIndex((item) => item?.id === post.id);
  if (index === -1) {
    return [post, ...safePosts];
  }
  return safePosts.map((item, idx) => (idx === index ? post : item));
};

const replacePost = (posts = [], post) => {
  if (!post || !post.id) {
    return ensureArray(posts);
  }
  return ensureArray(posts).map((item) => (item?.id === post.id ? post : item));
};

const removePostById = (posts = [], postId) => {
  if (!postId) {
    return ensureArray(posts);
  }
  return ensureArray(posts).filter((item) => item?.id !== postId);
};

const initialState = {
  post: null,
  posts: [],
  postsByUser: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    hasMore: false,
  },
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case FETCH_POSTS_BY_ID_REQUEST:
      return { ...state, loading: true, error: null, post: null };
    case FETCH_POSTS_BY_USER_REQUEST:
    case ADD_POST_REQUEST:
    case UPDATE_POST_REQUEST:
    case DELETE_POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_POSTS_BY_ID_SUCCESS:
      return {
        ...state,
        error: null,
        loading: false,
        post: action.payload,
        posts: replacePost(state.posts, action.payload),
      };
    case FETCH_POSTS_SUCCESS: {
      const payload = action.payload || {};
      const content = ensureArray(payload.content);
      const currentPage = payload.currentPage ?? payload.page ?? 0;
      const size = payload.size ?? state.pagination.size;
      const totalPages = payload.totalPages ?? 0;
      const totalElements = payload.totalElements ?? content.length;
      const hasMore = payload.hasMore ?? (totalPages > 0 ? currentPage < totalPages - 1 : false);
      return {
        ...state,
        loading: false,
        error: null,
        posts: content,
        pagination: {
          currentPage,
          totalPages,
          totalElements,
          size,
          hasMore,
        },
      };
    }
    case FETCH_POSTS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        postsByUser: ensureArray(action.payload),
      };
    case ADD_POST_SUCCESS:
      const newPost = action.payload;
      const alreadyExists = ensureArray(state.posts).some((item) => item?.id && item.id === newPost?.id);
      const updatedPosts = upsertPost(state.posts, newPost).slice(0, state.pagination.size);
      return {
        ...state,
        loading: false,
        error: null,
        post: newPost,
        posts: updatedPosts,
        pagination: {
          ...state.pagination,
          totalElements: alreadyExists ? state.pagination.totalElements : (state.pagination.totalElements || 0) + 1,
        },
      };
    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        post: action.payload,
        posts: replacePost(state.posts, action.payload),
      };
    case DELETE_POST_SUCCESS: {
      const deletedId = typeof action.payload === "object" ? action.payload?.id || action.payload?.postId : action.payload;
      const updatedPosts = removePostById(state.posts, deletedId);
      return {
        ...state,
        loading: false,
        error: null,
        post: state.post && state.post.id === deletedId ? null : state.post,
        posts: updatedPosts,
        pagination: {
          ...state.pagination,
          totalElements: Math.max(0, (state.pagination.totalElements || 0) - (state.posts.length !== updatedPosts.length ? 1 : 0)),
        },
      };
    }
    case LIKE_POST_SUCCESS: {
      const likedPost = action.payload;
      if (!likedPost) {
        return state;
      }
      return {
        ...state,
        error: null,
        post: state.post && state.post.id === likedPost.id ? likedPost : state.post,
        posts: replacePost(state.posts, likedPost),
      };
    }
    case FETCH_POSTS_BY_ID_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_POSTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case FETCH_POSTS_BY_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_POST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case UPDATE_POST_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case DELETE_POST_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
