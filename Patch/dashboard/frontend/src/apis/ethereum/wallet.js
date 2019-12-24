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
          if (this.networkId !== networkId) {
            const message = 'Network change from ' + this.networkId + ' to ' + networkId;
            vm.$message(message);
            if (this.networkId !== undefined) {
              if (vm.$router.currentRoute.name !== 'login') {
                vm.$router.push({name: 'login'});
              } else {
                vm.$router.go(0);
              }
            }
            this.networkId = networkId;
          }
        });

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
