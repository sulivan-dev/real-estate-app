import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {FirebaseContext} from "./firebase";
import {useStateValue} from "./session/store";
import {openScreenMessage} from "./session/actions/snackBarActions";
import {Grid, Snackbar} from '@material-ui/core';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './theme/theme';
import './App.css';

import AppNavBar from "./components/layout/AppNavBar";
import RealEstateList from "./components/views/RealEstatesList";
import CreateRealEstate from "./components/views/CreateRealEstate";
import EditRealEstate from "./components/views/EditRealEstate";
import UsersList from "./components/views/UsersList";
import UserRegistry from "./components/security/UserRegistry";
import UserProfile from "./components/security/UserProfile";
import Login from "./components/security/Login";
import LoginWithPhone from "./components/security/LoginWithPhone";
import AuthenticatedRoute from "./components/security/AuthenticatedRoute";

import store from "./redux/store";
import {Provider} from 'react-redux';

function App(props) {

  let firebase = React.useContext(FirebaseContext);
  const [initializeAuth, setupInitializeFirebase] = React.useState(false);
  const [{openSnackbar}, dispatch] = useStateValue();

  useEffect(() => {
    firebase.isStarted()
      .then(response => {
        setupInitializeFirebase(response);
      })

    if (firebase.messagingValidation.isSupported()) {
      firebase.messaging.onMessage((payload) => {
        openScreenMessage(dispatch, {
          open: true,
          message: payload.notification.title + ' ' + payload.notification.body,
        })
      })
    }
  })

  return initializeAuth !== false ? (
    <Provider store={store}>
      <React.Fragment>
        <Snackbar anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                  open={openSnackbar ? openSnackbar.open : false}
                  autoHideDuration={3000}
                  ContentProps={{
                    'aria-describedby': 'message-id'
                  }}
                  message={
                    <span id="message-id">
                    {openSnackbar ? openSnackbar.message : ''}
                  </span>
                  }
                  onClose={() => {
                    dispatch({
                      type: 'OPEN_SNACKBAR',
                      openMessage: {
                        open: false,
                        message: '',
                      }
                    })
                  }}
        >
        </Snackbar>
        <Router>
          <MuiThemeProvider theme={theme}>
            <AppNavBar/>
            <Grid container>
              <Switch>
                <AuthenticatedRoute exact
                                    path="/"
                                    authenticatedFirebase={firebase.auth.currentUser}
                                    component={RealEstateList}
                />
                <AuthenticatedRoute exact
                                    path="/auth/profile"
                                    authenticatedFirebase={firebase.auth.currentUser}
                                    component={UserProfile}
                />
                <AuthenticatedRoute exact
                                    path="/estate/create"
                                    authenticatedFirebase={firebase.auth.currentUser} N
                                    component={CreateRealEstate}
                />
                <AuthenticatedRoute exact
                                    path="/estate/edit/:id"
                                    authenticatedFirebase={firebase.auth.currentUser} N
                                    component={EditRealEstate}
                />
                <AuthenticatedRoute exact
                                    path="/users-list"
                                    authenticatedFirebase={firebase.auth.currentUser} N
                                    component={UsersList}
                />
                <Route exact path="/auth/login" component={Login}/>
                <Route exact path="/auth/user-registry" component={UserRegistry}/>
                <Route exact path="/auth/login-phone" component={LoginWithPhone}/>
              </Switch>
            </Grid>
          </MuiThemeProvider>
        </Router>
      </React.Fragment>
    </Provider>
    )
    : null;
}

export default App;
