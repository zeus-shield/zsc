/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.userType;
    this.tokenNos = 1;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenBalance = [];
    this.tokenStatus = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCWallet.prototype = new ZSCClient();

ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.setUserName = function(nm) {this.userName = nm; }

ZSCWallet.prototype.setUserType = function(type) {this.userType = type;}

ZSCWallet.prototype.getUserType = function() {return this.userType;}
