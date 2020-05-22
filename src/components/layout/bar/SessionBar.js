import React, {Component} from 'react';
// import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { Toolbar, Typography, Button, IconButton, Drawer } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { FirebaseConsumer } from "../../../firebase";
import { exitSession } from "../../../session/actions/sessionActions";
import { StateContext } from "../../../session/store";
import { RightMenu } from "./RightMenu";
import Logo from '../../../logo.svg';

const styles = theme => ({
  desktopSection: {
    display: 'none',
    [ theme.breakpoints.up('md')]: {
      display: 'flex',
    }
  },
  mobileSection: {
    display: 'flex',
    [ theme.breakpoints.up('md')]: {
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
  }
});

class SessionBar extends Component {
  static typeContext = StateContext;

  state = {
    firebase: null,
    right: false
  }

  exitSessionMethod = () => {
    const { firebase } = this.state;
    const[, dispatch] = this.context;

    exitSession(dispatch, firebase)
      .then(response => {
        this.props.history.push('/auth/login');
      })
  }

  toggleDrawer = (side, open) => {
    this.setState({
      [side] : open,
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
    const { classes } = this.props;
    const [{ session }] = this.context;
    const userText = session.firstName + ' ' + session.lastName;

    return (
      <div>
        <Drawer open={ this.state.right }
                onClose={ this.toggleDrawer('right', false) }
                anchor="right"
        >
          <div role="button"
               onClick={ this.toggleDrawer('right', false) }
               onKeyDown={ this.toggleDrawer('right', false) }
          >
            <RightMenu classes={ styles }
                       user={ session }
                       userText={ userText }
                       userPhoto={ Logo }
                       exitSession={ this.exitSessionMethod }
            />
          </div>
        </Drawer>
        <Toolbar>
          <IconButton color="inherit">
            <i className="material-icons">menu</i>
          </IconButton>

          <Typography variant="h6">
            VAXI HOMES
          </Typography>

          <div className={ classes.grow }>
          </div>

          <div className={ classes.desktopSection }>
            <Button color="inherit">Login</Button>
          </div>

          <div className={ classes.mobileSection }>
            <IconButton color="inherit"
                        onClick={ this.toggleDrawer('right', true) }
            >
              <i className="material-icons">more_vert</i>
            </IconButton>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default compose(withStyles(styles), FirebaseConsumer) (SessionBar);
