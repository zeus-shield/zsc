'use strict';

import CryptoJS from 'crypto-js';

import createError from 'http-errors';
import { ethToObject, toBytes32, strToBytes32, strToHex, hexToStr } from '@/apis/dapp/utils';

class Reward {

  constructor(einstance, addr, abi) {
    this.einstance = einstance;
    this.addr = addr;
    this.abi = abi;
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  _formatAccount(account) {
    let _account;
    if (account.raw) {
      _account = toBytes32('0x' + CryptoJS.MD5(account.raw).toString());
    } else if (account.crypto) {
      _account = toBytes32(account.crypto);
    } else {
      let error = createError('_formatAccount: account error!');
      error.code = 'DAPPUser';
      throw error;
    }
    return _account;
  }

  async cap() {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('cap: contract is null!');
        error.code = 'DAPPReward';
        throw error;
      }
      const result = await instance.contract.cap();
      return this.einstance.bigNumberToNumber(result);
    } catch (error) {
      throw error;
    }
  };

  async totalSupply() {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('totalSupply: contract is null!');
        error.code = 'DAPPReward';
        throw error;
      }
      const result = await instance.contract.totalSupply();
      return this.einstance.bigNumberToNumber(result);
    } catch (error) {
      throw error;
    }
  };

  async threshold(index) {
  };

  async balanceOf(owner) {
  };

  async traces(account) {
  };

  async traceCount(account) {
  };

  async traceByIndex(account, index) {
  };

  async traceTimeKeys(account) {
  };

  async updateCap(newCap, func = null) {
  };

  async updateThreshold(index, threshold, func = null) {
  };

  async transfer(from, to, value, func = null) {
  };

  async mint(account, index, func = null) {
  };

  async burn(account, amount, func = null) {
  };

  async addTrace(account, timeKey, trace, func = null) {
  };

  async removeTrace(account, timeKey, func = null) {
  };

  async removeAllTraces(account, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };
}

export default Reward;
