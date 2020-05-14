import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { Grid } from '@material-ui/core';
import theme from './theme/theme';
import './App.css';

import AppNavBar from "./components/layout/AppNavBar";
import RealEstateList from "./components/views/RealEstateList";
import UserRegistry from "./components/security/UserRegistry";
import Login from "./components/security/Login";

function App(props) {
  return (
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
}

export default App;
