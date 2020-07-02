'use strict';

import CryptoJS from 'crypto-js';

import createError from 'http-errors';
import { ethToObject, toBytes32, strToBytes32, strToHex, hexToStr, repeatNum } from './utils';
import config from './config';

class Dashboard {

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
  }

  _buildPolicyKey(keys, keyPrefix) {
  };

  // statIds: ["STAT_COMPANY", "STAT_PRODUCT"]
  // statKeys: [
  //   "PINGAN", "PICC",
  //   "PINGAN_ZYYL_ESBYLPB", "PINGAN_ZYYL_SHYBGMZYZFYL", "PICC_YW_RSYWQNJQB", "PICC_ZYYL_RRAKBWYLJTB"
  // ]
  // values: [3, 3, 2, 1, 2, 1]
  // indexes: [0, 2, 6]
  _statInfo(data) {
  };
}

export default Dashboard;
