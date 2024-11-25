const initialState = {
  stompClient: null,
};

export const websocketReducer = (state = initialState, action) => {
  switch (action.type) {
    case "WEBSOCKET_CONNECTED":
      return { ...state, stompClient: action.payload };

    case "WEBSOCKET_DISCONNECTED":
      return { ...state, stompClient: null };

    default:
      return state;
  }
};
