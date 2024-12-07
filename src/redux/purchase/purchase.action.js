import { api, API_BASE_URL } from "../../api/api";
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
} from "./purchase.actionType";

export const fetchPurchaseHistory = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_PURCHASE_HISTORY_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/purchases/history`);
      dispatch({ type: FETCH_PURCHASE_HISTORY_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_PURCHASE_HISTORY_FAILURE, payload: error.message });
    }
  };
};
export const fetchTotalSalesAmount = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TOTAL_SALES_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/purchases/admin/total-sales`);
      dispatch({ type: FETCH_TOTAL_SALES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_TOTAL_SALES_FAILURE, payload: error.message });
    }
  };
};
export const fetchTotalNumberOfPurchases = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_TOTAL_PURCHASES_REQUEST });
    try {
      const response = await api.get(`${API_BASE_URL}/api/purchases/admin/total-number`);
      dispatch({ type: FETCH_TOTAL_PURCHASES_SUCCESS, payload: response.data });
    } catch (error) {
      dispatch({ type: FETCH_TOTAL_PURCHASES_FAILURE, payload: error.message });
    }
  };
};
