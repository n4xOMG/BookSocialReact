import {
  FORGOT_PASSWORD_FAILED,
  FORGOT_PASSWORD_REQUEST,
  FORGOT_PASSWORD_SUCCEED,
  GET_PROFILE_FAILED,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  LOGIN_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCEED,
  REGISTER_FAILED,
  REGISTER_REQUEST,
  REGISTER_SUCCEED,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCEED,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
} from "./auth.actionType";

const initialState = {
  jwt: null,
  error: null,
  user: null,
  loading: false,
  forgotPasswordMessage: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case GET_PROFILE_REQUEST:
    case FORGOT_PASSWORD_REQUEST:
    case RESET_PASSWORD_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case GET_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
    case RESET_PASSWORD_SUCCEED:
      return { ...state, loading: false, error: null, user: action.payload };
    case LOGIN_SUCCEED:
    case REGISTER_SUCCEED:
      return { ...state, jwt: action.payload, loading: false };

    case FORGOT_PASSWORD_SUCCEED:
      return { ...state, loading: false, forgotPasswordMessage: action.payload };

    case LOGIN_FAILED:
    case REGISTER_FAILED:
    case GET_PROFILE_FAILED:
    case FORGOT_PASSWORD_FAILED:
    case RESET_PASSWORD_FAILED:
    case UPDATE_PROFILE_FAILED:
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
