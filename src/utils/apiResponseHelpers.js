/**
 * Utility functions for handling API responses
 * Supports both ApiResponseWithData<T> format and raw data responses
 */

/**
 * Extracts payload from API response
 * Handles both wrapped (ApiResponseWithData<T>) and unwrapped responses
 *
 * @param {Object} response - Axios response object
 * @returns {Object} { data, message, success }
 */
export const extractResponsePayload = (response) => {
  const payload = response?.data;

  // Handle ApiResponseWithData<T> format: { message: string, success: boolean, data: T }
  if (payload && typeof payload === "object" && "success" in payload) {
    return {
      data: payload.data !== undefined ? payload.data : payload,
      message: typeof payload.message === "string" ? payload.message : null,
      success: Boolean(payload.success),
    };
  }

  // Handle raw data responses (non-wrapped) - treat as successful
  return { data: payload, message: null, success: true };
};

/**
 * Extracts error message from error object
 * Handles various error formats from backend
 *
 * @param {Error} error - Error object from axios or throw statement
 * @returns {string} Error message
 */
export const extractErrorMessage = (error) => {
  if (!error) {
    return "Something went wrong.";
  }

  // Check if response data is a string
  const responseData = error.response?.data;
  if (typeof responseData === "string" && responseData.length) {
    return responseData;
  }

  // Check for message in response data (ApiResponseWithData format)
  const responseMessage = responseData?.message;
  if (typeof responseMessage === "string" && responseMessage.length) {
    return responseMessage;
  }

  // Check for nested message
  const nestedMessage = responseData?.message;
  if (typeof nestedMessage === "string" && nestedMessage.length) {
    return nestedMessage;
  }

  // Fallback to error.message
  if (typeof error.message === "string" && error.message.length) {
    return error.message;
  }

  return "Something went wrong.";
};

/**
 * Handles API response and throws error if not successful
 * Use this for actions that modify data (POST, PUT, DELETE)
 *
 * @param {Object} response - Axios response object
 * @param {string} defaultErrorMessage - Default error message if none provided
 * @returns {Object} { data, message, success }
 * @throws {Error} If response indicates failure
 */
export const handleApiResponse = (response, defaultErrorMessage = "Operation failed.") => {
  const { data, success, message } = extractResponsePayload(response);

  if (!success) {
    throw new Error(message || defaultErrorMessage);
  }

  return { data, message, success };
};

/**
 * Handles paginated API responses (Spring Page format)
 * Extracts content array and pagination metadata
 *
 * @param {Object} response - Axios response object
 * @returns {Object} { content, page, size, totalElements, totalPages, last, first }
 */
export const extractPaginatedResponse = (response) => {
  const { data } = extractResponsePayload(response);

  // Handle Spring Page format
  if (data && typeof data === "object" && "content" in data) {
    return {
      content: Array.isArray(data.content) ? data.content : [],
      page: data.pageable?.pageNumber ?? 0,
      size: data.pageable?.pageSize ?? 10,
      totalElements: data.totalElements ?? 0,
      totalPages: data.totalPages ?? 0,
      last: data.last ?? true,
      first: data.first ?? true,
    };
  }

  // Handle array responses (non-paginated)
  if (Array.isArray(data)) {
    return {
      content: data,
      page: 0,
      size: data.length,
      totalElements: data.length,
      totalPages: 1,
      last: true,
      first: true,
    };
  }

  // Fallback
  return {
    content: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    last: true,
    first: true,
  };
};
