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
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  _formatAccount(account) {
  }

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

  async list(cmd) {
  };

  async info(account) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async policyKeys(account) {
  };

  async addPolicy(account, keyObj, policy, func = null) {
  };
  }

  async remove(account, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };
}

export default User;
