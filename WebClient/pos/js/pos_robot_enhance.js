/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotEnhance(nm, abi, adr) {
    this.userName = nm;
    this.robotNos = 0;
    this.robotIds = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotEnhance.prototype.getUserName = function() {return this.userName;}

ZSCRobotEnhance.prototype.getRobotId = function(index) { return this.robotIds[index];}

