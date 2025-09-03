import axios from "axios";
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

export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, {
      ...loginData.data,
      rememberMe: loginData.rememberMe,
    });

    if (data.token) {
      localStorage.setItem("jwt", data.token);

      // Store token creation time for expiry checks
      localStorage.setItem("tokenTimestamp", Date.now().toString());

      // If rememberMe, store a flag
      if (loginData.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }
    }

    dispatch({ type: LOGIN_SUCCEED, payload: data.token });
    return { payload: data };
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 403) {
        dispatch({ type: LOGIN_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: LOGIN_FAILED, payload: error.response.data.message || "Authentication failed" });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: LOGIN_FAILED, payload: "No response from server" });
    }
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
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, registerData.data);
    dispatch({ type: REGISTER_SUCCEED, payload: data.token });
    return { payload: data };
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: REGISTER_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: REGISTER_FAILED, payload: error.response.data });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: REGISTER_FAILED, payload: "No response from server" });
    }
  }
};

export const getCurrentUserByJwt = (jwt) => async (dispatch) => {
  dispatch({ type: GET_PROFILE_REQUEST });
  try {
    const { data } = await axios.get(`${API_BASE_URL}/api/user/profile`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    dispatch({ type: GET_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      dispatch({ type: GET_PROFILE_FAILED, payload: "Session expired. Please sign in again." });
      return { error: "UNAUTHORIZED" };
    }
    dispatch({ type: GET_PROFILE_FAILED, payload: error.response?.data });
  }
};

export const sendForgotPasswordMail = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });

    dispatch({ type: FORGOT_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    console.log("Api error: ", error.response);
    if (error.response && error.response.status === 400) {
      dispatch({ type: FORGOT_PASSWORD_FAILED, payload: error.response.data || "Invalid reset code or email." });
      return { error: error.response.data || "Invalid reset code or email." };
    }
    dispatch({ type: FORGOT_PASSWORD_FAILED, payload: error.response?.data || "Error resetting password." });
    return { error: error.response?.data || "Error resetting password." };
  }
};

export const resetPasswordAction = (code, password) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/reset-password?code=${code}`, { password });

    dispatch({ type: RESET_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    console.log("Api error: ", error.response);
    if (error.response && error.response.status === 400) {
      dispatch({ type: RESET_PASSWORD_FAILED, payload: error.response.data || "Invalid reset code or email." });
      return { error: error.response.data || "Invalid reset code or email." };
    }
    dispatch({ type: RESET_PASSWORD_FAILED, payload: error.response?.data || "Error resetting password." });
    return { error: error.response?.data || "Error resetting password." };
  }
};

export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/user/profile`, reqData);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: error.response.data });
  }
};

export const refreshToken = () => async (dispatch) => {
  try {
    const currentToken = localStorage.getItem("jwt");
    if (!currentToken) return null;

    const { data } = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );

    if (data.token) {
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("tokenTimestamp", Date.now().toString());
      dispatch({ type: LOGIN_SUCCEED, payload: data.token });
      return data.token;
    }
    return null;
  } catch (error) {
    console.log("Token refresh failed:", error);
    // If refresh fails, log the user out
    dispatch(logoutAction());
    return null;
  }
};

export const verifyOtpAction = (email, otp, context) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
      email,
      otp,
      context,
    });

    dispatch({ type: VERIFY_OTP_SUCCEED, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("OTP verification error: ", error.response);
    const errorMessage = error.response?.data || "OTP verification failed";
    dispatch({ type: VERIFY_OTP_FAILED, payload: errorMessage });
    return { error: errorMessage };
  }
};
