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

      const data = Object.values(list).reduce((data, stat) => {
        const item = {
          stat: hexToStr(stat)
        };
        data.content.list.push(item);
        return data;
      }, {
        content: {
          list: []
        }
      });
      return data;
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
      const result = await instance.contract.info(strToBytes32(statId));
      const data = Object.values(result[0]).reduce((data, key, index) => {
        const statKey = hexToStr(key);
        const stat = {
          [statKey]: result[1][index].toNumber()
        };
        data = { ...data, ...stat };
        return data;
      }, {});
      return data;
    } catch (error) {
      throw error;
    }
  };

  async infoByKey(statId, key) {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('infoByKey: contract is null!');
        error.code = 'DAPPStat';
        throw error;
      }
      const result = await instance.contract.infoByKey(strToBytes32(statId), strToBytes32(key));
      return this.einstance.bigNumberToNumber(result);
    } catch (error) {
      throw error;
    }
  };

  async keyCount(statId) {
    try {
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contract) {
        let error = createError('keyCount: contract is null!');
        error.code = 'DAPPStat';
        throw error;
      }
      const result = await instance.contract.keyCount(strToBytes32(statId));
      return this.einstance.bigNumberToNumber(result);
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
      const instance = this.einstance.contract(this.addr, this.abi);
      if (!instance || !instance.contractWithSigner) {
        let error = createError('decrease: contract with signer is null!');
        error.code = 'DAPPStat';
        throw error;
      }

      if (!func) {
      } else {
      }
    } catch (error) {
      throw error;
    }
  };
}

export default Stat;
