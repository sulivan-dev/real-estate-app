import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Firebase, { FirebaseContext } from "./firebase";
import { initialState } from "./session/initialState";
import { StateProvider } from "./session/store";
import { mainReducer } from "./session/reducers";

const firebase = new Firebase();

ReactDOM.render(
  <React.StrictMode>
    <FirebaseContext.Provider value={ firebase }>
      <StateProvider initialState={ initialState } reducer={ mainReducer }>
        <App />
      </StateProvider>
    </FirebaseContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// if (firebase.messagingValidation.isSupported()) {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//       .register("/firebase-messaging-sw.js")
//       .then(registration => {
//         console.log('Registro completo de service worker', registration.scope)
//       })
//       .catch(error => {
//         console.log('Fallo el registro de service worker', error);
//       });
//   }
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
