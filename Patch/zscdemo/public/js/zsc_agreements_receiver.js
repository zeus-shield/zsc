/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementReceiver(nm, abi, adr) {
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

ZSCAgreementReceiver.prototype.getUserName = function() {return this.userName;}

ZSCAgreementReceiver.prototype.setTemplateName = function(name) {this.tmpName = name;}

ZSCAgreementReceiver.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCAgreementReceiver.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}