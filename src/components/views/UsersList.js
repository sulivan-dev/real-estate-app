import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {createRoles, getUsers} from "../../redux/actions/userActions";
import {sendEmail} from "../../redux/actions/emailActions";
import {openScreenMessage} from "../../session/actions/snackBarActions";
import {useStateValue} from "../../session/store";
import {sessionRefresh} from "../../session/actions/sessionActions";
import {sendNotification} from "../../session/actions/notificationActions";
import {FirebaseConsumer} from "../../firebase";
import {
  Container,
  Paper,
  Grid,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem
} from "@material-ui/core";

const styles = {
  container: {
    paddingTop: 8,
  },
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
}

const UsersList = props => {
  const [, dispatch] = useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [dialogState, openDialog] = useState(false);
  const [selectRoles, changeRoles] = useState("0");
  const [userDialog, setUserDialog] = useState({
    email: '',
    phone: '',
    roles: [],
  })
  const usersList = useSelector(state => state.userReducer.users);
  const dispatchRedux = useDispatch();

  useEffect(() => {
    async function getData() {
      await getUsers(dispatchRedux);
    }

    if (!isLoading) {
      setIsLoading(true);
      getData();
    }
  }, [isLoading]);

  const sendEmailMethod = (email) => {
    const object = {
      email: email,
      title: 'Mensage desde Homes React',
      message: 'Gracias por tu suscripción',
    }

    sendEmail(object)
      .then(response => {
        console.log(response);

        openScreenMessage(dispatch, {
          open: true,
          message: 'Se envió el correo electrónico al destinatario',
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  const openDialogMethod = user => {
    setUserDialog(user);
    openDialog(true);
  }

  const changeRolesMethod = event => {
    changeRoles(event.target.value);
  }

  const addRole = async() => {
    if (! userDialog.roles) {
      userDialog.roles = [];
    }

    const roleExist = userDialog.roles.filter(role => role.name === selectRoles)

    if (roleExist.length === 0) {
      const customClaim = {};

      userDialog.roles.map(_role => {
        return Object.defineProperty(customClaim, _role.name, {
          value: _role.state,
          writable: true,
          enumerable: true,
          configurable: true,
        })
      });

      Object.defineProperty(customClaim, selectRoles, {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true,
      });

      userDialog.roles.push({ name: selectRoles, state: true });

      await createRoles(dispatchRedux, userDialog, customClaim);
      await getUsers(dispatchRedux);
      await sessionRefresh(props.firebase);
      openScreenMessage(dispatch, {
        open: true,
        message: 'Se guardó el rol de usuario exitosamente',
      })
    }
  }

  const removeRole = async role => {
    const newArrayRoles = userDialog.roles.filter(currentRole => currentRole.name !== role);
    userDialog.roles = newArrayRoles;
    const customClaims = {}

    newArrayRoles.map(_role => {
      return Object.defineProperty(customClaims, _role.name, {
        value: _role.state,
        writable: true,
        enumerable: true,
        configurable: true,
      })
    });

    Object.defineProperty(customClaims, role, {
      value: false,
      writable: true,
      enumerable: true,
      configurable: true,
    });

    await createRoles(dispatchRedux, userDialog, customClaims);
    await getUsers(dispatchRedux);
    await sessionRefresh(props.firebase);
    openScreenMessage(dispatch, {
      open: true,
      message: "Se eliminó el rol seleccionado",
    })
  }

  const sendPushNotification = user => {
    if (props.messagingValidation.isSupported()) {
      const tokenList = user.arrayTokens;
      const object = {
        token: tokenList || [],
      }

      sendNotification(object)
        .then(response => {
          openScreenMessage(dispatch, {
            open: true,
            message: response.data.message,
          })
        })
    } else {
      openScreenMessage(dispatch, {
        open: true,
        message: 'La versión de su navegador no permite notificaciones',
      })
    }
  }

  return (
    <Container style={styles.container}>
      <Dialog open={dialogState} onClose={() => {openDialog(false)}}>
        <DialogTitle>
          Roles del usuario {userDialog.email || userDialog.phone}
        </DialogTitle>

        <DialogContent>
          <Grid container justify="center">
            <Grid item xs={6} sm={6}>
              <Select value={selectRoles} onChange={changeRolesMethod}>
                <MenuItem value={"0"}>Seleccione Rol</MenuItem>
                <MenuItem value={"admin"}>Administrador</MenuItem>
                <MenuItem value={"operator"}>Operador</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6} sm={6}>
              <Button color="secondary" variant="contained" onClick={() => addRole()}>Agregar</Button>
            </Grid>

            <Grid item xs={12} sm={12}>
              <Table>
                <TableBody>
                  {
                    userDialog.roles
                      ? userDialog.roles.map((role, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">{role.name}</TableCell>
                          <TableCell align="left">
                            <Button variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={() => removeRole(role.name)}
                                    >Eliminar</Button>
                          </TableCell>
                        </TableRow>
                      ))
                      : null
                  }
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button color="primary" onClick={() => {openDialog(false)}}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Paper style={styles.paper}>
        <Grid container justify="center">
          <Grid item xs={12} sm={12}>
            <Table>
              <TableBody>
                {
                  usersList
                    ? usersList.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell alig="left">
                          { user.email || user.phone }
                        </TableCell>
                        <TableCell align="left">
                          { user.firstName ? (user.firstName + ' ' + user.lastName) : 'N/A' }
                        </TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" size="small" onClick={() => openDialogMethod(user)}>Roles</Button>
                        </TableCell>
                        {/*<TableCell>*/}
                        {/*  <Button variant="contained" color="primary" size="small" onClick={() => sendPushNotification(user)}>Notificación</Button>*/}
                        {/*</TableCell>*/}
                        {/*<TableCell>*/}
                        {/*  <Button variant="contained"*/}
                        {/*          color="primary"*/}
                        {/*          size="small"*/}
                        {/*          onClick={() => sendEmailMethod(user.email)}*/}
                        {/*  >Enviar Correo</Button>*/}
                        {/*</TableCell>*/}
                      </TableRow>
                      ))
                    : ""
                }
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default FirebaseConsumer(UsersList);
