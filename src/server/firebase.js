import app from 'firebase/app';
import { firebaseConfig } from '../../firebaseConfig';

class Firebase {
  constructor() {
    app.initializeApp( firebaseConfig );
    this.db = app.firestore();
  }
}

export default Firebase;

