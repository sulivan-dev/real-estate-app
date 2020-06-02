import axios from 'axios';

export const sendEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    const response = await axios.post('https://us-central1-home-9643a.cloudfunctions.net/mailSend', email);
    resolve(response);
  })
}
