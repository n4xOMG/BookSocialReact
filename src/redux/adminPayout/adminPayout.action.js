import { api, API_BASE_URL } from "../../api/api";
import {
  ADMIN_GET_PAYOUTS_REQUEST,
  ADMIN_GET_PAYOUTS_SUCCESS,
  ADMIN_GET_PAYOUTS_FAILURE,
  ADMIN_PROCESS_PAYOUT_REQUEST,
  ADMIN_PROCESS_PAYOUT_SUCCESS,
  ADMIN_PROCESS_PAYOUT_FAILURE,
} from "./adminPayout.actionType";

export const adminListPayouts =
  ({ status, page = 0, size = 20, sort = "requestedDate,desc" } = {}) =>
  async (dispatch) => {
    dispatch({ type: ADMIN_GET_PAYOUTS_REQUEST });
    try {
      const params = { page, size, sort };
      if (status) params.status = status;
      const { data } = await api.get(`${API_BASE_URL}/admin/payouts`, { params });
      dispatch({ type: ADMIN_GET_PAYOUTS_SUCCESS, payload: data });
      return { payload: data };
    } catch (error) {
      dispatch({ type: ADMIN_GET_PAYOUTS_FAILURE, payload: error.response?.data || error.message });
    }
  };

export const adminProcessPayout = (payoutId) => async (dispatch) => {
  dispatch({ type: ADMIN_PROCESS_PAYOUT_REQUEST, meta: { payoutId } });
  try {
    const { data } = await api.post(`${API_BASE_URL}/admin/payouts/${payoutId}/process`);
    dispatch({ type: ADMIN_PROCESS_PAYOUT_SUCCESS, payload: data });
    // refresh list after processing to reflect new status
    dispatch(adminListPayouts());
    return { payload: data };
  } catch (error) {
    dispatch({ type: ADMIN_PROCESS_PAYOUT_FAILURE, payload: error.response?.data || error.message, meta: { payoutId } });
  }
};
