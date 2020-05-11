'use strict';

import createError from 'http-errors';
import { ethToObject, strToBytes32, strToHex, hexToStr } from '@/apis/dapp/utils';
import utils from '@/common/utils';
import config from '@/apis/dapp/config';

class User {

  constructor(ewallet, addr, abi) {
    this.ewallet = ewallet;
    this.addr = addr;
    this.abi = abi;
    // this.instance = ewallet.contract(addr, abi);
  };

  init(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };

  // DONE
  _buildPolicyKey(keys, keyPrefix) {
  };
  async statistics(statId) {
  }
}

export default User;
