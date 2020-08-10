'use strict';

import axios from 'axios';
const instance = axios.create({
  // baseURL: 'http://localhost:3000/',
  // baseURL: 'https://dashboard.ink/backend/',
  baseURL: process.env.BASE_URL,
  timeout: 60000
  // withCredentials: true // bypass cookie from and to server
});

// import Wallet from './wallet';
import EWallet from './core/ewallet';

import Demo from './dapp/demo';
import DUser from './dapp/user';
import DReward from './dapp/reward';
import DStat from './dapp/statistics';
import DDashboard from './dapp/dashboard';

import User from './user';
import Company from './company';
import Insurance from './insurance';
import QA from './qa';
import Press from './press';
import Token from './token';

let contracts = {
  user: {
    addr: '',
    abi: [
    ]
  },
  reward: {
    addr: '',
    abi: [
    ]
  },
  stat: {
    addr: '',
    abi: [
    ]
  },
  dashboard: {
    addr: '',
    abi: [
    ]
  }
  }
};

class APIs {
  constructor() {
    this.ethereum = {};
    // this.ethereum.wallet = new Wallet();

    this.core = {};
    // this.core.web3 = Web3;
    this.core.ewallet = new EWallet();

    this.dapp = {};
    this.dapp.demo = new Demo(this.core.ewallet, contracts.demo.addr, contracts.demo.abi);
    this.dapp.user = new DUser(this.core.ewallet, contracts.user.addr, contracts.user.abi);
    this.dapp.reward = new DReward(this.core.ewallet, contracts.reward.addr, contracts.reward.abi);
    this.dapp.stat = new DStat(this.core.ewallet, contracts.stat.addr, contracts.stat.abi);
    this.dapp.dashboard = new DDashboard(this.core.ewallet, contracts.dashboard.addr, contracts.dashboard.abi);

    this.user = new User(instance);
    this.company = new Company(instance);
    this.insurance = new Insurance(instance);
    this.qa = new QA(instance);
    this.press = new Press(instance);
    this.token = new Token(instance);

    this.iot = new IOT(instance);
  }
}

export default new APIs();
