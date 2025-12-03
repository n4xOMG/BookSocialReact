import {
  FETCH_PURCHASE_HISTORY_FAILURE,
  FETCH_PURCHASE_HISTORY_REQUEST,
  FETCH_PURCHASE_HISTORY_SUCCESS,
  FETCH_SALES_PER_USER_FAILURE,
  FETCH_SALES_PER_USER_REQUEST,
  FETCH_SALES_PER_USER_SUCCESS,
  FETCH_TOTAL_PURCHASES_FAILURE,
  FETCH_TOTAL_PURCHASES_REQUEST,
  FETCH_TOTAL_PURCHASES_SUCCESS,
  FETCH_TOTAL_SALES_FAILURE,
  FETCH_TOTAL_SALES_REQUEST,
  FETCH_TOTAL_SALES_SUCCESS,
} from "./purchase.actionType";

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

const ensureNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const initialState = {
  loading: false,
  error: null,
  purchases: [],
  metricsLoading: false,
  metricsError: null,
  totalSales: null,
  totalPurchases: null,
  salesPerUser: [],
};

const purchaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PURCHASE_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case FETCH_PURCHASE_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        purchases: ensureArray(action.payload),
        error: null,
      };
    case FETCH_PURCHASE_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        purchases: [],
        error: action.payload || "Failed to load purchase history.",
      };

    case FETCH_TOTAL_SALES_REQUEST:
    case FETCH_TOTAL_PURCHASES_REQUEST:
    case FETCH_SALES_PER_USER_REQUEST:
      return {
        ...state,
        metricsLoading: true,
        metricsError: null,
      };
    case FETCH_TOTAL_SALES_SUCCESS:
      return {
        ...state,
        metricsLoading: false,
        totalSales: ensureNumber(action.payload),
        metricsError: null,
      };
    case FETCH_TOTAL_SALES_FAILURE:
      return {
        ...state,
        metricsLoading: false,
        totalSales: null,
        metricsError: action.payload || "Failed to load total sales.",
      };
    case FETCH_TOTAL_PURCHASES_SUCCESS:
      return {
        ...state,
        metricsLoading: false,
        totalPurchases: ensureNumber(action.payload),
        metricsError: null,
      };
    case FETCH_TOTAL_PURCHASES_FAILURE:
      return {
        ...state,
        metricsLoading: false,
        totalPurchases: null,
        metricsError: action.payload || "Failed to load total purchases.",
      };
    case FETCH_SALES_PER_USER_SUCCESS:
      return {
        ...state,
        metricsLoading: false,
        salesPerUser: ensureArray(action.payload),
        metricsError: null,
      };
    case FETCH_SALES_PER_USER_FAILURE:
      return {
        ...state,
        metricsLoading: false,
        salesPerUser: [],
        metricsError: action.payload || "Failed to load sales per user.",
      };

    default:
      return state;
  }
};

export default purchaseReducer;
