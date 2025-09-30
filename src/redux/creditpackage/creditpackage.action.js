import axios from "axios";
import { api, API_BASE_URL } from "../../api/api";
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

// Get All Credit Packages
export const getAllCreditPackages = () => async (dispatch) => {
  dispatch({ type: GET_ALL_CREDIT_PACKAGES_REQUEST });
  try {
    const response = await api.get(`${API_BASE_URL}/admin/credit-packages`);
    dispatch({ type: GET_ALL_CREDIT_PACKAGES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ALL_CREDIT_PACKAGES_FAILURE, payload: error.message });
  }
};

// Get Active Credit Packages
export const getActiveCreditPackages = () => async (dispatch) => {
  dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-packages/active`);
    dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_ACTIVE_CREDIT_PACKAGES_FAILURE, payload: error.message });
  }
};

// Get Credit Package by ID
export const getCreditPackageById = (id) => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-packages/${id}`);
    dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_CREDIT_PACKAGE_BY_ID_FAILURE, payload: error.message });
  }
};

// Create Credit Package
export const createCreditPackage = (creditPackage) => async (dispatch) => {
  dispatch({ type: CREATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.post(`${API_BASE_URL}/api/credit-packages`, creditPackage);
    dispatch({ type: CREATE_CREDIT_PACKAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: CREATE_CREDIT_PACKAGE_FAILURE, payload: error.message });
  }
};

// Update Credit Package
export const updateCreditPackage = (id, creditPackage) => async (dispatch) => {
  dispatch({ type: UPDATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/credit-packages/${id}`, creditPackage);
    dispatch({ type: UPDATE_CREDIT_PACKAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: UPDATE_CREDIT_PACKAGE_FAILURE, payload: error.message });
  }
};

// Delete Credit Package
export const deleteCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: DELETE_CREDIT_PACKAGE_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/api/credit-packages/${id}`);
    dispatch({ type: DELETE_CREDIT_PACKAGE_SUCCESS, payload: id });
  } catch (error) {
    dispatch({ type: DELETE_CREDIT_PACKAGE_FAILURE, payload: error.message });
  }
};

// Search Credit Packages by Name
export const searchCreditPackagesByName = (name) => async (dispatch) => {
  dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-packages/search?name=${name}`);
    dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: SEARCH_CREDIT_PACKAGES_BY_NAME_FAILURE, payload: error.message });
  }
};

// Get Credit Packages by Price
export const getCreditPackagesByPrice = (maxPrice) => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-packages/price?maxPrice=${maxPrice}`);
    dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_CREDIT_PACKAGES_BY_PRICE_FAILURE, payload: error.message });
  }
};

// Get Credit Packages Sorted by Credit Amount
export const getCreditPackagesSortedByCreditAmountDesc = () => async (dispatch) => {
  dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_REQUEST });
  try {
    const response = await axios.get(`${API_BASE_URL}/credit-packages/sorted-by-credit`);
    dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_FAILURE, payload: error.message });
  }
};

// Activate Credit Package
export const activateCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: ACTIVATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/credit-packages/${id}/activate`);
    dispatch({ type: ACTIVATE_CREDIT_PACKAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: ACTIVATE_CREDIT_PACKAGE_FAILURE, payload: error.message });
  }
};

// Deactivate Credit Package
export const deactivateCreditPackage = (id) => async (dispatch) => {
  dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_REQUEST });
  try {
    const response = await api.put(`${API_BASE_URL}/api/credit-packages/${id}/deactivate`);
    dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: DEACTIVATE_CREDIT_PACKAGE_FAILURE, payload: error.message });
  }
};
