'use strict';

import createError from 'http-errors';
import { strToBytes32, hexToStr } from '@/apis/dapp/utils';

class Stat {

  constructor(einstance, addr, abi) {
    this.einstance = einstance;
    this.addr = addr;
    this.abi = abi;
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  async list() {
    try {
    } catch (error) {
      throw error;
    }
  };

  async info(statId) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async infoByKey(statId, key) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async keyCount(statId) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async increase(statId, key, value, func = null) {
  };

  async decrease(statId, key, value, func = null) {
  };
}

export default Stat;
