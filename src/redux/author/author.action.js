import { api, API_BASE_URL } from "../../api/api";
import {
  GET_AUTHOR_DASHBOARD_REQUEST,
  GET_AUTHOR_DASHBOARD_SUCCESS,
  GET_AUTHOR_DASHBOARD_FAILURE,
  GET_AUTHOR_EARNINGS_REQUEST,
  GET_AUTHOR_EARNINGS_SUCCESS,
  GET_AUTHOR_EARNINGS_FAILURE,
  GET_AUTHOR_PAYOUTS_REQUEST,
  GET_AUTHOR_PAYOUTS_SUCCESS,
  GET_AUTHOR_PAYOUTS_FAILURE,
  REQUEST_PAYOUT_REQUEST,
  REQUEST_PAYOUT_SUCCESS,
  REQUEST_PAYOUT_FAILURE,
  GET_PAYOUT_SETTINGS_REQUEST,
  GET_PAYOUT_SETTINGS_SUCCESS,
  GET_PAYOUT_SETTINGS_FAILURE,
} from "./author.actionType";

export const getAuthorDashboard =
  (page = 0, size = 10, sortBy = "id") =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_DASHBOARD_REQUEST });
    try {
      const { data } = await api.get(`${API_BASE_URL}/api/author/dashboard`, {
        params: { page, size, sortBy },
      });
      dispatch({ type: GET_AUTHOR_DASHBOARD_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      dispatch({ type: GET_AUTHOR_DASHBOARD_FAILURE, payload: error.response?.data || error.message });
    }
  };

export const getAuthorEarnings =
  (page = 0, size = 20) =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_EARNINGS_REQUEST });
    try {
      const { data } = await api.get(`${API_BASE_URL}/api/author/earnings`, {
        params: { page, size },
      });
      dispatch({ type: GET_AUTHOR_EARNINGS_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      dispatch({ type: GET_AUTHOR_EARNINGS_FAILURE, payload: error.response?.data || error.message });
    }
  };

export const getAuthorPayouts =
  (page = 0, size = 20) =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_PAYOUTS_REQUEST });
    try {
      const { data } = await api.get(`${API_BASE_URL}/api/author/payouts`, {
        params: { page, size },
      });
      dispatch({ type: GET_AUTHOR_PAYOUTS_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      dispatch({ type: GET_AUTHOR_PAYOUTS_FAILURE, payload: error.response?.data || error.message });
    }
  };

export const requestAuthorPayout = (amount) => async (dispatch) => {
  dispatch({ type: REQUEST_PAYOUT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/author/payouts/request`, { amount });
    dispatch({ type: REQUEST_PAYOUT_SUCCESS, payload: data });
    // Refresh dashboard after payout request
    dispatch(getAuthorDashboard());
    dispatch(getAuthorPayouts());
    return { payload: data };
  } catch (error) {
    dispatch({ type: REQUEST_PAYOUT_FAILURE, payload: error.response?.data || error.message });
  }
};

export const getPayoutSettings = () => async (dispatch) => {
  dispatch({ type: GET_PAYOUT_SETTINGS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/author/payout-settings`);
    dispatch({ type: GET_PAYOUT_SETTINGS_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_PAYOUT_SETTINGS_FAILURE, payload: error.response?.data || error.message });
  }
};

// Update payout settings (PayPal email, min amount, frequency, auto payout, etc.)
export const updatePayoutSettings = (settings) => async (dispatch) => {
  dispatch({ type: GET_PAYOUT_SETTINGS_REQUEST });
  try {
    const { data } = await api.put(`${API_BASE_URL}/api/author/payout-settings`, settings);
    dispatch({ type: GET_PAYOUT_SETTINGS_SUCCESS, payload: data });
    // Optionally refresh dashboard as min amount impacts canRequest
    dispatch(getAuthorDashboard());
    return { payload: data };
  } catch (error) {
    dispatch({ type: GET_PAYOUT_SETTINGS_FAILURE, payload: error.response?.data || error.message });
  }
};
