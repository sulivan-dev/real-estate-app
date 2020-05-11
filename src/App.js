import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import { Grid } from '@material-ui/core';
import theme from './theme/theme';
import './App.css';

import AppNavBar from "./components/layout/AppNavBar";
import RealEstateList from "./components/views/RealEstateList";
import UserRegistry from "./components/security/UserRegistry";

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider theme={ theme }>
          <AppNavBar/>
          <Grid container>
            <Switch>
              <Route path="/" exact component={ RealEstateList } />
              <Route path="/auth/user-registry" exact component={ UserRegistry }/>
            </Switch>
          </Grid>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
