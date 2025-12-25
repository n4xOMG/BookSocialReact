import httpClient from "../../api/api";
import { createLogger } from "../../utils/logger";
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
  VERIFY_OTP_FAILED,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCEED,
} from "./auth.actionType";
import { api, API_BASE_URL } from "../../api/api";

const logger = createLogger("AuthActions");

/**
 * Extract user-friendly message from response payload
 * Prioritizes message field over data field to avoid extracting JWT tokens
 */
const extractMessage = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string") return payload;

  // Prioritize message field (most common)
  if (typeof payload.message === "string" && payload.message.length) return payload.message;

  // Check for error field
  if (typeof payload.error === "string" && payload.error.length) return payload.error;

  // Only check nested data.message (not data itself, which might be a token)
  if (payload.data && typeof payload.data.message === "string" && payload.data.message.length) {
    return payload.data.message;
  }

  return null;
};

const extractErrorMessage = (error, fallback = "Something went wrong.") => {
  if (!error) return fallback;
  const responseData = error.response?.data;
  const message = extractMessage(responseData);
  if (message) return message;
  if (typeof error.message === "string" && error.message.length) return error.message;
  return fallback;
};

/**
 * Normalize auth response from backend
 * Backend sends: { message: string, success: boolean, data: token_string }
 * We normalize to: { token: string, message: string, success: boolean }
 */
const normaliseAuthResponse = (data) => {
  // Extract token - backend sends it in 'data' field
  let token = null;
  if (typeof data?.data === "string" && data.data.length > 0) {
    token = data.data;
  } else if (typeof data?.token === "string" && data.token.length > 0) {
    token = data.token;
  }

  return {
    token,
    message: extractMessage(data),
    success: data?.success !== false, // Default to true if not specified
  };
};

export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/auth/signin`, {
      ...loginData.data,
      rememberMe: loginData.rememberMe,
    });
    logger.debug("Login response: ", { data });

    const authPayload = normaliseAuthResponse(data);

    // Check if backend explicitly marked as failed
    if (authPayload.success === false || !authPayload.token) {
      const message = authPayload.message || "Authentication failed";
      dispatch({ type: LOGIN_FAILED, payload: message });
      return { error: message };
    }

    // Success - store token
    localStorage.setItem("jwt", authPayload.token);
    localStorage.setItem("tokenTimestamp", Date.now().toString());

    if (loginData.rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    dispatch({ type: LOGIN_SUCCEED, payload: authPayload });
    return { payload: authPayload };
  } catch (error) {
    const message = extractErrorMessage(error, "Authentication failed");
    dispatch({ type: LOGIN_FAILED, payload: message });
    return { error: message };
  }
};

export const logoutAction = () => {
  localStorage.removeItem("jwt");
  localStorage.removeItem("tokenTimestamp");
  localStorage.removeItem("rememberMe");

  return {
    type: LOGOUT,
  };
};

export const registerUserAction = (registerData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/auth/signup`, registerData.data);
    logger.debug("Register response: ", { data });

    const authPayload = normaliseAuthResponse(data);

    // Check if backend explicitly marked as failed
    if (authPayload.success === false || !authPayload.token) {
      const message = authPayload.message || "Registration failed";
      dispatch({ type: REGISTER_FAILED, payload: message });
      return { error: message };
    }

    // Success - store token
    localStorage.setItem("jwt", authPayload.token);
    localStorage.setItem("tokenTimestamp", Date.now().toString());

    dispatch({ type: REGISTER_SUCCEED, payload: authPayload });
    return { payload: authPayload };
  } catch (error) {
    const message = extractErrorMessage(error, "Registration failed");
    dispatch({ type: REGISTER_FAILED, payload: message });
    return { error: message };
  }
};

export const getCurrentUserByJwt = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    if (jwt && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("jwt");
      if (storedToken !== jwt) {
        localStorage.setItem("jwt", jwt);
      }
    }

    const { data } = await httpClient.get(`${API_BASE_URL}/api/user/profile`);

    // Backend returns: { message, success, data: UserDTO }
    // Extract the actual user data from the response
    const userData = data?.data || data;

    dispatch({ type: GET_PROFILE_SUCCESS, payload: userData });
    return { payload: userData };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch({ type: GET_PROFILE_FAILED, payload: "Session expired. Please sign in again." });
      return { error: "UNAUTHORIZED" };
    }
    const message = extractErrorMessage(error, "Failed to load profile.");
    dispatch({ type: GET_PROFILE_FAILED, payload: message });
    return { error: message };
  }
};

