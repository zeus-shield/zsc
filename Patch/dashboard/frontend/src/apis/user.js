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
    });
  },
  async buildEmailCode(account) {
    let params = new URLSearchParams();
    params.append('account', account);
  },
  async signUp(account, code, password) {};
  async login(account, password) {},
  async setTOTP(id, token, cmd) {},
  async saveTOTP(id, token, code, key) {},
  async setTOTPOn(token, code, id, on) {};
  async info(id, token) {
};

export default user;
