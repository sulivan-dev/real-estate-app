import React from 'react';
import {Divider, List, ListItem, ListItemText} from '@material-ui/core';
import {Link} from 'react-router-dom';

export const LeftMenu = ({classes, getPermissions}) => (
  <div className={classes.list}>
    <List>
      <ListItem button component={Link} to="/auth/profile">
        <i className="material-icons">account_box</i>
        <ListItemText classes={{primary: classes.listItemText}} primary="Perfil"/>
      </ListItem>
    </List>
    <Divider/>
    <List>
      <ListItem button component={Link} to="/estate/create">
        <i className="material-icons">add_box</i>
        <ListItemText classes={{primary: classes.listItemText}} primary="Nuevo Inmueble"/>
      </ListItem>
      <ListItem button component={Link} to="/">
        <i className="material-icons">business</i>
        <ListItemText classes={{primary: classes.listItemText}} primary="Inmuebles"/>
      </ListItem>
      <ListItem button component={Link} to="/users-list">
        <i className="material-icons">group</i>
        <ListItemText classes={{primary: classes.listItemText}} primary="Usuarios"/>
      </ListItem>
      {/*<ListItem button onClick={getPermissions}>*/}
      {/*  <i className="material-icons">notifications_none</i>*/}
      {/*  <ListItemText classes={{primary: classes.listItemText}} primary="Recibir notificaciones"/>*/}
      {/*</ListItem>*/}
    </List>
  </div>
)
