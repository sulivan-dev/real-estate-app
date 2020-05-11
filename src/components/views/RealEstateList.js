import React, { Component } from 'react';

import Button from '@material-ui/core/Button';

class RealEstateList extends Component {
  render() {
    return (
      <div>
        <Button variant="contained" color="primary">Color Primario</Button>
        <Button variant="contained" color="secondary">Color Secundario</Button>
      </div>
    );
  }
}

export default RealEstateList;
