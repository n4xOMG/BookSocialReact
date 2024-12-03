import { api, API_BASE_URL } from "../../api/api";
import {
  CREATE_REPORT_FAILED,
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  DELETE_REPORT_FAILED,
  DELETE_REPORT_REQUEST,
  DELETE_REPORT_SUCCESS,
  GET_ALL_REPORTS_FAILED,
  GET_ALL_REPORTS_REQUEST,
  GET_ALL_REPORTS_SUCCESS,
  RESOLVE_REPORT_FAILED,
  RESOLVE_REPORT_REQUEST,
  RESOLVE_REPORT_SUCCESS,
} from "./report.actionType";

// Create a new report
export const createReportAction = (reportData) => async (dispatch) => {
  dispatch({ type: CREATE_REPORT_REQUEST });
  try {
    const { data } = await api.post(`${API_BASE_URL}/api/reports`, reportData);
    dispatch({ type: CREATE_REPORT_SUCCESS, payload: data });
    return { payload: data };
  } catch (error) {
    dispatch({ type: CREATE_REPORT_FAILED, payload: error.response?.data || error.message });
    return { error: error.response?.data || error.message };
  }
};

// Get all reports (Admin Only)
export const getAllReportsAction = () => async (dispatch) => {
  dispatch({ type: GET_ALL_REPORTS_REQUEST });
  try {
    const { data } = await api.get(`${API_BASE_URL}/api/reports`);
    dispatch({ type: GET_ALL_REPORTS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: GET_ALL_REPORTS_FAILED, payload: error.response?.data || error.message });
  }
};

// Resolve a report (Admin Only)
export const resolveReportAction = (reportId) => async (dispatch) => {
  dispatch({ type: RESOLVE_REPORT_REQUEST });
  try {
    await api.put(`${API_BASE_URL}/api/reports/${reportId}/resolve`, {});
    dispatch({ type: RESOLVE_REPORT_SUCCESS, payload: reportId });
  } catch (error) {
    dispatch({ type: RESOLVE_REPORT_FAILED, payload: error.response?.data || error.message });
  }
};

// Delete a report (Admin Only)
export const deleteReportAction = (reportId) => async (dispatch) => {
  dispatch({ type: DELETE_REPORT_REQUEST });
  try {
    await api.delete(`${API_BASE_URL}/api/reports/${reportId}`);
    dispatch({ type: DELETE_REPORT_SUCCESS, payload: reportId });
  } catch (error) {
    dispatch({ type: DELETE_REPORT_FAILED, payload: error.response?.data || error.message });
  }
};
