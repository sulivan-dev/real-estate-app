import axios from 'axios';

export const getUsers = (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/usersList/list`);

    dispatch({
      type: "USERS_LIST",
      payload: response.data.data,
    });

    resolve();
  })
}

export const createRoles = (dispatch, user, role, firebase) => {
  return new Promise(async (resolve, reject) => {
    firebase.auth.onAuthStateChanged(user => {
      if (user) {
        user.getIdToken()
            .then(async userToken => {
              const headers = {
                "Content-Type": "Application/json",
                "authorization": "Bearer " + userToken,
              }

              const params = {
                id: user.id,
                role: role,
                roles: user.roles,
              }

              const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/usersMaintenance`, params, headers);
              resolve(response);
        })
            .catch(error => {
              console.log(error);
            })
      }
    })
  })
}
