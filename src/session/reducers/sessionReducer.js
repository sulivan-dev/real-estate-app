const sessionReducer = (state, action) => {
  switch (action.type) {
    case 'INITIAL_SESSION':
      return {
        ...state,
        user: action.session,
        is_authenticate: action.is_authenticate,
      }
    case 'CHANGE_SESSION':
      return {
        ...state,
        user: action.newUser,
        is_authenticate: action.is_authenticate,
      }
    case 'EXIT_SESSION':
      return {
        ...state,
        user: action.newUser,
        is_authenticate: action.is_authenticate,
      }
    default:
        return state;
  }
}

export default sessionReducer;
