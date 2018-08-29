/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementAll(nm, abi, adr) {
    this.userName = nm;
    this.userType;
    this.allAgrNos = 0;
    this.allAgrNames = [];
    this.allAgrStatus = [];
    this.itemTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCAgreementAll.prototype.getUserName = function() {return this.userName;}

ZSCAgreementAll.prototype.setUserType = function(type) {this.userType = type;}
