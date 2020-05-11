import React, {Component} from 'react';
import { Toolbar, Typography, Button, IconButton } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

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
});

class SessionBar extends Component {
  render() {

    const { classes } = this.props;

    return (
      <div>
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
            <IconButton color="inherit">
              <i className="material-icons">more_vert</i>
            </IconButton>
          </div>
        </Toolbar>
      </div>
    );
  }
}

export default withStyles(styles) (SessionBar);
