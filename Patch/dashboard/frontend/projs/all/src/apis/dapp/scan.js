'use strict';

import createError from 'http-errors';

class Scan {

  constructor(einstance) {
    this.einstance = einstance;
    this.erc20Tokens = [];
    this.erc20TokenAbi = [
    ];
    this.erc721Tokens = [];
    this.erc721TokenAbi = [];
  };

  addToken(eip, token) {
    if (eip === 'erc20') {
      this.erc20Tokens.push(token);
    } else if (eip === 'erc721') {
      this.erc721Tokens.push(token);
    } else {}
  };

  async balance(eip, network, account) {
    try {
      let balance = 0;
      if (eip === 'erc20') {
        const setting = {
          network: network,
          param: 'default'
        };
        const _balance = await this.einstance.balance(account, setting);
        balance = this.einstance.formatEther(_balance);
      } else if (eip === 'erc721') {} else {}
      return balance;
    } catch (error) {
      throw error;
    }
  };

  async token(eip, network, tokenAddr, account) {
    try {
      const accountObj = {
        setting: {
          network: network,
          param: 'default'
        }
      };
    } catch (error) {
      throw error;
    }
  };
}

export default Scan;
