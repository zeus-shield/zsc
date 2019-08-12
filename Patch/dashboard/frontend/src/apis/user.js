'use strict';

import axios from 'axios';

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
  signUpPromise(account, password) {},
  loginPromise(account, password) {},
  async buildEmailCode(account) {},
  async login(account, password) {},
  info(func) {}
};

export default user;
