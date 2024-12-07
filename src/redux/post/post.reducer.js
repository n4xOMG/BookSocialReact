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
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_REPLY_POST_COMMENT_SUCCESS,
  DELETE_POST_COMMENT_SUCCESS,
  FETCH_POSTS_BY_ID_SUCCESS,
  FETCH_POSTS_BY_ID_REQUEST,
} from "./post.actionType";

const initialState = {
  post: null,
  posts: [],
  postsByUser: [],
  loading: false,
  error: null,
};

export const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
    case FETCH_POSTS_BY_ID_REQUEST:
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
        post: action.payload,
        posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)),
      };
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: action.payload,
      };
    case FETCH_POSTS_BY_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        postsByUser: action.payload,
      };
    case ADD_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: [action.payload, ...state.posts],
      };
    case UPDATE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)),
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        posts: state.posts.filter((post) => post.id !== action.payload),
      };
    case LIKE_POST_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) => (post.id === action.payload.id ? action.payload : post)),
      };
    case CREATE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.postId ? { ...post, comments: [...post.comments, action.payload] } : post
        ),
        error: null,
      };
    case CREATE_REPLY_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) => ({
          ...post,
          comments: post.comments.map((comment) =>
            comment.id === action.payload.parentCommentId
              ? {
                  ...comment,
                  replyComment: comment.replyComment ? [...comment.replyComment, action.payload] : [action.payload],
                }
              : comment
          ),
        })),
        error: null,
      };

    case DELETE_POST_COMMENT_SUCCESS:
      return {
        ...state,
        posts: state.posts.map((post) => ({
          ...post,
          comments: post.comments.filter((comment) => comment.id !== action.payload),
        })),
        error: null,
      };
    case FETCH_POSTS_FAILURE:
    case FETCH_POSTS_BY_USER_FAILURE:
    case ADD_POST_FAILURE:
    case UPDATE_POST_FAILURE:
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
