'use strict';

class Wallet {
  constructor() {
    this.listener = false;
    this.account = undefined;
    this.networkId = undefined;
    // state:
    // 1. unstalled
    // 2. installed
    // 3. enabled
    this.state = 'unstalled';
  };
  async enable() {
    try {
      // check if wallet install ?
      // if (typeof window.ethereum === 'undefined' && (typeof window.web3 === 'undefined')) {
      if (typeof window.ethereum === 'undefined') {

        this.account = undefined;
        this.state = 'unstalled';

        const reason = {};
        reason.stack = 'unstalled';
        throw reason;
      }
    } catch (reason) {
    }
  };

  addListener(vm) {
    // if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    if (typeof window.ethereum !== 'undefined') {

      if (this.state === 'unstalled') {
        this.state = 'installed';
      }
    } else {}
  };

  info() {
    // if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    if (typeof window.ethereum !== 'undefined') {
      if (this.state === 'unstalled') {
        this.state = 'installed';
      }
    } else {
      this.account = undefined;
      this.state = 'unstalled';
    }
    return {account: this.account, state: this.state};
  }
}

export default Wallet;
