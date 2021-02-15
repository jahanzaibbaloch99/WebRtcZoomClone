const initialState = {
  Connection: '',
};
export default (state = initialState, actions) => {
  switch (actions.type) {
    case 'CONNECTIONS':
      return {
        ...state,
        ...actions.payload,
      };

    default:
      return state;
  }
};
