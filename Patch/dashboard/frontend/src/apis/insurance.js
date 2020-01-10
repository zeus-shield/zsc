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

    let data = new URLSearchParams();
    data.append('company', company);
    data.append('category', category);
    data.append('brief', JSON.stringify(brief));
    data.append('detail', JSON.stringify(detail));

    let config = {
      // req.headers
      headers: {
        'token': token
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
      let res = await instance.post('insurance/remove', data, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async update(token, company, category, title, update) {
    let data = new URLSearchParams();
    data.append('company', company);
    data.append('category', category);
    data.append('title', title);
    data.append('update', JSON.stringify(update));

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
      let res = await instance.post('insurance/update', data, config);
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
      let res = await instance.get('insurance', config);
      return res.data;
    } catch (err) {
    }
  },

  async detail(token, method, company, category, title, id) {
  },

  async count(token, company, category, title) {
    try {
      let res = await instance.get('insurance/count', config);
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

export default insurance;
