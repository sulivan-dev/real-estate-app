export const initialSession = (dispatch, firebase, email, password) => {
  return new Promise((resolve, reject) => {
    firebase.auth
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        firebase.db
          .collection('users')
          .doc(response.user.uid)
          .get()
          .then(doc => {
            const userDB = doc.data();

            dispatch({
              type: 'INITIAL_SESSION',
              session: userDB,
              is_authenticate: true,
            })

            resolve({
              status: true,
            });
          })
      })
      .catch(error => {
        console.log(error);

        resolve({
          status: false,
          error: error,
        })
      })
  })
}

export const createUser = (dispatch, firebase, user) => {
  return new Promise((resolve, reject) => {
    firebase.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(response => {
        firebase.db
          .collection('users')
          .doc(response.user.uid)
          .set({
            id: response.user.uid,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }, { merge: true })
          .then(doc => {
            user.id = doc.user.uid;

            dispatch({
              type: 'INITIAL_SESSION',
              session: user,
              is_authenticate: true,
            })
          })

          resolve({
            status: true,
          });
      })
      .catch(error => {
        console.log(error)
        resolve({
          status: false,
        })
      })
  })
}

export const exitSession = (dispatch, firebase) => {
  return new Promise((resolve, reject) => {
    firebase.auth
      .signOut()
      .then(response => {
        dispatch({
          type: 'EXIT_SESSION',
          user: {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            photo: '',
            phoneNumber: '',
          },
          is_authenticate: false,
        })

        resolve();
      })
      .catch(error => {
        console.log(error);
      })
  })
}
