import axios from 'axios';

export const getUsers = (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(`https://us-central1-home-9643a.cloudfunctions.net/usersList/list`);

    dispatch({
      type: "USERS_LIST",
      payload: response.data,
    });

    resolve();
  })
}

export const createRoles = (dispatch, user) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post('https://us-central1-home-9643a.cloudfunctions.net/usersMaintenance', user);

    dispatch({
      type: "UPDATE_ROLES",
      payload: response.data,
    });

    resolve();
  })
}
