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
      let instance = null;
      if (eip === 'erc20') {
        instance = this.einstance.contract(tokenAddr, this.erc20TokenAbi, accountObj);
      } else if (eip === 'erc721') {
        instance = this.einstance.contract(tokenAddr, this.erc721TokenAbi, accountObj);
      } else {
        let error = createError('tokenDetail: token eip do not support!');
        error.code = 'DAPPScan';
        throw error;
      }

      if (!instance || !instance.contract) {
        let error = createError('tokenDetail: contract with signer is null!');
        error.code = 'DAPPScan';
        throw error;
      }

      let info;
      if (eip === 'erc20') {
        const _balanceOf = await instance.contract.balanceOf(account);
        const balanceOf = this.einstance.formatEther(_balanceOf);
        info = { balanceOf };
      } else if (eip === 'erc721') {} else {}
      return info;
    } catch (error) {
      throw error;
    }
  };
}

export default Scan;
