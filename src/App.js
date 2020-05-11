import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './theme/theme';

import RealEstateList from "./components/views/RealEstateList";

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={ theme }>
        <RealEstateList/>
      </MuiThemeProvider>
    );
  }
}

export default App;
