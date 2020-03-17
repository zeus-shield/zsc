'use strict';

import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});

import Wallet from './wallet';
import User from './user';
import Insurance from './insurance';
import Company from './company';

class APIs {
  constructor() {
    this.ethereum = {};
    this.ethereum.wallet = new Wallet();

    this.user = new User(instance);
    this.company = new Company(instance);
    this.insurance = new Insurance(instance);
  }
}

export default new APIs();
