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
  infoCommon(id, account, token, func) {},
  signUpPromise(account, password) {},
  loginPromise(account, password) {},
  info(func) {}
};

export default user;
