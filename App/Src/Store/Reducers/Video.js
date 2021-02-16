const initialState = {
  Stream: null,
  streams: [],
};
export default (state = initialState, actions) => {
  switch (actions.type) {
    case 'MY_STREAM':
      return {
        ...state,
        ...actions.payload,
      };
    case 'ADD_STREAM':
      return {
        ...state,
        streams: [...initialState.streams, actions.payload.streams],
      };
    default:
      return state;
  }
};
