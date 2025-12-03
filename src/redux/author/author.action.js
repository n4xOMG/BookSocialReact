import { api, API_BASE_URL } from "../../api/api";
import { createLogger } from "../../utils/logger";
import { extractErrorMessage, extractPaginatedResponse, extractResponsePayload } from "../../utils/apiResponseHelpers";
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
  GET_BOOK_PERFORMANCE_REQUEST,
  GET_BOOK_PERFORMANCE_SUCCESS,
  GET_BOOK_PERFORMANCE_FAILURE,
} from "./author.actionType";

const logger = createLogger("AuthorActions");

const ensureObject = (value) => {
  if (value && typeof value === "object") {
    return value;
  }
  return null;
};

export const getAuthorDashboard =
  (page = 0, size = 10, sortBy = "id") =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_DASHBOARD_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/author/dashboard`, {
        params: { page, size, sortBy },
      });
      const { data, message, success } = extractResponsePayload(response);
      const dashboard = ensureObject(data);
      dispatch({ type: GET_AUTHOR_DASHBOARD_SUCCESS, payload: dashboard });
      return { payload: dashboard, message, success };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.error("Failed to fetch author dashboard", error);
      dispatch({ type: GET_AUTHOR_DASHBOARD_FAILURE, payload: message });
      return { error: message };
    }
  };

export const getAuthorEarnings =
  (page = 0, size = 20) =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_EARNINGS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/author/earnings`, {
        params: { page, size },
      });
      const { data, message, success } = extractResponsePayload(response);
      const pageData = extractPaginatedResponse(response);
      const payload = ensureObject(data) || pageData;
      dispatch({ type: GET_AUTHOR_EARNINGS_SUCCESS, payload });
      return { payload, message, success };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.error("Failed to fetch author earnings", error);
      dispatch({ type: GET_AUTHOR_EARNINGS_FAILURE, payload: message });
      return { error: message };
    }
  };

export const getAuthorPayouts =
  (page = 0, size = 20) =>
  async (dispatch) => {
    dispatch({ type: GET_AUTHOR_PAYOUTS_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/author/payouts`, {
        params: { page, size },
      });
      const { data, message, success } = extractResponsePayload(response);
      const pageData = extractPaginatedResponse(response);
      const payload = ensureObject(data) || pageData;
      dispatch({ type: GET_AUTHOR_PAYOUTS_SUCCESS, payload });
      return { payload, message, success };
    } catch (error) {
      const message = extractErrorMessage(error);
      logger.error("Failed to fetch author payouts", error);
      dispatch({ type: GET_AUTHOR_PAYOUTS_FAILURE, payload: message });
      return { error: message };
    }
  };

export const requestAuthorPayout = (amount) => async (dispatch) => {
  dispatch({ type: REQUEST_PAYOUT_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/author/payouts/request`, { amount });
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: REQUEST_PAYOUT_SUCCESS, payload: data });
    await dispatch(getAuthorDashboard());
    await dispatch(getAuthorPayouts());
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to request payout", error);
    dispatch({ type: REQUEST_PAYOUT_FAILURE, payload: message });
    return { error: message };
  }
};

export const getPayoutSettings = () => async (dispatch) => {
  dispatch({ type: GET_PAYOUT_SETTINGS_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/author/payout-settings`);
    const { data, message, success } = extractResponsePayload(response);
    const settings = ensureObject(data);
    dispatch({ type: GET_PAYOUT_SETTINGS_SUCCESS, payload: settings });
    return { payload: settings, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch payout settings", error);
    dispatch({ type: GET_PAYOUT_SETTINGS_FAILURE, payload: message });
    return { error: message };
  }
};

// Update payout settings (PayPal email, min amount, frequency, auto payout, etc.)
export const updatePayoutSettings = (settings) => async (dispatch) => {
  dispatch({ type: GET_PAYOUT_SETTINGS_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/author/payout-settings`, settings);
    const { data, message, success } = extractResponsePayload(response);
    const updated = ensureObject(data);
    dispatch({ type: GET_PAYOUT_SETTINGS_SUCCESS, payload: updated });
    await dispatch(getAuthorDashboard());
    return { payload: updated, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to update payout settings", error);
    dispatch({ type: GET_PAYOUT_SETTINGS_FAILURE, payload: message });
    return { error: message };
  }
};

export const getBookPerformance = () => async (dispatch) => {
  dispatch({ type: GET_BOOK_PERFORMANCE_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/author/books/performance`);
    const { data, message, success } = extractResponsePayload(response);
    dispatch({ type: GET_BOOK_PERFORMANCE_SUCCESS, payload: data });
    return { payload: data, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch book performance", error);
    dispatch({ type: GET_BOOK_PERFORMANCE_FAILURE, payload: message });
    return { error: message };
  }
};
