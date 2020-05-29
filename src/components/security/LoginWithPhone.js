import React, { Component } from 'react';
// import * as firebaseui from 'firebaseui';
import {
  Container,
  Avatar,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@material-ui/core";
import LockOutlineIcon from '@material-ui/icons/LockOutlined';
import {FirebaseConsumer} from "../../firebase";
import {StateContext} from "../../session/store";
import {openScreenMessage} from "../../session/actions/snackBarActions";

const styles = {
  paper: {
    marginTop: 9,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: 5,
    backgroundColor: 'red',
  },
  form: {
    width: '100%',
    marginTop: 8,
  },
  submit: {
    marginTop: 10,
    marginBottom: 20,
  },
  captcha: {
    flexGrow: 1,
    marginBottom: 10,
    marginTop: 10,
  },

}

class LoginWithPhone extends Component {
  static contextType = StateContext;

  state = {
    disable: true,
    openDialog: false,
    confirmationCode: null,
    user: {
      phone: '',
      code: '',
    }
  }

  componentDidMount() {
    const firebase = this.props.firebase;

    firebase.auth.languageCode = 'es';
    window.recaptchaVerifier = new firebase.authorization.RecaptchaVerifier(
        this.recaptcha,
        {
          size: 'normal',
          callback: response => {
            this.setState({
              disable: false,
            })
          },
          'expired-callback': function() {
            this.setState({
              disable: true,
            })

            window.location.reload();
          }
        }
    );

    window.recaptchaVerifier.render()
        .then(function(widgetId) {
          window.recaptchaVerifierId = widgetId;
        });
  }

  verifyNumber = e => {
    e.preventDefault();

    const { firebase } = this.props;
    const [, dispatch] = this.context;
    const verificationApp = window.recaptchaVerifier;

    firebase.auth
        .signInWithPhoneNumber(this.state.user.phone, verificationApp)
        .then(response => {
          this.setState({
            openDialog: true,
            confirmationCode: response,
          })
        })
        .catch(error => {
          openScreenMessage(dispatch, {
            open: true,
            message: error.message
          })
        })
  }

  onChangeData = e => {
    let user = Object.assign({}, this.state.user);
    user[e.target.name] = e.target.value;

    this.setState({
      user,
    })
  }

  loginWithPhone = () => {
    const { firebase } = this.props;
    const [, dispatch] = this.context;

    let credential = firebase.authorization.PhoneAuthCredential.credential(
        this.state.confirmationCode.verificationId,
        this.state.user.code
    );

    firebase.auth
        .signInWithCredential(credential)
        .then(authUser => {
          firebase.db
              .collection('users')
              .doc(authUser.user.uid)
              .set({
                id: authUser.user.uid,
                phone: authUser.user.phoneNumber
              }, { merge: true })
              .then(response => {
                firebase.db
                    .collection('users')
                    .doc(authUser.user.uid)
                    .get()
                    .then(doc => {
                      dispatch({
                        type: 'INITIAL_SESSION',
                        session: doc.data(),
                        is_authenticate: true
                      })

                      this.props.history.push('/');
                    })
                    .catch(error => {
                      openScreenMessage(dispatch, {
                        open: true,
                        message: error.message
                      })
                    })
              })
              .catch(error => {
                openScreenMessage(dispatch, {
                  open: true,
                  message: error.message
                })
              })
        })
        .catch(error => {
          openScreenMessage(dispatch, {
            open: true,
            message: error.message
          })
        })
  }

  render() {
    return (
        <Container maxWidth="xs">
          <Dialog open={this.state.openDialog}
                  onClose={() => {this.setState( { openDialog: false })}}>
            <DialogTitle>
              Ingrese el código
            </DialogTitle>

            <DialogContent>
              <DialogContentText>
                Ingrese el código que recibió por mensaje de texto
              </DialogContentText>

              <TextField autoFocus
                         margin="dense"
                         name="code"
                         value={this.state.user.code}
                         onChange={this.onChangeData} fullWidth />
            </DialogContent>

            <DialogActions>
              <Button color="primary" onClick={this.loginWithPhone}>Verificar</Button>
              <Button color="primary" onClick={() => {this.setState( { openDialog: false })}}>Cancelar</Button>
            </DialogActions>
          </Dialog>

          <div style={styles.paper}>
            <Avatar style={styles.avatar}>
              <LockOutlineIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Ingrese su número de teléfono
            </Typography>

            <form style={styles.form}>
              <Grid container style={styles.captcha} justify="center">
                <div ref={ref => (this.recaptcha = ref)}>
                </div>

                <TextField variant="outlined"
                           fullWidth
                           name="phone"
                           label="Ingrese número de teléfono"
                           value={this.state.user.phone}
                           onChange={this.onChangeData}
                />

                <Button type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={styles.submit}
                        onClick={this.verifyNumber}
                        disabled={this.state.disable}>
                  Enviar
                </Button>
              </Grid>
            </form>
          </div>
        </Container>
    );
  }
}

export default FirebaseConsumer(LoginWithPhone);
