import axios from 'axios';

export const getNotificationPermissions = (firebase, user, dispatch) => {
  return new Promise( async (resolve, reject) => {
    const messaging = firebase.messaging;
    await messaging.requestPermission();
    const token = await messaging.getToken();

    if (! user.arrayTokens) {
      user.arrayTokens = [];
    }

    const arrayTokensFilter = user.arrayTokens.filter(tk => tk !== token);
    arrayTokensFilter.push(token);
    user.arrayTokens = arrayTokensFilter;

    firebase.db
      .collection('users')
      .doc(firebase.auth.currentUser.uid)
      .set(user, { merge: true })
      .then(response => {
        dispatch({
          type: "INITIAL_SESSION",
          session: user,
          is_authenticate: true,
        })

        resolve(true);
      })
      .catch(error => {
        console.log(error);
      })
  })
}

export const sendNotification = (token) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/notificationsSend`, token);
    resolve(response);
  })
}
