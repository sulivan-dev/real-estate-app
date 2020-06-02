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

export const createRoles = (dispatch, user, role) => {
  return new Promise(async (resolve, reject) => {
    const params = {
      id: user.id,
      role: role,
      roles: user.roles,
    }
    const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/usersMaintenance`, params);

    dispatch({
      type: "UPDATE_ROLES",
      payload: response.data,
    });

    resolve();
  })
}
