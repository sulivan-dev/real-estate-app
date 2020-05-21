import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { FirebaseContext } from "./firebase";
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { Grid, Snackbar } from '@material-ui/core';
import theme from './theme/theme';
import './App.css';

import AppNavBar from "./components/layout/AppNavBar";
import RealEstateList from "./components/views/RealEstateList";
import UserRegistry from "./components/security/UserRegistry";
import Login from "./components/security/Login";

import { useStateValue } from "./session/store";

function App(props) {

  let firebase = React.useContext(FirebaseContext);
  const [initializeAuth, setupInitializeFirebase] = React.useState(false);
  const [{ openSnackbar }, dispatch] = useStateValue();

  useEffect(() => {
    firebase.isStarted()
      .then(response => {
        setupInitializeFirebase(response);
      })
  })


  return initializeAuth !== false ? (
    <React.Fragment>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={ openSnackbar ? openSnackbar.open : false }
                autoHideDuration={ 3000 }
                ContentProps={{
                  'aria-describedby': 'message-id'
                }}
                message={
                  <span id="message-id">
                    { openSnackbar ? openSnackbar.message : '' }
                  </span>
                }
                onClose={ () => {
                  dispatch({
                    type: 'OPEN_SNACKBAR',
                    openMessage: {
                      open: false,
                      message: '',
                    }
                  })
                } }
      >
      </Snackbar>
      <Router>
        <MuiThemeProvider theme={ theme }>
          <AppNavBar/>
          <Grid container>
            <Switch>
              <Route exact path="/"  component={ RealEstateList } />
              <Route exact path="/auth/user-registry" component={ UserRegistry }/>
              <Route exact path="/auth/login" component={ Login } />
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    </React.Fragment>

  )
    : null;
}

export default App;
