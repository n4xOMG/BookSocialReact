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

const initialState = {
  loading: false,
  purchases: [],
  error: "",
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
      };
    case FETCH_PURCHASE_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        purchases: action.payload,
        error: "",
      };
    case FETCH_PURCHASE_HISTORY_FAILURE:
      return {
        ...state,
        loading: false,
        purchases: [],
        error: action.payload,
      };

    // New Admin: Fetch Total Sales
    case FETCH_TOTAL_SALES_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_TOTAL_SALES_SUCCESS:
      return {
        ...state,
        loading: false,
        totalSales: action.payload,
        error: "",
      };
    case FETCH_TOTAL_SALES_FAILURE:
      return {
        ...state,
        loading: false,
        totalSales: null,
        error: action.payload,
      };

    // New Admin: Fetch Total Number of Purchases
    case FETCH_TOTAL_PURCHASES_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_TOTAL_PURCHASES_SUCCESS:
      return {
        ...state,
        loading: false,
        totalPurchases: action.payload,
        error: "",
      };
    case FETCH_TOTAL_PURCHASES_FAILURE:
      return {
        ...state,
        loading: false,
        totalPurchases: null,
        error: action.payload,
      };

    // New Admin: Fetch Sales Statistics Per User
    case FETCH_SALES_PER_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case FETCH_SALES_PER_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        salesPerUser: action.payload,
        error: "",
      };
    case FETCH_SALES_PER_USER_FAILURE:
      return {
        ...state,
        loading: false,
        salesPerUser: [],
        error: action.payload,
      };

    default:
      return state;
  }
};

export default purchaseReducer;
