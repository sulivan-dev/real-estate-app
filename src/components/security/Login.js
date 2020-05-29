import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Grid, Avatar, Typography, TextField, Button, Link } from '@material-ui/core';
import LockOutlineIcon from '@material-ui/icons/LockOutlined';
import { FirebaseConsumer } from "../../firebase";
import { initialSession } from '../../session/actions/sessionActions';
import { StateContext } from "../../session/store";
import { openScreenMessage } from "../../session/actions/snackBarActions";

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
  }

}

class Login extends Component {
  static contextType = StateContext;

  state = {
    firebase: null,
    user: {
      email: '',
      password: '',
    },
  }

  static getDerivedStateFromProps(nextProps, prevProps) {
    if (nextProps.firebase === prevProps.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase,
    }
  }

  onChangeForm = e => {
    let user = Object.assign({}, this.state.user);
    user[e.target.name] = e.target.value;

    this.setState({
      user: user,
    })
  }

  login = async e  => {
    e.preventDefault();
    const [, dispatch] = this.context;
    const { firebase, user } = this.state;
    const { email, password } = user;

    let callback = await initialSession(dispatch, firebase, email, password)

    if (callback.status) {
      this.props.history.push('/');
    } else {
      openScreenMessage(dispatch, {
        open: true,
        message: callback.error.message
      })
    }
  }

  resetPassword = () => {
    const {firebase, user} = this.state;
    const [, dispatch] = this.context;

    firebase.auth
        .sendPasswordResetEmail(user.email)
        .then(response => {
          openScreenMessage(dispatch,{
            open: true,
            message: "Se ha enviado un correo electrónico a tu cuenta",
          })
        })
        .catch(error => {
          openScreenMessage(dispatch, {
            open: true,
            message: error.message,
          })
        })
  }

  render() {
    return (
      <Container maxWidth="xs">
        <div style={ styles.paper }>
          <Avatar style={ styles.avatar }>
            <LockOutlineIcon />
          </Avatar>

          <Typography component="h1" variant="h5">
            Inicio de Sesión
          </Typography>

          <form style={styles.form}>
            <TextField variant="outlined"
                       label="E-mail"
                       name="email"
                       margin="normal"
                       fullWidth
                       onChange={this.onChangeForm}
                       value={ this.state.user.email }
            />

            <TextField variant="outlined"
                       type="password"
                       label="Contraseña"
                       name="password"
                       margin="normal"
                       fullWidth
                       onChange={this.onChangeForm}
                       value={ this.state.user.password }
            />

            <Button type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={styles.submit}
                    onClick={this.login}
            >
              Enviar
            </Button>

            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={this.resetPassword}>
                  ¿Olvido su contraseña?
                </Link>
              </Grid>
              <Grid item xs>
                <Link href="/auth/user-registry" variant="body2">
                  ¿No tienes cuenta? Registrate
                </Link>
              </Grid>
            </Grid>
          </form>

          <Button type="click"
                  variant="contained"
                  color="primary"
                  href="/auth/login-phone"
                  fullWidth
                  style={styles.submit}
          >
            Ingrese con su teléfono
          </Button>
        </div>
      </Container>
    );
  }
}

export default compose(FirebaseConsumer) (Login);
