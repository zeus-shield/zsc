'use strict';

import CryptoJS from 'crypto-js';

import createError from 'http-errors';
import { ethToObject, toBytes32, strToBytes32, strToHex, hexToStr } from '@/apis/dapp/utils';
import utils from '@/common/utils';
import config from '@/apis/dapp/config';

class User {

  constructor(ewallet, addr, abi) {
    this.ewallet = ewallet;
    this.addr = addr;
    this.abi = abi;
    // this.instance = ewallet.contract(addr, abi);
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  // DONE
  _buildPolicyKey(keys, keyPrefix) {
    let maxIndex = -1;
    keys.forEach((key) => {
      const start = key.indexOf(keyPrefix);
      if (start !== -1) {
        const index = parseInt(key.substring(start + keyPrefix.length, key.length), 10);
        maxIndex = index >= maxIndex ? index : maxIndex;
      }
    });

    const key = keyPrefix + (maxIndex + 1);
    return key;
  };

  // DONE
  _preRemove(data) {
  };

  async install(func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async set(id, keys, values, offsets, func = null) {
  };

  async setByDataKey(id, key, value, func = null) {
  };

  // DONE
  async get(id) {
  };
  async statistics(statId) {
  }
}

export default User;
