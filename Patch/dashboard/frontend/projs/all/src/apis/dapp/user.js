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
      // check instance
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('count: contract is null!');
        error.code = 'DAPPUser';
        throw error;
      }
      const result = await instance.contract.count();
      return this.einstance.bigNumberToNumber(result);
    } catch (error) {
      throw error;
    }
  };

  async account(index) {
    try {
      // check instance
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('account: contract is null!');
        error.code = 'DAPPUser';
        throw error;
      }
      const account = await instance.contract.account(index);
      return account.replace(/0+$/gi, '');
    } catch (error) {
      throw error;
    }
  };

  async list() {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('list: contract is null!');
        error.code = 'DAPPUser';
        throw error;
      }
      const accounts = await instance.contract.accounts();
    } catch (error) {
      throw error;
    }
  };

  async info(account) {
    try {
      const _account = this._formatAccount(account);
      const instance = this.einstance.contract(this.addr, this.abi);
    } catch (error) {
      throw error;
    }
  };

  async infoByKey(account, key) {
    try {
      const _account = this._formatAccount(account);
      const instance = this.einstance.contract(this.addr, this.abi);
    } catch (error) {
      throw error;
    }
  };

  async exists(account) {
    try {
      const _account = this._formatAccount(account);

      // check instance
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('exists: contract is null!');
        error.code = 'DAPPUser';
        throw error;
      }
      return await instance.contract.exists(_account);
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

  async addInfo(account, key, info, func = null) {
  };
  async updateInfoByKey(account, key, info, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async removeInfo(account, key, func = null) {
    try {
    } catch (error) {
      throw error;
    }
  }

  async remove(account, func = null) {
    try {
      const _account = this._formatAccount(account);
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contractWithSigner) {
        let error = createError('remove: contract with signer is null!');
        error.code = 'DAPPUser';
        throw error;
      }

      if (!func) {
        const tx = await instance.contractWithSigner.remove(_account);
        await tx.wait();
        return tx.hash;
      } else {
        instance.contractWithSigner.remove(_account).then(tx => {
          this.einstance.receipt(tx.hash, 0, 1000, func);
        }).catch(error => {
        });
      }
    } catch (error) {
      throw error;
    }
  };
}

export default User;
