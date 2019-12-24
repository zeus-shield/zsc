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

  async remove(token, name) {
  },

  async removeCategory(token, name, category) {
  },

  async update(token, name, newName, newCategoryNames) {
  },

  async list(token) {
  },

  async detail(token, name) {
  },

  async groupCategoriesByName(token) {
    let config = {
      headers: {
        'token': token
      }
    };
    try {
      let res = await instance.get('company/groupCategoriesByName', config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  }
};

export default company;