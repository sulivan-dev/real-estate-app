import React from 'react';
import {Avatar, Link, List, ListItem, ListItemText} from "@material-ui/core";

export const RightMenu = ({classes, user, userText, userPhoto, exitSession}) => (
  <div className={classes.list}>
    <List>
      <ListItem button component={Link} to="/auth/user-registry">
        <Avatar src={userPhoto}/>
        <ListItemText classes={{primary: classes.listItemText}} primary={userText}/>
      </ListItem>
      <ListItem button onClick={exitSession}>
        <ListItemText classes={{primary: classes.listItemText}} primary="Salir"/>
      </ListItem>
    </List>
  </div>
)
