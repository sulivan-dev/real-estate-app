import app from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/messaging';
import firebaseConfig from "./firebaseConfig";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.db = app.firestore();
    this.auth = app.auth();
    this.storage = app.storage();
    this.authorization = app.auth;
    this.messagingValidation = app.messaging;

    if (this.messagingValidation.isSupported()) {
      this.messaging = app.messaging();
      this.messaging.usePublicVapidKey(process.env.REACT_APP_KEY_PAIR_CERTIFICATES)
    }

    this.storage.ref().constructor.prototype.saveDocuments = function (documents) {
      let ref = this;

      return Promise.all(documents.map(function (file) {
        return ref.child(file.alias).put(file).then(response => {
          return ref.child(file.alias).getDownloadURL();
        })
      }))
    }
  }

  isStarted() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    })
  }

  saveDocument = (name, document) => this.storage.ref().child(name).put(document);

  getDocument = (documentUrl) => this.storage.ref().child(documentUrl).getDownloadURL();

  saveDocuments = (documents) => this.storage.ref().saveDocuments(documents);

  deleteDocument = (document) => this.storage.ref().child(document).delete();

}

export default Firebase;
