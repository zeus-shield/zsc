'use strict';

import CryptoJS from 'crypto-js';

import createError from 'http-errors';
import { ethToObject, toBytes32, strToBytes32, strToHex, hexToStr } from '@/apis/dapp/utils';
import config from '@/apis/dapp/config';

class User {

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

  async count() {
    try {
    } catch (error) {
      throw error;
    }
  };

  async account(index) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async list() {
    try {
    } catch (error) {
      throw error;
    }
  };

  async info(account) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async infoByKey(account, key) {
  };

  async exists(account) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async keys(account) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async addPolicy(account, keyObj, policy, func = null) {
  };

  async removeInfo(account, key, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  }

  async remove(account, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };
}

export default User;
