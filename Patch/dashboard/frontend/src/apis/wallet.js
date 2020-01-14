'use strict';

import Web3 from 'web3';
import utils from '@/common/utils';

class Wallet {
  constructor() {
    this.listener = false;
    // this.account = undefined;
    // this.networkId = undefined;
    // state:
    // 1. undefined
    // 2. installed
    // 3. enabled
    // this.state = undefined;
  };

  async enable() {
    // let web3_ = undefined;
    // let provider = undefined;
    // if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    //   // Web3 browser user detected. You can now use the provider.
    //   // provider = provider = window['ethereum'] || window.web3.currentProvider;
    //   // web3_ = new Web3(provider);

    //   window.ethereum.enable()
    //   // provider.enable()
    //   .then(accounts => {
    //     // You now have an array of accounts!
    //     // Currently only ever one:
    //     // ['0xFDEa65C8e26263F6d9A1B5de9555D2931A33b825']
    //     // alert(accounts);
    //     // const message = '就快完成了！作为最后一步，MetaMask会要求您以数字方式登录您的钱包，并将其与谜恋猫链接。单击按钮以继续';
    //     // utils.notice.confirm(vm, 'warning', vm.langSet.component.alert.warningTitle, message, vm.langSet.component.button.confirm, vm.langSet.component.button.cancel, true, true, () => {
    //     //   alert('confirm');
    //     // }, () => {
    //     //   alert('cancel');
    //     // });
    //     if (func !== null) {
    //       func('enable', accounts[0]);
    //     }
    //   })
    //   .catch(reason => {
    //     // Handle error. Likely the user rejected the login:
    //     // alert(reason);
    //     // console.log(reason === 'User rejected provider access');
    //     func('enable', accounts[0]);
    //   });
    // } else {
    //   // set the provider you want from Web3.providers
    //   // provider = new Web3.providers.HttpProvider('http://localhost:8545');
    //   // web3_ = new Web3(provider);
    //   alert('By signing up, you agree to our Terms of Service and Privacy Policy');
    //   func('web3');
    // }

    try {
      // check if wallet install ?
      if (typeof window.ethereum === 'undefined' && (typeof window.web3 === 'undefined')) {
      // if (typeof window.ethereum === 'undefined') {

        // this.account = undefined;
        // this.state = 'unstalled';
        utils.storage.cookie.remove('wallet_account');
        utils.storage.cookie.remove('wallet_state');

        const reason = {};
        reason.stack = 'unstalled';
        throw reason;
      }

      // this.state = 'installed';
      utils.storage.cookie.set('wallet_state', 'installed', 'N/A');

      let accounts;
      if (typeof window.ethereum !== 'undefined') {
        accounts = await window.ethereum.enable();
      } else {
        if (window.web3 !== undefined && window.web3.currentProvider !== undefined) {
          const web3Client = new Web3(window.web3.currentProvider);
          accounts = await web3Client.eth.getAccounts();
        } else {
          return '';
        }
      }

      // this.account = accounts[0];
      if (accounts[0] !== undefined) {
        utils.storage.cookie.set('wallet_account', accounts[0], 'N/A');
      } else {
        utils.storage.cookie.remove('wallet_account');
      }

      // this.state = 'enabled';
      utils.storage.cookie.set('wallet_state', 'enabled', 'N/A');

      // return this.account;
      return accounts[0];
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

      // if (this.state === 'unstalled') {
      //   this.state = 'installed';
      // }
      if (utils.storage.cookie.get('state') === undefined) {
        utils.storage.cookie.set('wallet_state', 'installed', 'N/A');
      }

      if (this.listener === false) {
        if (window.ethereum.on !== undefined) {
          window.ethereum.on('accountsChanged', accounts => {
            // const message = 'old: ' + this.account + ', new: ' + accounts[0];
            let account = utils.storage.cookie.get('wallet_account');
            // const message = 'old: ' +  account + ', new: ' + accounts[0];
            // alert(message);
            // if ((this.account !== undefined) && (this.account !== accounts[0])) {
            // if ((account !== null) && (account !== accounts[0])) {
            if (account === null && accounts[0] === undefined) {
              return;
            }

            if (account !== accounts[0]) {
              // TODO
              // alert('accountsChanged');
              // this.account = accounts[0];
              // if (this.account === undefined) {
              //   this.state = 'installed';
              // }
              if (accounts[0] === undefined) {
                utils.storage.cookie.remove('wallet_account');
                utils.storage.cookie.set('wallet_state', 'installed', 'N/A');
              } else {
                utils.storage.cookie.set('wallet_account', accounts[0], 'N/A');
              }
              utils.storage.cookie.remove('login_account');
              utils.storage.cookie.remove('login_token');
              utils.storage.cookie.remove('login_id');
              if (vm.$router.currentRoute.name !== 'login') {
                vm.$router.push({name: 'login'});
              } else {
                vm.$router.go(0);
              }
            }
          });
        }
        if (window.ethereum.on !== undefined) {
          window.ethereum.on('networkChanged', networkId => {
            // let network = utils.storage.cookie.set('wallet_network');
            // if (network !== networkId) {
            //   const message = 'Network change from ' + network + ' to ' + networkId;
            //   vm.$message(message);
            //   if (network !== null) {
            //     if (vm.$router.currentRoute.name !== 'login') {
            //       vm.$router.push({name: 'login'});
            //     } else {
            //       vm.$router.go(0);
            //     }
            //   }
            //   if (networkId !== undefined) {
            //     utils.storage.cookie.set('wallet_network', networkId, 'N/A');
            //   } else {
            //     utils.storage.cookie.remove('wallet_network');
            //   }
            // }
            if (networkId !== undefined) {
              utils.storage.cookie.set('wallet_network', networkId, 'N/A');
            } else {
              utils.storage.cookie.remove('wallet_network');
            }
          });
        }
        // window.ethereum.on('connect', () => {
        //   const message = 'Connect';
        //   alert(message);
        // });

        // window.ethereum.on('close', (code, reason) => {
        //   const message = 'Close ' + code + reason;
        //   alert(message);
        // });
      }
      this.listener = true;
    } else {}
  };

  info() {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
    // if (typeof window.ethereum !== 'undefined') {
      // if (this.state === 'unstalled') {
      //   this.state = 'installed';
      // }
      if (utils.storage.cookie.get('wallet_state') === null) {
        utils.storage.cookie.set('wallet_state', 'installed', 'N/A');
      }
    } else {
      // this.account = undefined;
      // this.state = 'unstalled';
      utils.storage.cookie.remove('wallet_account');
      utils.storage.cookie.remove('wallet_state');
    }
    return {account: utils.storage.cookie.get('wallet_account'), state: utils.storage.cookie.get('wallet_state')};
  }
}

export default Wallet;
