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

const ensureArray = (value) => {
  if (Array.isArray(value)) {
    return value;
  }
  if (Array.isArray(value?.content)) {
    return value.content;
  }
  return [];
};

const ensurePackage = (pkg) => {
  if (pkg && typeof pkg === "object") {
    return pkg;
  }
  return null;
};

const upsertPackage = (packages = [], pkg) => {
  if (!pkg || !pkg.id) {
    return ensureArray(packages);
  }
  const list = ensureArray(packages);
  const index = list.findIndex((item) => item?.id === pkg.id);
  if (index === -1) {
    return [...list, pkg];
  }
  return list.map((item, idx) => (idx === index ? { ...item, ...pkg } : item));
};

const removePackageById = (packages = [], id) => {
  if (!id) {
    return ensureArray(packages);
  }
  return ensureArray(packages).filter((item) => item?.id !== id);
};

const syncActivePackages = (activePackages, pkg) => {
  if (!pkg || !pkg.id) {
    return ensureArray(activePackages);
  }
  if (pkg.active) {
    return upsertPackage(activePackages, pkg);
  }
  return removePackageById(activePackages, pkg.id);
};

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
        loading: false,
        error: null,
        creditPackages: ensureArray(action.payload),
      };
    case GET_ACTIVE_CREDIT_PACKAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        activeCreditPackages: ensureArray(action.payload),
      };
    case GET_CREDIT_PACKAGE_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        creditPackage: ensurePackage(action.payload),
      };
    case CREATE_CREDIT_PACKAGE_SUCCESS: {
      const created = ensurePackage(action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        creditPackages: created ? upsertPackage(state.creditPackages, created) : ensureArray(state.creditPackages),
        activeCreditPackages: created ? syncActivePackages(state.activeCreditPackages, created) : ensureArray(state.activeCreditPackages),
        creditPackage:
          created && state.creditPackage && state.creditPackage.id === created.id
            ? { ...state.creditPackage, ...created }
            : state.creditPackage,
      };
    }
    case UPDATE_CREDIT_PACKAGE_SUCCESS:
    case ACTIVATE_CREDIT_PACKAGE_SUCCESS:
    case DEACTIVATE_CREDIT_PACKAGE_SUCCESS: {
      const updated = ensurePackage(action.payload);
      return {
        ...state,
        loading: false,
        error: null,
        creditPackages: updated ? upsertPackage(state.creditPackages, updated) : ensureArray(state.creditPackages),
        activeCreditPackages: updated ? syncActivePackages(state.activeCreditPackages, updated) : ensureArray(state.activeCreditPackages),
        creditPackage:
          updated && state.creditPackage && state.creditPackage.id === updated.id
            ? { ...state.creditPackage, ...updated }
            : state.creditPackage,
      };
    }
    case DELETE_CREDIT_PACKAGE_SUCCESS: {
      const deletedId = typeof action.payload === "object" ? action.payload?.id : action.payload;
      const normalizedId = typeof deletedId === "number" || typeof deletedId === "string" ? deletedId : null;
      return {
        ...state,
        loading: false,
        error: null,
        creditPackages: removePackageById(state.creditPackages, normalizedId),
        activeCreditPackages: removePackageById(state.activeCreditPackages, normalizedId),
        creditPackage: state.creditPackage && normalizedId && state.creditPackage.id === normalizedId ? null : state.creditPackage,
      };
    }
    case SEARCH_CREDIT_PACKAGES_BY_NAME_SUCCESS:
    case GET_CREDIT_PACKAGES_BY_PRICE_SUCCESS:
    case GET_CREDIT_PACKAGES_SORTED_BY_CREDIT_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        creditPackages: ensureArray(action.payload),
      };
    case GET_ALL_CREDIT_PACKAGES_FAILURE:
    case GET_ACTIVE_CREDIT_PACKAGES_FAILURE:
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
        error: action.payload || "Failed to process credit package request.",
      };
    case GET_CREDIT_PACKAGE_BY_ID_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || "Failed to load credit package.",
        creditPackage: null,
      };
    default:
      return state;
  }
};

export default creditPackageReducer;
