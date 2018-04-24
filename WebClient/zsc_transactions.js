/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTransactions(nm, abi, adr) {
    this.userName = nm;
    this.nos;
    this.tokenSymbol;
    this.timeMoments = [];
    this.inputTags = [];
    this.amounts = [];
    this.senders = [];
    this.receivers = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.setTokenSymbol = function(symbol) {return this.tokenSymbol = symbol;}

ZSCWallet.prototype.getTokenSymbol = function() { return this.tokenSymbol;}

ZSCWallet.prototype.getTimeMoment = function(index) { return this.timeMoments[index];}

ZSCWallet.prototype.getAmount = function(index) { return this.amounts[index];}

ZSCWallet.prototype.getSender = function(index) { return this.senders[index];}

ZSCWallet.prototype.getReceiver = function(index) { return this.receivers[index];}

ZSCWallet.prototype.getInputTag = function(index) { return this.inputTags[index];}

ZSCWallet.prototype.getTransactionNos = function() { return this.nos; }


