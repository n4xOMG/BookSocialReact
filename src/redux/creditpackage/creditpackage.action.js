import { api, API_BASE_URL } from "../../api/api";
import { createLogger } from "../../utils/logger";
import { extractErrorMessage, extractResponsePayload } from "../../utils/apiResponseHelpers";
import {
  GET_ALL_CREDIT_PACKAGES_REQUEST,
  GET_ALL_CREDIT_PACKAGES_SUCCESS,
  GET_ALL_CREDIT_PACKAGES_FAILURE,
  GET_ACTIVE_CREDIT_PACKAGES_REQUEST,
  GET_ACTIVE_CREDIT_PACKAGES_SUCCESS,
  GET_ACTIVE_CREDIT_PACKAGES_FAILURE,
  GET_CREDIT_PACKAGE_BY_ID_REQUEST,
  GET_CREDIT_PACKAGE_BY_ID_SUCCESS,
  GET_CREDIT_PACKAGE_BY_ID_FAILURE,
  CREATE_CREDIT_PACKAGE_REQUEST,
  CREATE_CREDIT_PACKAGE_SUCCESS,
  CREATE_CREDIT_PACKAGE_FAILURE,
  UPDATE_CREDIT_PACKAGE_REQUEST,
  UPDATE_CREDIT_PACKAGE_SUCCESS,
  UPDATE_CREDIT_PACKAGE_FAILURE,
  DELETE_CREDIT_PACKAGE_REQUEST,
  DELETE_CREDIT_PACKAGE_SUCCESS,
  DELETE_CREDIT_PACKAGE_FAILURE,
  SEARCH_CREDIT_PACKAGES_BY_NAME_REQUEST,
  SEARCH_CREDIT_PACKAGES_BY_NAME_SUCCESS,
  SEARCH_CREDIT_PACKAGES_BY_NAME_FAILURE,
  GET_CREDIT_PACKAGES_BY_PRICE_REQUEST,
  GET_CREDIT_PACKAGES_BY_PRICE_SUCCESS,
  GET_CREDIT_PACKAGES_BY_PRICE_FAILURE,
  GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_REQUEST,
  GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_SUCCESS,
  GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_FAILURE,
  ACTIVATE_CREDIT_PACKAGE_REQUEST,
  ACTIVATE_CREDIT_PACKAGE_SUCCESS,
  ACTIVATE_CREDIT_PACKAGE_FAILURE,
  DEACTIVATE_CREDIT_PACKAGE_REQUEST,
  DEACTIVATE_CREDIT_PACKAGE_SUCCESS,
  DEACTIVATE_CREDIT_PACKAGE_FAILURE,
} from "./creditpackage.actionType";

const logger = createLogger("CreditPackageActions");

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (Array.isArray(value?.content)) {
    return value.content;
  }
  return [];
};

const normalizePackage = (value) => {
  if (value && typeof value === "object") {
    return value;
  }
  return null;
};

// Get All Credit Packages
export const getAllCreditPackages = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CREDIT_PACKAGES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/credit-packages`);
    const { data, message, success } = extractResponsePayload(response);
    const packages = ensureArray(data);
    dispatch({ type: GET_ALL_CREDIT_PACKAGES_SUCCESS, payload: packages });
    return { payload: packages, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch credit packages", error);
    dispatch({ type: GET_ALL_CREDIT_PACKAGES_FAILURE, payload: message });
    return { error: message };
  }
};

// Get Active Credit Packages
export const getActiveCreditPackages = () => async (dispatch) => {
  dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/credit-packages/active`);
    const { data, message, success } = extractResponsePayload(response);
    const packages = ensureArray(data);
    dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_SUCCESS, payload: packages });
    return { payload: packages, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch active credit packages", error);
    dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_FAILURE, payload: message });
    return { error: message };
  }
};

