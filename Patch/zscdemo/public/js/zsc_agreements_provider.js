/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementProvider(nm, abi, adr) {
    this.userName = nm;
    this.tmpName;
    this.agrNos = 0;
    this.agrNames = [];
    this.balance = [];
    this.status = [];
    this.itemTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}