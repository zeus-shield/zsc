'use strict';

import createError from 'http-errors';
import { strToBytes32, hexToStr } from '@/apis/dapp/utils';

class Stat {

  constructor(ewallet, addr, abi) {
    this.ewallet = ewallet;
    this.addr = addr;
    this.abi = abi;
  };

  install(addr, abi) {
    this.addr = addr;
    this.abi = abi;
  };
}

export default Stat;
