import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getUsers} from "../../redux/actions/userActions";
import {sendEmail} from "../../redux/actions/emailActions";
import {openScreenMessage} from "../../session/actions/snackBarActions";
import {useStateValue} from "../../session/store";
import {Container, Paper, Grid, Table, TableBody, TableRow, TableCell, Button} from "@material-ui/core";

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
  });

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


  return (
    <Container style={styles.container}>
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
                          <Button variant="contained" color="primary" size="small">Roles</Button>
                        </TableCell>
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

export default UsersList;
