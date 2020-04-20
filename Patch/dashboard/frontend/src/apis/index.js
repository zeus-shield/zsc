'use strict';

import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 2000
  // withCredentials: true // bypass cookie from and to server
});

import Wallet from './wallet';
import EWallet from './core/ewallet';

import Demo from './dapp/demo';
import DUser from './dapp/user';

import User from './user';
import Insurance from './insurance';
import Company from './company';

const contracts = {
};

class APIs {
  constructor() {
    this.ethereum = {};
    this.ethereum.wallet = new Wallet();

    this.core = {};
    // this.core.web3 = Web3;
    this.core.ewallet = new EWallet();

    this.dapp = {};
    this.dapp.demo = new Demo(this.core.ewallet, contracts.demo.addr, contracts.demo.abi);
    this.dapp.user = new DUser(this.core.ewallet, contracts.user.addr, contracts.user.abi);

    this.user = new User(instance);
    this.company = new Company(instance);
    this.insurance = new Insurance(instance);
  }
}

export default new APIs();
