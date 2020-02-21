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

    let data = new URLSearchParams();
    data.append('name', name);
    // categories is array
    data.append('categories', JSON.stringify(categories));

    let config = {
      // req.headers
      headers: {
        'token': token
        // 'name': name,
        // 'categories': JSON.stringify(categories)
      },

      // req.query
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      // params: data

      // req.body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // - Node only: JSON Object
      data: querystring.parse(data.toString())
    };

    try {
      let res = await instance.post('company/add', null, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async remove(token, name) {
    let data = new URLSearchParams();
    data.append('name', name);

    let config = {
      // req.headers
      headers: {
        'token': token
        // 'name': name
      }

      // req.query
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      // params: data

      // req.body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // - Node only: JSON Object
      // data: querystring.parse(data.toString())
    };

    try {
      let res = await instance.post('company/remove', data, config);
      return res.data;
    } catch (err) {
    }
  },

  async removeCategory(token, name, category) {
    let data = new URLSearchParams();
    data.append('name', name);
    data.append('category', category);

    let config = {
      // req.headers
      headers: {
        'token': token
      }

      // req.query
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      // params: data

      // req.body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // - Node only: JSON Object
      // data: querystring.parse(data.toString())
    };
  },

  async update(token, name, newName, newCategoryNames) {
    let data = new URLSearchParams();
    data.append('name', name);
    data.append('newName', newName);
    data.append('newCategoryNames', JSON.stringify(newCategoryNames));

    let config = {
      // req.headers
      headers: {
        'token': token
      }

      // req.query
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      // params: data

      // req.body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // - Node only: JSON Object
      // data: querystring.parse(data.toString())
    };

    try {
      let res = await instance.post('company/update', data, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async list(token) {
    let config = {
      headers: {
        'token': token
      }
    };
    try {
      let res = await instance.get('company', config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async detail(token, name) {
    let data = new URLSearchParams();
    data.append('name', name);

    let config = {
      // req.headers
      headers: {token},

      // req.query
      // `params` are the URL parameters to be sent with the request
      // Must be a plain object or a URLSearchParams object
      params: data

      // req.body
      // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
      // - Node only: JSON Object
      // data: querystring.parse(data.toString())
    };
    try {
      let res = await instance.get('company/detail', config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
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