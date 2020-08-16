import React, {Component} from 'react';
import {FirebaseConsumer} from "../../firebase";
import {getData, getPreviousData} from "../../session/actions/estateActions";
import {
  Breadcrumbs,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
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
  homeIcon: {
    width: 20,
    height: 20,
    marginRight: 4,
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
  },
  buttonBar: {
    marginTop: 20,
  }
}

class RealEstatesList extends Component {

  state = {
    estates: [],
    searchText: '',
    pages: [],
    paginationSize: 25,
    actualPage: 0,
    initialPage: null,
  }

  async componentDidMount() {
    const {paginationSize, searchText, initialPage, pages} = this.state;
    const firebase = this.props.firebase;

    const response = await getData(firebase, paginationSize, initialPage, searchText);
    const page = {
      initialValue: response.initialValue,
      finalValue: response.finalValue,
    }

    pages.push(page);
    this.setState({
      estates: response.estatesArray,
      pages,
      actualPage: 0,
    })
  }

  nextPage = () => {
    const {actualPage, paginationSize, searchText, pages} = this.state;
    const firebase = this.props.firebase;

    getData(firebase, paginationSize, pages[actualPage].finalValue, searchText)
      .then(response => {
        if (response.estatesArray.length > 0) {
          const page = {
            initialValue: response.initialValue,
            finalValue: response.finalValue,
          }

          pages.push(page);
          this.setState({
            pages,
            actualPage: actualPage + 1,
            estates: response.estatesArray,
          })
        }
      })
      .catch(error => {
        console.log(error);
      })
  }

  previousPage = () => {
    const {actualPage, paginationSize, searchText, pages} = this.state;
    const firebase = this.props.firebase;

    if (actualPage > 0) {
      getPreviousData(firebase, paginationSize, pages[actualPage - 1].finalValue, searchText)
        .then(response => {
          const page = {
            initialValue: response.initialValue,
            finalValue: response.finalValue,
          }

          pages.push(page);
          this.setState({
            pages,
            actualPage: actualPage - 1,
            estates: response.estatesArray,
          })
        })
    }
  }

  editEstate = id => {
    this.props.history.push('/estate/edit/' + id);
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
        const firebase = this.props.firebase;
        const {paginationSize} = this.state;

        getPreviousData(firebase, paginationSize, 0, self.state.searchText)
          .then(response => {
            const page = {
              initialValue: response.initialValue,
              finalValue: response.finalValue,
            }

            const pages = [];
            pages.push(page);
            this.setState({
              actualPage: 0,
              pages,
              estates: response.estatesArray,
            })
          })
          .catch(error => {
            console.log(error);
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
                <HomeIcon style={styles.homeIcon}/>
                Home
              </Link>

              <Typography color="textPrimary">Mis inmuebles</Typography>
            </Breadcrumbs>
          </Grid>

          <Grid item xs={12} sm={6} style={styles.textFieldGrid}>
            <TextField InputLabelProps={{shrink: true}}
                       name="searchText"
                       variant="outlined"
                       label="Buscar por dirección"
                       onChange={this.searchTextMethod}
                       value={this.state.searchText}
                       fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12} style={styles.buttonBar}>
            <Grid container spacing={1} direction="column" alignItems="flex-end">
              <ButtonGroup size="small" aria-label="small outlined group">
                <Button>
                  <ArrowLeft onClick={this.previousPage}/>
                </Button>
                <Button>
                  <ArrowRight onClick={this.nextPage}/>
                </Button>
              </ButtonGroup>
            </Grid>
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
                          {estate.city + ', ' + estate.country}
                        </Typography>
                      </CardContent>

                      <CardActions>
                        <Button size="small"
                                color="primary"
                                onClick={() => this.editEstate(estate.id)}>
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

export default FirebaseConsumer(RealEstatesList);
