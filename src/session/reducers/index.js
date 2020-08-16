import sessionReducer from "./sessionReducer";
import openSnackbarReducer from "./openSnackbarReducer";

export const mainReducer = ({session, openSnackBar}, action) => {
  return {
    session: sessionReducer(session, action),
    openSnackbar: openSnackbarReducer(openSnackBar, action),
  }
}
