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
    let data = new URLSearchParams();
    data.append('company', company);
    data.append('category', category);
    data.append('title', title);
  },

  async update(token, company, category, title, update) {
  },

  async list(token) {
  },

  async detail(token, method, company, category, title, id) {
  },

  async count(token, company, category, title) {
    try {
      let res = await instance.get('insurance/count', config);
      return res.data;
    } catch (err) {
    }
  }
};

export default insurance;
