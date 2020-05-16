import React, {Component, useEffect} from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { FirebaseContext } from "./firebase";
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { Grid } from '@material-ui/core';
import theme from './theme/theme';
import './App.css';

import AppNavBar from "./components/layout/AppNavBar";
import RealEstateList from "./components/views/RealEstateList";
import UserRegistry from "./components/security/UserRegistry";
import Login from "./components/security/Login";

function App(props) {

  let firebase = React.useContext(FirebaseContext);
  const [initializeAuth, setupInitializeFirebase] = React.useState(false);

  useEffect(() => {
    firebase.isStarted()
      .then(response => {
        setupInitializeFirebase(true);
      })
  })


  return initializeAuth !== false ? (
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
  )
    : null;
}

export default App;
