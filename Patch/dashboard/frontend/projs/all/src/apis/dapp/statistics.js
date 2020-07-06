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
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('list: contract is null!');
        error.code = 'DAPPStat';
        throw error;
      }
      const list = await instance.contract.list();
    } catch (error) {
      throw error;
    }
  };

  async info(statId) {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('info: contract is null!');
        error.code = 'DAPPStat';
        throw error;
      }
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
    try {
    } catch (error) {
      throw error;
    }
  };

  async decrease(statId, key, value, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };
}

export default Stat;
