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

  isStarted() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    })
  }
}

export default Firebase;