// Get Credit Package by ID
export const getCreditPackageById = (id) => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/credit-packages/${id}`);
    const { data, message, success } = extractResponsePayload(response);
    const resolved = normalizePackage(data);
    dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_SUCCESS, payload: resolved });
    return { payload: resolved, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to fetch credit package", error);
    dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_FAILURE, payload: message });
    return { error: message };
  }
};

// Create Credit Package
export const createCreditPackage = (creditPackage) => async (dispatch) => {
  dispatch({ type: CREATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/admin/credit-packages`, creditPackage);
    const { data, message, success } = extractResponsePayload(response);
    const created = normalizePackage(data);
    dispatch({ type: CREATE_CREDIT_PACKAGE_SUCCESS, payload: created });
    return { payload: created, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to create credit package", error);
    dispatch({ type: CREATE_CREDIT_PACKAGE_FAILURE, payload: message });
    return { error: message };
  }
};

// Update Credit Package
export const updateCreditPackage = (id, creditPackage) => async (dispatch) => {
  dispatch({ type: UPDATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/admin/credit-packages/${id}`, creditPackage);
    const { data, message, success } = extractResponsePayload(response);
    const updated = normalizePackage(data);
    dispatch({ type: UPDATE_CREDIT_PACKAGE_SUCCESS, payload: updated });
    return { payload: updated, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to update credit package", error);
    dispatch({ type: UPDATE_CREDIT_PACKAGE_FAILURE, payload: message });
    return { error: message };
  }
};

// Delete Credit Package
export const deleteCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.delete(`${API_BASE_URL}/admin/credit-packages/${id}`);
    const { data, message, success } = extractResponsePayload(response);
    const deletedId = data?.id ?? id;
    dispatch({ type: DELETE_CREDIT_PACKAGE_SUCCESS, payload: deletedId });
    return { payload: deletedId, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to delete credit package", error);
    dispatch({ type: DELETE_CREDIT_PACKAGE_FAILURE, payload: message });
    return { error: message };
  }
};

// Search Credit Packages by Name
export const searchCreditPackagesByName = (name) => async (dispatch) => {
  dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/credit-packages/search`, {
      params: { name },
    });
    const { data, message, success } = extractResponsePayload(response);
    const packages = ensureArray(data);
    dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_SUCCESS, payload: packages });
    return { payload: packages, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to search credit packages", error);
    dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_FAILURE, payload: message });
    return { error: message };
  }
};

// Get Credit Packages by Price
export const getCreditPackagesByPrice = (maxPrice) => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/credit-packages/price`, {
      params: { maxPrice },
    });
    const { data, message, success } = extractResponsePayload(response);
    const packages = ensureArray(data);
    dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_SUCCESS, payload: packages });
    return { payload: packages, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to filter credit packages by price", error);
    dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_FAILURE, payload: message });
    return { error: message };
  }
};

// Get Credit Packages Sorted by Credit Amount
export const getCreditPackagesSortedByCreditAmountDesc = () => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/credit-packages/sorted-by-credit`);
    const { data, message, success } = extractResponsePayload(response);
    const packages = ensureArray(data);
    dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_SUCCESS, payload: packages });
    return { payload: packages, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to sort credit packages", error);
    dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_FAILURE, payload: message });
    return { error: message };
  }
};

// Activate Credit Package
export const activateCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: ACTIVATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/admin/credit-packages/${id}/activate`);
    const { data, message, success } = extractResponsePayload(response);
    const updated = normalizePackage(data);
    dispatch({ type: ACTIVATE_CREDIT_PACKAGE_SUCCESS, payload: updated });
    return { payload: updated, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to activate credit package", error);
    dispatch({ type: ACTIVATE_CREDIT_PACKAGE_FAILURE, payload: message });
    return { error: message };
  }
};

// Deactivate Credit Package
export const deactivateCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/admin/credit-packages/${id}/deactivate`);
    const { data, message, success } = extractResponsePayload(response);
    const updated = normalizePackage(data);
    dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_SUCCESS, payload: updated });
    return { payload: updated, message, success };
  } catch (error) {
    const message = extractErrorMessage(error);
    logger.error("Failed to deactivate credit package", error);
    dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_FAILURE, payload: message });
    return { error: message };
  }
};
