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

const initialState = {
  dashboard: null,
  earningsPage: null, // Spring Page response for earnings
  payoutsPage: null, // Spring Page response for payouts
  payoutSettings: null,
  bookPerformance: null, // Array of BookPerformanceDTO
  loading: false,
  error: null,
  requestingPayout: false,
};

const ensureObject = (value) => {
  if (value && typeof value === "object") {
    return value;
  }
  return null;
};

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  return [];
};

export const authorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AUTHOR_DASHBOARD_REQUEST:
    case GET_AUTHOR_EARNINGS_REQUEST:
    case GET_AUTHOR_PAYOUTS_REQUEST:
    case GET_PAYOUT_SETTINGS_REQUEST:
    case GET_BOOK_PERFORMANCE_REQUEST:
      return { ...state, loading: true, error: null };
    case REQUEST_PAYOUT_REQUEST:
      return { ...state, requestingPayout: true, error: null };

    case GET_AUTHOR_DASHBOARD_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: ensureObject(action.payload),
        error: null,
      };
    case GET_AUTHOR_EARNINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        earningsPage: ensureObject(action.payload),
        error: null,
      };
    case GET_AUTHOR_PAYOUTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payoutsPage: ensureObject(action.payload),
        error: null,
      };
    case GET_PAYOUT_SETTINGS_SUCCESS:
      return {
        ...state,
        loading: false,
        payoutSettings: ensureObject(action.payload),
        error: null,
      };
    case GET_BOOK_PERFORMANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        bookPerformance: ensureArray(action.payload),
        error: null,
      };
    case REQUEST_PAYOUT_SUCCESS:
      return { ...state, requestingPayout: false, error: null };

    case GET_AUTHOR_DASHBOARD_FAILURE:
    case GET_AUTHOR_EARNINGS_FAILURE:
    case GET_AUTHOR_PAYOUTS_FAILURE:
    case GET_PAYOUT_SETTINGS_FAILURE:
    case GET_BOOK_PERFORMANCE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "Unable to load author information.",
      };
    case REQUEST_PAYOUT_FAILURE:
      return {
        ...state,
        requestingPayout: false,
        error: action.payload || "Unable to submit payout request.",
      };
    default:
      return state;
  }
};

export default authorReducer;
