import React, {Component} from 'react';
import {compose} from 'recompose';
import {FirebaseConsumer} from "../../firebase";
import {StateContext} from "../../session/store";
import {AppBar} from "@material-ui/core";
import {withStyles} from "@material-ui/styles";
import SessionBar from "./bar/SessionBar";


const styles = theme => ({
  desktopSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  mobileSection: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
})

class AppNavBar extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
  }

  componentDidMount() {
    const {firebase} = this.state;
    const [{session}, dispatch] = this.context;

    if (firebase.auth.currentUser !== null && !session) {
      firebase.db
        .collection('users')
        .doc(firebase.auth.currentUser.uid)
        .get()
        .then(doc => {
          const userDB = doc.data();

          dispatch({
            type: 'INITIAL_SESSION',
            session: userDB,
            is_authenticate: true,
          })
        })
    }
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    let newObject = {};

    if (nextProps.firebase !== prevProps.firebase) {
      newObject.firebase = nextProps.firebase
    }

    return newObject;
  }

  render() {
    const [{session}] = this.context;

    return session ? (session.is_authenticate ? (
        <div>
          <AppBar position="static">
            <SessionBar/>
          </AppBar>
        </div>
      )
      : null)
      : null;
  }
}

export default compose(withStyles(styles), FirebaseConsumer)(AppNavBar);
