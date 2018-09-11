/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCBlock(nm, abi, adr) {
    this.userName = nm;
    this.totalBlockNos;
    this.minedBlockNos;
    this.poolIndex;
    this.blockSizes = [];
    this.blockTxNos = [];
    this.minedStatus = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCBlock.prototype = new ZSCClient();

ZSCBlock.prototype.getUserName = function() {return this.userName;}

ZSCBlock.prototype.getTotalBlockNos = function() {return this.totalBlockNos;}

ZSCBlock.prototype.getMinedBlockNos = function() {return this.minedBlockNos;}