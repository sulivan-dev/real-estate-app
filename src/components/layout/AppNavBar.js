import React, { Component } from 'react';
import { AppBar } from "@material-ui/core";
import SessionBar from "./bar/SessionBar";

class AppNavBar extends Component {
  render() {
    return (
      <div>
        <AppBar position="static">
          <SessionBar/>
        </AppBar>
      </div>
    );
  }
}

export default AppNavBar;
