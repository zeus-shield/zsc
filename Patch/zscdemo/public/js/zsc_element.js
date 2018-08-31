/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCElement(userName, controlApisAdvAbi, controlApisAdvAdr) {
    this.userName = userName;
    this.userType;
    this.enName;
    this.parameNos = 0;
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.nameTags = [];
    this.valueTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = controlApisAdvAdr;
    this.contractAbi = JSON.parse(controlApisAdvAbi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCElement.prototype.setUserType = function(type) {this.userType = type;}

ZSCElement.prototype.setElementName = function(nm) {this.enName = nm;}

ZSCElement.prototype.getElementName = function() { return this.enName;}
