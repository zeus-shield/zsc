# ZSC
[ZSC Wiki](https://github.com/zeus-shield/zsc/wiki)

[ZSC APIs](https://github.com/zeus-shield/zsc/wiki#zscapireference) 

Zeusshield (ZSC) system: AI&P2P Insurance Market Platform 

Official implementation for the solidity-based core part of the ZSC system, as well as the js-based web-client and js/php based web-adm.

## Implementation overview
1st large-scale Dapp fully settled on the Ethereum platform. Every operation in the system is accomplished through Ethereum. The ZSC development team is leading the architecture design for the pure Ethereum-based large scale Dapp.

## Project structure
```bash
|-- Database:  
    |-- Core part of zsc system
    |-- Solidity based implementation
    |-- Setup in the ethereum platform
|-- Token:     
    |-- zsc token contract
    |-- Based on ERC20 protocol
|-- WebAdm
    |-- web3.js, javascript and php based implementation
    |-- Compatible with Metamask 
    |-- Used by the administrator to setup the ZSC system
|-- WebClient
    |-- web3.js and javascript based implementation
    |-- Compatible with Metamask 
    |-- Used by ZSC users to do the operations in the ZSC system
|-- WebTest
    |-- web3.js and javascript based implementation
    |-- Compatible with Metamask 
    |-- Used by the ZSC Dev. team to do development on new modules and testing work
```

## Other information and update log are moved to the file update_log.md
