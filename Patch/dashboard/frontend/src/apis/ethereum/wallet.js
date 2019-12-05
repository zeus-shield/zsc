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

      this.state = 'installed';

      const accounts = await window.ethereum.enable();
      this.account = accounts[0];

      this.state = 'enabled';

      return this.account;
    } catch (reason) {
      if (reason.stack !== 'unstalled') {
        reason.stack = 'denied';
      }
      throw reason.stack;
    }
  };

  addListener(vm) {
    // if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    if (typeof window.ethereum !== 'undefined') {

      if (this.state === 'unstalled') {
        this.state = 'installed';
      }

      if (this.listener === false) {
        window.ethereum.on('accountsChanged', accounts => {
          // const message = 'old: ' + this.account + ', new: ' + accounts[0];
          // alert(message);
          if ((this.account !== undefined) && (this.account !== accounts[0])) {
            // TODO
            // alert('accountsChanged');
            this.account = accounts[0];
            if (this.account === undefined) {
              this.state = 'installed';
            }
            if (vm.$router.currentRoute.name !== 'login') {
              vm.$router.push({name: 'login'});
            } else {
              vm.$router.go(0);
            }
          }
        });

        window.ethereum.on('networkChanged', networkId => {
        });
      }
      this.listener = true;
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
