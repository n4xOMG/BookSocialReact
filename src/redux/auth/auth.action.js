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
import { api, API_BASE_URL } from "../../api/api";
export const loginUserAction = (loginData) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signin`, loginData.data);
    if (data.token) {
      localStorage.setItem("jwt", data.token);
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
        dispatch({ type: LOGIN_FAILED, payload: error.message });
      }
    } else {
      console.log("No response from server");
      dispatch({ type: LOGIN_FAILED, payload: "No response from server" });
    }
  }
};
export const logoutAction = () => ({
  type: LOGOUT,
});
export const registerUserAction = (registerData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/signup`, registerData.data);
    dispatch({ type: REGISTER_SUCCEED, payload: data.token });
  } catch (error) {
    if (error.response) {
      console.log("Error response data: ", error.response.data);
      console.log("Error response status: ", error.response.status);

      if (error.response.status === 406) {
        dispatch({ type: REGISTER_FAILED, payload: error.response.data.message });
      } else {
        dispatch({ type: REGISTER_FAILED, payload: error.message });
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
    dispatch({ type: GET_PROFILE_FAILED, payload: error.message });
  }
};

export const sendForgotPasswordMail = (email) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email });

    dispatch({ type: FORGOT_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: FORGOT_PASSWORD_FAILED, payload: error.message });
  }
};

export const resetPasswordAction = (code, password) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const { data } = await axios.post(`${API_BASE_URL}/auth/reset-password?code=${code}`, { password });

    dispatch({ type: RESET_PASSWORD_SUCCEED, payload: data.message });
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: RESET_PASSWORD_FAILED, payload: error.message });
  }
};

export const updateUserProfile = (reqData) => async (dispatch) => {
  dispatch({ type: UPDATE_PROFILE_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/user/profile`, reqData.data);

    dispatch({ type: UPDATE_PROFILE_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    console.log("Api error: ", error.message);
    dispatch({ type: UPDATE_PROFILE_FAILED, payload: error.message });
  }
};
