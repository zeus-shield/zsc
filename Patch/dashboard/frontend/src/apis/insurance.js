'use strict';

import axios from 'axios';
import querystring from 'querystring';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});

const insurance = {
  async add(token, company, category, brief, detail) {
    try {
      let res = await instance.post('insurance/add', null, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async remove(token, company, category, title) {
  },

  async update(token, company, category, title, update) {
  },

  async list(token) {
  },
  async count(token, company, category, title) {
  }
};

export default insurance;
