'use strict';

import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});
class APIs {
}

export default new APIs();