export const sendForgotPasswordMail = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/auth/forgot-password`, { email });
    logger.debug("Forgot password response: ", { data });

    // Check if backend explicitly marked as failed
    if (data?.success === false) {
      const message = extractMessage(data) || "Failed to send reset email.";
      dispatch({ type: FORGOT_PASSWORD_FAILED, payload: message });
      return { error: message };
    }

    const message = extractMessage(data) || "Reset password link has been sent to your email.";
    dispatch({ type: FORGOT_PASSWORD_SUCCEED, payload: message });
    return { payload: { message, success: true } };
  } catch (error) {
    const message = extractErrorMessage(error, "Error sending reset email.");
    dispatch({ type: FORGOT_PASSWORD_FAILED, payload: message });
    return { error: message };
  }
};

export const resetPasswordAction = (email, password, resetToken) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/auth/reset-password`, {
      email,
      password,
      resetToken,
    });
    logger.debug("Reset password response: ", { data });

    // Check if backend explicitly marked as failed
    if (data?.success === false) {
      const message = extractMessage(data) || "Failed to reset password.";
      dispatch({ type: RESET_PASSWORD_FAILED, payload: message });
      return { error: message };
    }

    const message = extractMessage(data) || "Password has been reset successfully.";
    dispatch({ type: RESET_PASSWORD_SUCCEED, payload: message });
    return { payload: { message, success: true } };
  } catch (error) {
    const message = extractErrorMessage(error, "Error resetting password.");
    dispatch({ type: RESET_PASSWORD_FAILED, payload: message });
    return { error: message };
  }
};

export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/user/profile`, reqData);
    logger.debug("Update profile response: ", { data });

    // Backend returns: { message, success, data: UserDTO }
    const userData = data?.data || data;
    const message = extractMessage(data);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: userData });
    return { payload: userData, message };
  } catch (error) {
    const message = extractErrorMessage(error, "Error updating profile.");
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: message });
    return { error: message };
  }
};

export const confirmEmailChangeAction = (otp) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/user/confirm-email-change`, { otp });
    logger.debug("Confirm email change response: ", { data });

    const userData = data?.data || data;
    const message = extractMessage(data);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: userData });
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokenTimestamp");
    localStorage.removeItem("rememberMe");
    dispatch({ type: LOGOUT });
    
    return { payload: userData, message };
  } catch (error) {
    const message = extractErrorMessage(error, "Error confirming email change.");
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: message });
    return { error: message };
  }
};

export const rollbackEmailAction = (token) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/user/rollback-email?token=${encodeURIComponent(token)}`);
    logger.debug("Rollback email response: ", { data });

    const userData = data?.data || data;
    const message = extractMessage(data);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: userData });
    // Clear any existing session since email has changed
    localStorage.removeItem("jwt");
    localStorage.removeItem("tokenTimestamp");
    localStorage.removeItem("rememberMe");
    dispatch({ type: LOGOUT });
    
    return { payload: userData, message };
  } catch (error) {
    const message = extractErrorMessage(error, "Error recovering email.");
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: message });
    return { error: message };
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    const currentToken = localStorage.getItem("jwt");
    if (!currentToken) {
      logger.debug("No token to refresh");
      return null;
    }

    const { data } = await httpClient.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        headers: { Authorization: `Bearer ${currentToken}` },
      }
    );

    const authPayload = normaliseAuthResponse(data);

    if (authPayload.token) {
      localStorage.setItem("jwt", authPayload.token);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      dispatch({ type: LOGIN_SUCCEED, payload: authPayload });
      logger.debug("Token refreshed successfully");
      return authPayload.token;
    }

    logger.warn("Token refresh returned no token");
    return null;
  } catch (error) {
    logger.info("Token refresh failed:", error);
    // If refresh fails, log the user out
    dispatch(logoutAction());
    return null;
  }
};

export const verifyOtpAction = (email, otp, context) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const { data } = await httpClient.post(`${API_BASE_URL}/auth/verify-otp`, {
      email,
      otp,
      context,
    });
    logger.debug("OTP verification response: ", { data });

    // Check if backend explicitly marked as failed
    if (data?.success === false) {
      const message = extractMessage(data) || "OTP verification failed";
      dispatch({ type: VERIFY_OTP_FAILED, payload: message });
      return { error: message };
    }

    const message = extractMessage(data) || "OTP verified successfully.";
    // Extract resetToken from response data (returned for RESET_PASSWORD context)
    const resetToken = typeof data?.data === "string" ? data.data : null;
    dispatch({ type: VERIFY_OTP_SUCCEED, payload: message });
    return { payload: { message, success: true, resetToken } };
  } catch (error) {
    const message = extractErrorMessage(error, "OTP verification failed");
    dispatch({ type: VERIFY_OTP_FAILED, payload: message });
    return { error: message };
  }
};
