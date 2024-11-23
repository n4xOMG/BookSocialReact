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

const initialState = {
  creditPackages: [],
  activeCreditPackages: [],
  creditPackage: null,
  loading: false,
  error: null,
};

const creditPackageReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_CREDIT_PACKAGES_REQUEST:
    case GET_ACTIVE_CREDIT_PACKAGES_REQUEST:
    case GET_CREDIT_PACKAGE_BY_ID_REQUEST:
    case CREATE_CREDIT_PACKAGE_REQUEST:
    case UPDATE_CREDIT_PACKAGE_REQUEST:
    case DELETE_CREDIT_PACKAGE_REQUEST:
    case SEARCH_CREDIT_PACKAGES_BY_NAME_REQUEST:
    case GET_CREDIT_PACKAGES_BY_PRICE_REQUEST:
    case GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_REQUEST:
    case ACTIVATE_CREDIT_PACKAGE_REQUEST:
    case DEACTIVATE_CREDIT_PACKAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case GET_ALL_CREDIT_PACKAGES_SUCCESS:
      return {
        ...state,
        creditPackages: action.payload,
        loading: false,
      };
    case GET_ACTIVE_CREDIT_PACKAGES_SUCCESS:
      return {
        ...state,
        activeCreditPackages: action.payload,
        loading: false,
      };
    case GET_CREDIT_PACKAGE_BY_ID_SUCCESS:
      return {
        ...state,
        creditPackage: action.payload,
        loading: false,
      };
    case CREATE_CREDIT_PACKAGE_SUCCESS:
      return {
        ...state,
        creditPackages: [...state.creditPackages, action.payload],
        loading: false,
      };
    case UPDATE_CREDIT_PACKAGE_SUCCESS:
      return {
        ...state,
        creditPackages: state.creditPackages.map((pkg) => (pkg.id === action.payload.id ? action.payload : pkg)),
        loading: false,
      };
    case DELETE_CREDIT_PACKAGE_SUCCESS:
      return {
        ...state,
        creditPackages: state.creditPackages.filter((pkg) => pkg.id !== action.payload),
        loading: false,
      };
    case SEARCH_CREDIT_PACKAGES_BY_NAME_SUCCESS:
    case GET_CREDIT_PACKAGES_BY_PRICE_SUCCESS:
    case GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_SUCCESS:
      return {
        ...state,
        creditPackages: action.payload,
        loading: false,
      };
    case ACTIVATE_CREDIT_PACKAGE_SUCCESS:
    case DEACTIVATE_CREDIT_PACKAGE_SUCCESS:
      return {
        ...state,
        creditPackages: state.creditPackages.map((pkg) => (pkg.id === action.payload.id ? action.payload : pkg)),
        loading: false,
      };
    case GET_ALL_CREDIT_PACKAGES_FAILURE:
    case GET_ACTIVE_CREDIT_PACKAGES_FAILURE:
    case GET_CREDIT_PACKAGE_BY_ID_FAILURE:
    case CREATE_CREDIT_PACKAGE_FAILURE:
    case UPDATE_CREDIT_PACKAGE_FAILURE:
    case DELETE_CREDIT_PACKAGE_FAILURE:
    case SEARCH_CREDIT_PACKAGES_BY_NAME_FAILURE:
    case GET_CREDIT_PACKAGES_BY_PRICE_FAILURE:
    case GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_FAILURE:
    case ACTIVATE_CREDIT_PACKAGE_FAILURE:
    case DEACTIVATE_CREDIT_PACKAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default creditPackageReducer;
