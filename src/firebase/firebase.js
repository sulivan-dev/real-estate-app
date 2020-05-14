import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import firebaseConfig from "./firebaseConfig";

class Firebase {
  constructor() {
    app.initializeApp( firebaseConfig );
    this.db = app.firestore();
    this.auth = app.auth();
  }
}

export default Firebase;
