'use strict';

import axios from 'axios';
import querystring from 'querystring';

const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});

const user = {
  signUpCommon(account, password, func) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    return instance.post('user', params).then(res => {
      func(0, res.data);
    }).catch(err => {
      func(err, err.response.data);
    });
  },
  loginCommon(account, password, func) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    return instance.post('user/login', params).then(res => {
      func(0, res.data);
    }).catch(err => {
      func(err, err.response.data);
    });
  },
  infoCommon(id, account, token, func) {
    let config = {
      headers: {
        'token': token,
        '_id': id
      }
    };
    return instance.get(`user/${account}`, config).then(res => {
      func(0, res.data);
    }).catch(err => {
      func(err, err.response.data);
    });
  },
  signUpPromise(account, password) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    return new Promise((resolve, reject) => {
      instance.post('user', params).then(res => {
        // func(0, res.data);
        resolve(res.data);
      }).catch(err => {
        // func(err, err.response.data);
        reject(err.response.data);
      });
    });
  },
  loginPromise(account, password) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    return new Promise((resolve, reject) => {
      instance.post('user/login', params).then(res => {
        // func(0, res.data);
        resolve(res.data);
      }).catch(err => {
        // func(err, err.response.data);
        reject(err.response.data);
      });
    });
  },
  async buildEmailCode(account) {
    let params = new URLSearchParams();
    params.append('account', account);
    try {
      let res = await instance.post('user/emailCode', params);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },
  async signUp(account, code, password) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    params.append('code', code);
    try {
      let res = await instance.post('user/signUp', params);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },
  async login(account, password, code) {
    let params = new URLSearchParams();
    params.append('account', account);
    params.append('password', password);
    params.append('code', code);
    try {
      let res = await instance.post('user/login', params);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async setTOTP(id, token, cmd) {
    let config = {
      // req.headers
      headers: {
        '_id': id,
        'token': token,
        'cmd': cmd
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
      let res = await instance.post('user/setTOTP', null, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async saveTOTP(id, token, code, key) {
    let config = {
      // req.headers
      headers: {
        '_id': id,
        'token': token,
        'code': code,
        'key': key
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
      let res = await instance.post('user/saveTOTP', null, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async setTOTPOn(token, code, id, on) {
    let data = new URLSearchParams();
    data.append('on', on);

    let config = {
      // req.headers
      headers: {
        'token': token,
        'code': code,
        '_id': id
        // 'on': on
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
      let res = await instance.post('user/updateTOTP', data, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async addPolicy(token, id, policy) {
    let data = new URLSearchParams();
    data.append('id', id);
    data.append('policy', JSON.stringify(policy));

    let config = {
      // req.headers
      headers: {token},

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
      let res = await instance.post('user/addPolicy', null, config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async statistics(token, company, category, title, sort, limit) {
    let data = new URLSearchParams();
    data.append('company', company);
    data.append('category', category);
    data.append('title', title);
    data.append('sort', sort);
    data.append('limit', limit);

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
      let res = await instance.get('statistics', config);
      return res.data;
    } catch (err) {
      if (err.response !== undefined) {
        throw err.response.data;
      } else {
        throw err.message;
      }
    }
  },

  async info(id, token) {
    let config = {
      headers: {
        'token': token,
        '_id': id
      }
    };
    try {
      let res = await instance.get('user/detail', config);
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

export default user;
