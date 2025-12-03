import { api, API_BASE_URL } from "../../api/api";
import { createLogger } from "../../utils/logger";
import { extractErrorMessage, extractResponsePayload } from "../../utils/apiResponseHelpers";
import {
  FETCH_PURCHASE_HISTORY_FAILURE,
  FETCH_PURCHASE_HISTORY_REQUEST,
  FETCH_PURCHASE_HISTORY_SUCCESS,
  FETCH_TOTAL_PURCHASES_FAILURE,
  FETCH_TOTAL_PURCHASES_REQUEST,
  FETCH_TOTAL_PURCHASES_SUCCESS,
  FETCH_TOTAL_SALES_FAILURE,
  FETCH_TOTAL_SALES_REQUEST,
  FETCH_TOTAL_SALES_SUCCESS,
  FETCH_SALES_PER_USER_REQUEST,
  FETCH_SALES_PER_USER_SUCCESS,
  FETCH_SALES_PER_USER_FAILURE,
} from "./purchase.actionType";

const logger = createLogger("PurchaseActions");

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (Array.isArray(value?.content)) {
    return value.content;
  }
  if (Array.isArray(value?.purchases)) {
    return value.purchases;
  }
  return [];
};

const coerceNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const fetchPurchaseHistory = () => async (dispatch) => {
  dispatch({ type: FETCH_PURCHASE_HISTORY_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/api/purchases/history`);
    const { data, message, success } = extractResponsePayload(response);
    const purchaseHistory = ensureArray(data);
    dispatch({ type: FETCH_PURCHASE_HISTORY_SUCCESS, payload: purchaseHistory });
    return { payload: purchaseHistory, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch purchase history", error);
    dispatch({ type: FETCH_PURCHASE_HISTORY_FAILURE, payload: message });
    return { error: message };
  }
};

export const fetchTotalSalesAmount = () => async (dispatch) => {
  dispatch({ type: FETCH_TOTAL_SALES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/purchases/total-sales`);
    const { data, message, success } = extractResponsePayload(response);
    const totalSalesRaw = data?.totalSales ?? data?.amount ?? data;
    const totalSales = coerceNumber(totalSalesRaw);
    dispatch({ type: FETCH_TOTAL_SALES_SUCCESS, payload: totalSales });
    return { payload: totalSales, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch total sales amount", error);
    dispatch({ type: FETCH_TOTAL_SALES_FAILURE, payload: message });
    return { error: message };
  }
};

export const fetchTotalNumberOfPurchases = () => async (dispatch) => {
  dispatch({ type: FETCH_TOTAL_PURCHASES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/purchases/purchases-count`);
    const { data, message, success } = extractResponsePayload(response);
    const totalPurchasesRaw = data?.totalPurchases ?? data?.count ?? data;
    const totalPurchases = coerceNumber(totalPurchasesRaw);
    dispatch({ type: FETCH_TOTAL_PURCHASES_SUCCESS, payload: totalPurchases });
    return { payload: totalPurchases, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch total number of purchases", error);
    dispatch({ type: FETCH_TOTAL_PURCHASES_FAILURE, payload: message });
    return { error: message };
  }
};

export const fetchSalesPerUser = () => async (dispatch) => {
  dispatch({ type: FETCH_SALES_PER_USER_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/sales-per-user`);
    const { data, message, success } = extractResponsePayload(response);
    const salesData = ensureArray(data);
    dispatch({ type: FETCH_SALES_PER_USER_SUCCESS, payload: salesData });
    return { payload: salesData, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch sales statistics per user", error);
    dispatch({ type: FETCH_SALES_PER_USER_FAILURE, payload: message });
    return { error: message };
  }
};
