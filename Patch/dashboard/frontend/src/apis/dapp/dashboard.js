'use strict';

import CryptoJS from 'crypto-js';

import createError from 'http-errors';
import { ethToObject, toBytes32, strToBytes32, strToHex, hexToStr } from '@/apis/dapp/utils';
import utils from '@/common/utils';
import config from '@/apis/dapp/config';

class Dashboard {

  constructor(ewallet, addr, abi) {
    this.ewallet = ewallet;
    this.addr = addr;
    this.abi = abi;
  };

  install(addr, abi) {
  };
}

export default Dashboard;
