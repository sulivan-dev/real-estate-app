import React, {useState, useEffect} from 'react';
import ImageUploadComponent from "react-images-upload";
import { v4 as uuidv4 } from 'uuid';
import {useStateValue} from "../../session/store";
import {Grid, Container, Avatar, Typography, Button, TextField} from "@material-ui/core";
import { FirebaseConsumer } from "../../firebase";
import Logo from '../../logo.svg';
import {openScreenMessage} from "../../session/actions/snackBarActions";


const styles = {
  paper: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%',
    marginTop: 20,
  },
  submit: {
    marginTop: 15,
    marginBottom: 20,
  }
}

const UserProfile = props => {
  const [{session}, dispatch] = useStateValue();
  const firebase = props.firebase;

  let [userState, changeState] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    photo: '',
  });

  const validateform = session => {
    if (session) {
      changeState(session.user)
    }
  }

  useEffect(() => {
    if (session) {
      validateform(session)
    }
  })

  const changeData = e => {
    const { name, value } = e.target;
    changeState( prev => ({
      ...prev,
      [name]: value
    }))
  }

  const photoUpload = pictures => {
    // Get photos
    const photo = pictures[0];
    // Rename images
    const uniqueKey = uuidv4();
    // Get image name
    const photoName = photo.name;
    // get image extension
    const photoExtension = photoName.split('.').pop();
    // create new name or alias to photo
    const alias =
      (photoName.split('.')[0] + '_' + uniqueKey + '.' + photoExtension)
      .replace(/\s/g, '_')
      .toLocaleLowerCase();

    firebase.saveDocument(alias, photo)
      .then(metadata => {
        firebase.getDocument(alias)
          .then(response => {
            userState.photo = response;

            firebase.db
              .collection('users')
              .doc(firebase.auth.currentUser.uid)
              .set({
                photo: response,
              }, { merge: true })
              .then(user => {
                dispatch({
                  type: 'INITIAL_SESSION',
                  session: userState,
                  is_authenticate: true,
                })
              })
          })
      })
  }

  const saveData = e => {
    e.preventDefault();

    firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .set(userState, {merge: true})
      .then(response => {
        dispatch({
          type: 'INITIAL_SESSION',
          session: userState,
          is_authenticate: true,
        })

        openScreenMessage(dispatch, {
          open: true,
          message: 'Se guardaron los cambios!',
        })
      })
      .catch(error => {
        openScreenMessage(dispatch, {
          open: true,
          message: 'Errores guardando en la base de datos: ' + error,
        })
      })
  }

  let photoKey = uuidv4();

  return ( session ?
      (
        <Container component="main" maxWidth="md" justify="center">
          <div style={styles.paper}>
            <Avatar style={styles.avatar} src={userState ? userState.photo : Logo}/>
            <Typography component="h1" variant="h5">
              Perfil de Cuenta
            </Typography>
            <form style={styles.form}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField name="firstName"
                             label="Nombre"
                             variant="outlined"
                             value={userState.firstName}
                             onChange={changeData}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField name="lastName"
                             label="Apellido"
                             variant="outlined"
                             value={userState.lastName}
                             onChange={changeData}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField name="email"
                             label="E-mail"
                             variant="outlined"
                             value={userState.email}
                             onChange={changeData}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField name="phone"
                             label="Teléfono"
                             variant="outlined"
                             value={userState.phone}
                             onChange={changeData}
                             fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <ImageUploadComponent withIcon={false}
                                        key={photoKey}
                                        singleImage={true}
                                        buttonText="Seleccione su imagen de perfil"
                                        onChange={photoUpload}
                                        imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                                        maxFileSize={5242880}

                  />
                </Grid>
              </Grid>
              <Grid container justify="center">
                <Grid item xs={12} md={6}>
                  <Button type="submit"
                          variant="contained"
                          size="large"
                          color="primary"
                          fullWidth
                          style={styles.submit}
                          onClick={saveData}
                  >
                    Guardar
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      )
      : null
  )
}

export default FirebaseConsumer(UserProfile);
