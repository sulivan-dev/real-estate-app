import React, {Component} from 'react';
import { v4 as uuidv4 } from 'uuid';
import ImageUploadComponent from "react-images-upload";
import {FirebaseConsumer} from "../../firebase";
import {Container, Paper, Grid, Breadcrumbs, Link, Typography, TextField, Button, Table, TableBody, TableRow, TableCell} from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
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

class EditRealEstate extends Component {

  state = {
    estate: {
      address: '',
      city: '',
      country: '',
      description: '',
      inside: '',
      photos: [],
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;

    const estateCollection = this.props.firebase.db.collection('estates');
    const estateDB = await estateCollection.doc(id).get();

    this.setState({
      estate: estateDB.data(),
    })
  }

  changeData = e => {
    let estate = Object.assign({}, this.state.estate);
    estate[e.target.name] = e.target.value;

    this.setState({
      estate: estate,
    })
  }

  uploadImages = images => {
    const { estate } = this.state;
    const { id } = this.props.match.params;
    // create dynamic name for new images
    Object.keys(images).forEach(key => {
      let dynamicCode = uuidv4();
      let imageName = images[key].name;
      let extension = imageName.split('.').pop();

      images[key].alias = (imageName.split('.')[0] + '_' + dynamicCode + '.' + extension)
        .replace(/\s/g, '_')
        .toLocaleLowerCase();
    })

    this.props.firebase.saveDocuments(images)
      .then(response => {
        estate.photos = estate.photos.concat(response);

        this.props.firebase.db
          .collection('estates')
          .doc(id)
          .set(estate, { merge: true})
          .then(response => {
            this.setState({
              estate: estate
            })
          })
          .catch(error => {
            console.log(error);
          })
      })
  }

  deleteImage = photoUrl => async () => {
    const {estate} = this.state;
    const {id} = this.props.match.params;
    let photoId = photoUrl.match(/[\w-]+.(jpg|png|jpeg|gif|svg)/);
    let photoName = photoId[0];

    await this.props.firebase.deleteDocument(photoName);

    let photoList = this.state.estate.photos.filter(photo => {
      return photo !== photoUrl;
    })

    estate.photos = photoList;
    this.props.firebase.db
      .collection('estates')
      .doc(id)
      .set(estate, { merge: true})
      .then(response => {
        this.setState({
          estate
        })
      })
  }

  saveEstate = () => {
    const {estate} = this.state;
    const{id} = this.props.match.params;
    const searchText = estate.address + ' ' + estate.city + ' ' + estate.country;

    estate.keywords = createKeyword(searchText);
    estate.owner = this.props.firebase.auth.currentUser.uid;

    this.props.firebase.db
      .collection('estates')
      .doc(id)
      .set(estate, { merge: true })
      .then(response => {
        this.props.history.push('/');
      })
  }

  render() {
    const imageKey = uuidv4();

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
                <Typography color="textPrimary">Editar Inmueble</Typography>
              </Breadcrumbs>
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField name="address"
                         label="Dirección"
                         onChange={this.changeData}
                         value={this.state.estate.address}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="city"
                         label="Ciudad"
                         onChange={this.changeData}
                         value={this.state.estate.city}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField name="country"
                         label="País"
                         onChange={this.changeData}
                         value={this.state.estate.country}
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField name="description"
                         label="Descripción"
                         onChange={this.changeData}
                         value={this.state.estate.description}
                         rowsMax="4"
                         multiline
                         fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField name="inside"
                         label="Interior"
                         onChange={this.changeData}
                         value={this.state.estate.inside}
                         rowsMax="4"
                         multiline
                         fullWidth
              />
            </Grid>
          </Grid>

          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <ImageUploadComponent key={imageKey}
                                    withIcon={true}
                                    buttonText="Seleccione las imagenes"
                                    onChange={this.uploadImages}
                                    imgExtension={['.jpg', '.gif', '.png', '.jpeg']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Table>
                <TableBody>
                  {
                    this.state.estate.photos
                      ? this.state.estate.photos.map((photo, index) => (
                        <TableRow key={index}>
                          <TableCell align="left">
                            <img src={photo} style={styles.photo} alt=""/>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={this.deleteImage(photo)}
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

          <Grid container justify="center">
            <Grid item xs={12} sm={6}>
              <Button type="button"
                      variant="contained"
                      size="large"
                      color="primary"
                      style={styles.submit}
                      onClick={this.saveEstate}
                      fullWidth
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

export default FirebaseConsumer(EditRealEstate);
