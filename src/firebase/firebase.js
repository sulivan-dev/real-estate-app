import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import firebaseConfig from "./firebaseConfig";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
  }

  isStarted() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    })
  }

  saveDocument = (name, document) => this.storage.ref().child(name).put(document);

  getDocument = (documentUrl) => this.storage.ref().child(documentUrl).getDownloadURL();

}

export default Firebase;
