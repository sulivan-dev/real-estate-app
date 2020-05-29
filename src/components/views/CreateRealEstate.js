import React, {Component} from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadComponent from "react-images-upload";
import {Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, TableBody, TableRow, Table, TableCell} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import {FirebaseConsumer} from "../../firebase";
import {openScreenMessage} from "../../session/actions/snackBarActions";
import {createKeyword} from "../../common/Keyword";

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
  link: {
    display: 'flex',
  },
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  submit: {
    marginTop: 15,
    marginBottom: 10,
  },
  photo: {
    height: 100,
  }
}

class CreateRealEstate extends Component {

  state = {
    estate: {
      address: '',
      city: '',
      country: '',
      description: '',
      inside: '',
      photos: [],
    },
    files: [],
  }

  formData = e => {
    let estate = Object.assign({}, this.state.estate);
    estate[e.target.name] = e.target.value;

    this.setState({
      estate: estate
    })
  }

  uploadImages = documents => {
    Object.keys(documents).forEach(function (key) {
      documents[key].tempUrl = URL.createObjectURL(documents[key]);
    })

    this.setState({
      files: this.state.files.concat(documents),
    })
  }

  deleteImages = photoName => () => {
    this.setState({
      files: this.state.files.filter(file => {
        return file.name !== photoName;
      })
    })
  }

  saveEstate = () => {
    const { files, estate } = this.state;
    // Create aliases to files and save aliases in firestore/firebase
    Object.keys(files).forEach(function(key) {
      let dynamicValue = Math.floor(new Date().getTime() / 1000);
      let name = files[key].name;
      let extension = name.split(".").pop();

      files[key].alias = (name.split(".")[0] + "_" + dynamicValue + "." + extension)
        .replace(/\s/g, "_")
        .toLocaleLowerCase();
    })

    const searchText = estate.address + ' ' + estate.city + ' ' + estate.country;
    let keywords = createKeyword(searchText);

    this.props.firebase.saveDocuments(files)
      .then(response => {
        estate.photos = response;
        estate.keywords = keywords;
        estate.owner = this.props.firebase.auth.currentUser.uid;

        this.props.firebase.db
          .collection('estates')
          .add(estate)
          .then(response => {
            this.props.history.push('/');
          })
          .catch(error => {
            openScreenMessage({
              open: true,
              message: error,
            })
          })
      })
      .catch(error => {
        console.log(error);
      })
  }

  render() {
    let imageKey = uuidv4();

    return (
      <Container style={styles.container}>
        <Paper style={styles.paper}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link color="inherit" style={styles.link} href="/">
                  <HomeIcon style={styles.homeIcon}/>
                  Home
                </Link>
                <Typography color="textPrimary">Nuevo Inmueble</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField name="address"
                         label="Dirección del inmueble"
                         onChange={this.formData}
                         value={this.state.estate.address}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="city"
                         label="Ciudad del inmueble"
                         onChange={this.formData}
                         value={this.state.estate.city}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField name="country"
                         label="País del inmueble"
                         onChange={this.formData}
                         value={this.state.estate.country}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField name="description"
                         label="Descripción del inmueble"
                         onChange={this.formData}
                         value={this.state.estate.description}
                         multiline
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <TextField name="inside"
                         label="Interior del inmueble"
                         onChange={this.formData}
                         value={this.state.estate.inside}
                         multiline
                         fullWidth
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <ImageUploadComponent key={imageKey}
                                    withIcon={true}
                                    buttonText="Seleccione las imagenes"
                                    onChange={this.uploadImages}
                                    imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
                                    maxFileSize={5242880}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {
                    this.state.files.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell align="left">
                          <img src={file.tempUrl} style={styles.photo} alt=""/>
                        </TableCell>
                        <TableCell>
                          <Button variant="contained"
                                  color="secondary"
                                  size="small"
                                  onClick={this.deleteImages(file.name)}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button type="button"
                      variant="contained"
                      size="large"
                      color="primary"
                      style={styles.submit}
                      fullWidth
                      onClick={this.saveEstate}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default FirebaseConsumer(CreateRealEstate);
