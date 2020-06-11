'use strict';

import createError from 'http-errors';

import ECore from '../core/ecore';

class Scan {

  constructor() {
  };

  addToken(eip, token) {
    if (eip === 'erc20') {
    } else if (eip === 'erc721') {
    } else {}
  };

  async balance(eip, network, account) {
    try {
    } catch (error) {
      throw error;
    }
  };

  async token(eip, network, tokenAddr, account) {
  };
}

export default Scan;
