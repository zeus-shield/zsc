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

  async list() {
  };

  async info(statId) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async infoByKey(statId, key) {
  };

  async keyCount(statId) {
  };

  async increase(statId, key, value, func = null) {
  };

  async decrease(statId, key, value, func = null) {
  };
}

export default Stat;
