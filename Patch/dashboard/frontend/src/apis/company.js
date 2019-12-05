'use strict';

import axios from 'axios';
import querystring from 'querystring';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});

const company = {
  async add(token, name, categories) {
  },
};

export default company;