import {
  ADMIN_GET_PAYOUTS_REQUEST,
  ADMIN_GET_PAYOUTS_SUCCESS,
  ADMIN_GET_PAYOUTS_FAILURE,
  ADMIN_PROCESS_PAYOUT_REQUEST,
  ADMIN_PROCESS_PAYOUT_SUCCESS,
  ADMIN_PROCESS_PAYOUT_FAILURE,
} from "./adminPayout.actionType";

const initialState = {
  payoutsPage: null, // Spring Page<AuthorPayoutDTO>
  loading: false,
  error: null,
  processingMap: {}, // { [payoutId]: boolean }
};

const adminPayoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADMIN_GET_PAYOUTS_REQUEST:
      return { ...state, loading: true, error: null };
    case ADMIN_GET_PAYOUTS_SUCCESS:
      return {
        ...state,
        loading: false,
        payoutsPage: action.payload && typeof action.payload === "object" ? action.payload : null,
      };
    case ADMIN_GET_PAYOUTS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADMIN_PROCESS_PAYOUT_REQUEST:
      return { ...state, processingMap: { ...state.processingMap, [action.meta.payoutId]: true } };
    case ADMIN_PROCESS_PAYOUT_SUCCESS:
      return { ...state, processingMap: {} };
    case ADMIN_PROCESS_PAYOUT_FAILURE:
      return { ...state, error: action.payload, processingMap: { ...state.processingMap, [action.meta.payoutId]: false } };
    default:
      return state;
  }
};

export default adminPayoutReducer;
