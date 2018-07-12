/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotMarket(nm, abi, adr) {
    this.userName = nm;
    this.robotNos = 0;
    this.robotIds = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotMarket.prototype.getUserName = function() {return this.userName;}

ZSCRobotMarket.prototype.getRobotId = function(index) { return this.robotIds[index];}

