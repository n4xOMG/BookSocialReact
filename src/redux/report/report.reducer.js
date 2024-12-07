// src/redux/report/report.reducer.js
import {
  CREATE_REPORT_REQUEST,
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_FAILED,
  GET_ALL_REPORTS_REQUEST,
  GET_ALL_REPORTS_SUCCESS,
  GET_ALL_REPORTS_FAILED,
  RESOLVE_REPORT_REQUEST,
  RESOLVE_REPORT_SUCCESS,
  RESOLVE_REPORT_FAILED,
  DELETE_REPORT_REQUEST,
  DELETE_REPORT_SUCCESS,
  DELETE_REPORT_FAILED,
  DELETE_REPORTED_OBJECT_SUCCESS,
} from "./report.actionType";

const initialState = {
  loading: false,
  error: null,
  reports: [],
  newReport: null,
};

export const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REPORT_REQUEST:
    case GET_ALL_REPORTS_REQUEST:
    case RESOLVE_REPORT_REQUEST:
    case DELETE_REPORT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case CREATE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        newReport: action.payload,
        reports: [...state.reports, action.payload],
        error: null,
      };

    case CREATE_REPORT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case GET_ALL_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: action.payload,
        error: null,
      };

    case GET_ALL_REPORTS_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case RESOLVE_REPORT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.map((report) => (report.id === action.payload ? { ...report, isResolved: true } : report)),
        error: null,
      };

    case RESOLVE_REPORT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case DELETE_REPORT_SUCCESS:
    case DELETE_REPORTED_OBJECT_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: state.reports.filter((report) => report.id !== action.payload),
        error: null,
      };

    case DELETE_REPORT_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
