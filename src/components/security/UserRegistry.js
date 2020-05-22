import React, { Component } from 'react';
import { compose } from 'recompose';
import { Container, Avatar,Typography, Grid, TextField, Button } from "@material-ui/core";
import LockOutLineIcon from '@material-ui/icons/LockOutlined';
import { FirebaseConsumer } from "../../firebase";
import { createUser } from "../../session/actions/sessionActions";
import { openScreenMessage } from "../../session/actions/snackBarActions";
import { StateContext } from "../../session/store";

const styles = {
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: 8,
    backgroundColor: '#e53935',
  },
  form: {
    width: '100%',
    marginTop: 10,
  },
  submit: {
    marginTop: 15,
    marginBottom: 20,
  },
}

class UserRegistry extends Component {
  static typeContext = StateContext;

  state = {
    user: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    firebase: null,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.firebase === prevState.firebase) {
      return null;
    }

    return {
      firebase: nextProps.firebase,
    }
  }

  onChangeUser = e => {
    let user = Object.assign({}, this.state.user);
    user[e.target.name] = e.target.value;

    this.setState({
      user: user
    })
  }

  userRegister = async e => {
    e.preventDefault();

    const [, dispatch] = this.context;
    const { user, firebase } = this.state;

    let callback = await createUser(dispatch, firebase, user);

    if(callback.status) {
      this.props.history.push('/');
    } else {
      openScreenMessage( dispatch, {
        open: true,
        message: callback.error.message
      })
    }
  }

  render() {
    return (
      <Container maxWidth="md">
        <div style={styles.paper} >
          <Avatar style={styles.avatar}>
            <LockOutLineIcon/>
          </Avatar>

          <Typography component="h1" variant="h5">
            Registre su Cuenta
          </Typography>

          <form style={ styles.form }>
            <Grid container spacing={2}>
              <Grid item md={6} xs={12}>
                <TextField name="firstName"
                           onChange={this.onChangeUser}
                           value={ this.state.user.firstName }
                           label="Ingrese su nombre"
                           fullWidth
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="lastName"
                           onChange={this.onChangeUser}
                           value={ this.state.user.lastName }
                           label="Ingrese su apellido"
                           fullWidth
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField name="email"
                           onChange={this.onChangeUser}
                           value={ this.state.user.email }
                           label="Ingrese su email"
                           fullWidth
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField type="password"
                           name="password"
                           onChange={this.onChangeUser}
                           value={ this.state.user.password }
                           label="Ingrese su contraseña"
                           fullWidth
                />
              </Grid>
            </Grid>
            <Grid container justify="center">
              <Grid item md={6} xs={12}>
                <Button type="submit"
                        variant="contained"
                        size="large"
                        color="primary"
                        style={styles.submit}
                        fullWidth
                        onClick={this.userRegister}
                >
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

export default compose(FirebaseConsumer) (UserRegistry);
