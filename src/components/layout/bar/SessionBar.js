import React, {Component} from 'react';
import {withRouter, Link} from 'react-router-dom';
import {compose} from 'recompose';
import {Avatar, Toolbar, Typography, Button, IconButton, Drawer} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import {FirebaseConsumer} from "../../../firebase";
import {exitSession} from "../../../session/actions/sessionActions";
import {StateContext} from "../../../session/store";
import {RightMenu} from "./RightMenu";
import {LeftMenu} from "./LeftMenu";
import Logo from '../../../logo.svg';
import {openScreenMessage} from "../../../session/actions/snackBarActions";

const styles = theme => ({
  desktopSection: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    }
  },
  mobileSection: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    }
  },
  grow: {
    flexGrow: 1,
  },
  avatarSize: {
    width: 40,
    height: 40,
  },
  listItemText: {
    fontSize: '14px',
    fontWeight: 600,
    paddingLeft: '15px',
    color: '#212121',
  },
  list: {
    width: 250,
  },
});

class SessionBar extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    right: false,
    left: false,
  }

  exitSessionMethod = () => {
    const {firebase} = this.state;
    const [, dispatch] = this.context;

    exitSession(dispatch, firebase)
        .then(response => {
          this.props.history.push('/auth/login');
        })
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    })
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    let newObject = {};

    if (nextProps.firebase !== prevProps.firebase) {
      newObject.firebase = nextProps.firebase;
    }

    return newObject;
  }

  render() {
    const {classes} = this.props;
    const [{session}, dispatch] = this.context;
    const { firebase } = this.state;
    const {user} = session ? session : null;

    if (!user) {
      exitSession(dispatch, firebase)
          .then(response => {
            this.props.history.push('/');
          })
          .catch(error => {
            openScreenMessage(dispatch, {
              open: true,
              message: error.message
            })
          });
    }

    let userText = user ? (user.firstName + ' ' + user.lastName) : null;
    if (!user.firstName) {
      userText = user.phone;
    }

    return (
        <div>
          <Drawer open={this.state.left}
                  onClose={this.toggleDrawer('left', false)}
                  anchor="left"
          >
            <div role="button"
                 onClick={this.toggleDrawer('left', false)}
                 onKeyDown={this.toggleDrawer('left', false)}
            >
              <LeftMenu classes={styles}/>
            </div>
          </Drawer>

          <Drawer open={this.state.right}
                  onClose={this.toggleDrawer('right', false)}
                  anchor="right"
          >
            <div role="button"
                 onClick={this.toggleDrawer('right', false)}
                 onKeyDown={this.toggleDrawer('right', false)}
            >
              <RightMenu classes={styles}
                         user={user}
                         userText={userText}
                         userPhoto={user ? user.photo : Logo}
                         exitSession={this.exitSessionMethod}
              />
            </div>
          </Drawer>

          <Toolbar>
            <IconButton color="inherit"
                        onClick={this.toggleDrawer('left', true)}>
              <i className="material-icons">menu</i>
            </IconButton>

            <Typography variant="h6">
              Homes
            </Typography>

            <div className={classes.grow}>
            </div>

            <div className={classes.desktopSection}>
              <IconButton color="inherit" component={Link} to="#">
                <i className="material-icons">mail_outline</i>
              </IconButton>
              <Button color="inherit" onClick={this.exitSessionMethod}>Salir</Button>
              <Button color="inherit">{userText}</Button>
              <Avatar src={user ? user.photo : Logo}>

              </Avatar>
            </div>

            <div className={classes.mobileSection}>
              <IconButton color="inherit"
                          onClick={this.toggleDrawer('right', true)}>
                <i className="material-icons">more_vert</i>
              </IconButton>
            </div>
          </Toolbar>
        </div>
    );
  }
}

export default compose(withRouter, withStyles(styles), FirebaseConsumer)(SessionBar);
