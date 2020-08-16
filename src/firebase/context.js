import React from "react";

export const FirebaseContext = React.createContext();

export const FirebaseConsumer = Component => props => (
  <FirebaseContext.Consumer>
    {
      firebase => <Component {...props} firebase={firebase}/>
    }
  </FirebaseContext.Consumer>
)
