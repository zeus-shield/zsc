'use strict';

module.exports = {
  dbConfig: {
  },
  // NETWORK:
  // 1. homestead(chainId=1)
  // 2. ropsten(chainId=3)
  // 3. rinkeby(chainId=4)
  // 4. kovan(chainId=42)
  // 5. auto
  //   5.1 web3 current(eg. metamask)
  //   5.2 web3 http(eg. http://localhost:8545)
  // PARAM:
  // 1. default/infura/etherscan, (if NETWORK is 'homestead/ropsten/rinkeby/kovan')
  // 2. null, (if NETWORK is 'auto' for web3 current)
  // 3. url, (if NETWORK is 'auto' for http)
  // url config
  // bcConfig: {
  //   wallet: {
  //     ADDR: '0x15ca13630ce52cd4e209012635f10b396e098296',
  //     KEY: ''
  //   },
  //   NETWORK: 'auto',
  //   PARAM: 'http://localhost:8545'
  // },
  // rinkeby config
  bcConfig: {
  },
  mongooseDebug: true,
  adminConfig: {
  },
  qiniuConfig: {
    originUrl: ''
  },
  upload: {
  }
}
