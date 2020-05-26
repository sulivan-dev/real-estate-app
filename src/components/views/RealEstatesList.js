import React, { Component } from 'react';
import {FirebaseConsumer} from "../../firebase";
import {Container, Button, Grid, Breadcrumbs, Link, Typography, TextField, Paper, Card, CardContent, CardActions, CardMedia} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import Logo from '../../logo.svg';

const styles = {
  cardGrid: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  paper: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    minHeight: 650,
  },
  link: {
    display: 'flex',
  },
  textFieldGrid: {
    marginTop: 20,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%',
  },
  cardContent: {
    flexGrow: 1,
  }
}

class RealEstateList extends Component {

  state = {
    estates: [],
    searchText: '',
  }

  async componentDidMount() {
    let queryObject = this.props.firebase.db
      .collection('estates')
      .orderBy('address');

    const snapshot = await queryObject.get();
    const estatesArray = snapshot.docs.map(doc => {
      let data = doc.data();
      let id = doc.id;

      return {id, ...data};
    })

    this.setState({
      estates: estatesArray,
    })
  }

  deleteEstates = id => {
    this.props.firebase.db
      .collection('estates')
      .doc(id)
      .delete()
      .then(response => {
        this.deleteElementOfEstateArray(id);
      })
  }

  deleteElementOfEstateArray = id => {
    const newEstatesList = this.state.estates.filter(estate => estate.id !== id);

    this.setState({
      estates: newEstatesList,
    })
  }

  searchTextMethod = e => {
    const self = this;
    self.setState({
      [e.target.name]: e.target.value,
    })

    if (self.state.typingTimeout) {
      clearTimeout(self.state.typingTimeout);
    }

    self.setState({
      name: e.target.value,
      typing: false,
      typingTimeout: setTimeout(goTime => {
        let queryObject = this.props.firebase.db
          .collection('estates')
          .orderBy('address')
          .where('keywords', 'array-contains', self.state.searchText.toLocaleLowerCase());

        if (self.state.searchText.trim() === '') {
          queryObject = this.props.firebase.db
            .collection('estates')
            .orderBy('address')
        }

        queryObject.get()
          .then(snapshot => {
            const estatesArray = snapshot.docs.map(doc => {
              let data = doc.data();
              let id = doc.id;

              return { id, ...data };
            })

            this.setState({
              estates: estatesArray,
            })
          })
      }, 500)
    })
  }


  render() {
    return (
      <Container style={styles.cardGrid}>
        <Paper style={styles.paper}>
          <Grid item xs={12} sm={12}>
            <Breadcrumbs aria-label="breadcrumbs">
              <Link color="inherit" style={styles.link} href="/">
                <HomeIcon />
                Home
              </Link>

              <Typography color="textPrimary">Mis inmuebles</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} sm={6} style={styles.textFieldGrid}>
            <TextField InputLabelProps={{ shrink: true }}
                       name="searchText"
                       variant="outlined"
                       label="Ingrese el inmueble a buscar"
                       onChange={this.searchTextMethod}
                       value={this.state.searchText}
                       fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12} style={styles.textFieldGrid}>
            <Grid container spacing={4}>
              {
                this.state.estates.map(estate => (
                  <Grid item key={estate.id} xs={12} sm={6} md={4}>
                    <Card style={styles.card}>
                      <CardMedia style={styles.cardMedia}
                                 image={estate.photos
                                   ? estate.photos[0]
                                     ? estate.photos[0]
                                     : Logo
                                   : Logo}
                                 title="Mi inmueble"
                      />

                      <CardContent style={styles.cardContent}>
                        <Typography gutterBottom component="h2" variant="h5">
                          { estate.city + ', ' + estate.country }
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button size="small"
                                color="primary">
                          Editar</Button>
                        <Button size="small"
                                color="primary"
                                onClick={() => this.deleteEstates(estate.id)}>
                          Eliminar</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              }
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }
}

export default FirebaseConsumer(RealEstateList);
