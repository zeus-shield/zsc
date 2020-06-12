'use strict';

import createError from 'http-errors';
import { strToBytes32, hexToStr } from '@/apis/dapp/utils';

class Stat {

  constructor(ewallet, addr, abi) {
    this.ewallet = ewallet;
    this.addr = addr;
    this.abi = abi;
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  async info(statId, key) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async allInfo(statId) {
  };
}

export default Stat;
