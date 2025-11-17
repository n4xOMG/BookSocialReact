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
  LOGOUT,
  REGISTER_FAILED,
  REGISTER_REQUEST,
  REGISTER_SUCCEED,
  RESET_PASSWORD_FAILED,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCEED,
  UPDATE_PROFILE_FAILED,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCEED,
  VERIFY_OTP_FAILED,
} from "./auth.actionType";

const initialState = {
  jwt: null,
  error: null,
  user: null,
  loading: false,
  isAuthenticated: false,
  forgotPasswordMessage: null,
  otpVerificationMessage: null,
  authMessage: null,
  resetPasswordMessage: null,
  success: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
      return { ...state, loading: true, error: null, authMessage: null };

    case GET_PROFILE_REQUEST:
    case UPDATE_PROFILE_REQUEST:
      return { ...state, loading: true, error: null };

    case FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, forgotPasswordMessage: null };

    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, resetPasswordMessage: null };

    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null, otpVerificationMessage: null };

    case GET_PROFILE_SUCCESS:
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        user: action.payload,
        isAuthenticated: true,
      };

    case LOGIN_SUCCEED:
      return {
        ...state,
        jwt: action.payload?.token || null,
        loading: false,
        error: null,
        authMessage: action.payload?.message || null,
        success: action.payload?.success !== false,
        isAuthenticated: !!action.payload?.token,
      };

    case REGISTER_SUCCEED:
      return {
        ...state,
        jwt: action.payload?.token || null,
        loading: false,
        error: null,
        authMessage: action.payload?.message || null,
        success: action.payload?.success !== false,
        isAuthenticated: !!action.payload?.token,
      };

    case FORGOT_PASSWORD_SUCCEED:
      return { ...state, loading: false, error: null, forgotPasswordMessage: action.payload };

    case RESET_PASSWORD_SUCCEED:
      return { ...state, loading: false, error: null, resetPasswordMessage: action.payload };

    case VERIFY_OTP_SUCCEED:
      return { ...state, loading: false, error: null, otpVerificationMessage: action.payload };

    case LOGIN_FAILED:
    case REGISTER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        authMessage: null,
        isAuthenticated: false,
      };

    case GET_PROFILE_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        user: null,
        isAuthenticated: false,
      };

    case FORGOT_PASSWORD_FAILED:
      return { ...state, loading: false, error: action.payload, forgotPasswordMessage: null };

    case RESET_PASSWORD_FAILED:
      return { ...state, loading: false, error: action.payload, resetPasswordMessage: null };

    case UPDATE_PROFILE_FAILED:
      return { ...state, loading: false, error: action.payload };

    case VERIFY_OTP_FAILED:
      return { ...state, loading: false, error: action.payload, otpVerificationMessage: null };

    case LOGOUT:
      return {
        ...initialState,
        loading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
