const initialState = {
  users: [],
  message: {}
}

export default function (state = initialState, action) {
  switch (action.type) {
    case "USERS_LIST":
      return {
        ...state,
        users: action.payload,
      }
    case "UPDATE_ROLES":
      return {
        ...state,
        message: action.payload,
      }
    default:
      return state;
  }
}
